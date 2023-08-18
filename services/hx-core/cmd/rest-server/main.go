package main

import (
	"context"
	goerrors "errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/postgresql"
	"hornex.gg/hornex/rabbitmq"

	"github.com/didip/tollbooth/v6"
	"github.com/didip/tollbooth/v6/limiter"
	"github.com/riandyrn/otelchi"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"go.uber.org/zap"

	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"

	postgres "hornex.gg/hx-core/internal/postgresql"
	rmq "hornex.gg/hx-core/internal/rabbitmq"
	"hornex.gg/hx-core/internal/rest"
	"hornex.gg/hx-core/internal/services"
)

func main() {
	var env, address string

	flag.StringVar(&env, "env", "", "Environment Variables filename")
	flag.StringVar(&address, "address", ":9234", "HTTP Server Address")
	flag.Parse()

	errC, err := run(env, address)
	if err != nil {
		log.Fatalf("Couldn't run: %s", err)
	}

	if err := <-errC; err != nil {
		log.Fatalf("Error while running: %s", err)
	}
}

func run(env, address string) (<-chan error, error) {
	// - Logger initialization
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "failed to create logger")
	}

	// - Environment variables initialization
	if err := envvar.Load(env); err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "envvar.Load")
	}

	conf := envvar.New()

	logging := func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger.Info(r.Method,
				zap.Time("time", time.Now()),
				zap.String("url", r.URL.String()),
			)

			h.ServeHTTP(w, r)
		})
	}

	// - Database initialization
	pool, err := postgresql.NewPostgreSQL(conf)
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "internal.NewPostgreSQL")
	}

	// - Rabbitmq initialization
	rmq, err := rabbitmq.NewRabbitMQ(conf)
	if err != nil {
		return nil, fmt.Errorf("internal.NewRabbitMQ %w", err)
	}

	// - Server initialization
	srv, err := newServer(ServerConfig{
		Address:     address,
		DB:          pool,
		Middlewares: []func(next http.Handler) http.Handler{otelchi.Middleware("todo-api-server"), logging},
		Logger:      logger,
		RabbitMQ:    rmq,
	})
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "newServer")
	}

	errC := make(chan error, 1)

	ctx, stop := signal.NotifyContext(context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
		syscall.SIGQUIT)

	go func() {
		<-ctx.Done()

		logger.Info("Shutdown signal received")

		ctxTimeout, cancel := context.WithTimeout(context.Background(), 5*time.Second)

		defer func() {
			_ = logger.Sync()

			pool.Close()
			stop()
			cancel()
			close(errC)
		}()

		srv.SetKeepAlivesEnabled(false)

		if err := srv.Shutdown(ctxTimeout); err != nil { //nolint: contextcheck
			errC <- err
		}

		logger.Info("Shutdown completed")
	}()

	go func() {
		logger.Info("Listening and serving", zap.String("address", address))

		// "ListenAndServe always returns a non-nil error. After Shutdown or Close, the returned error is
		// ErrServerClosed."
		if err := srv.ListenAndServe(); err != nil && !goerrors.Is(err, http.ErrServerClosed) {
			errC <- err
		}
	}()

	return errC, nil
}

type ServerConfig struct {
	Address     string
	DB          *pgxpool.Pool
	Metrics     http.Handler
	Middlewares []func(next http.Handler) http.Handler
	Logger      *zap.Logger
	Cognito     *cognitoidentityprovider.CognitoIdentityProvider
	RabbitMQ    *rabbitmq.RabbitMQ
}

func newServer(conf ServerConfig) (*http.Server, error) {
	router := chi.NewRouter()
	router.Use(render.SetContentType(render.ContentTypeJSON))

	for _, mw := range conf.Middlewares {
		router.Use(mw)
	}

	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// -

	postgresqlClient := postgresql.NewClient(conf.DB)

	urepo := postgres.NewUser(conf.DB)
	evrepo := postgres.NewEmailConfirmationCode(conf.DB)
	trepo := postgres.NewPostgresqlTeamRepositoryImpl(conf.DB)
	grepo := postgres.NewPostgresqlGameRepositoryImpl(conf.DB)
	arepo := postgres.NewPostgresqlAccountRepositoryImpl(conf.DB)
	irepo := postgres.NewPostgresqlInviteRepositoryImpl(conf.DB)
	tournamentRepo := postgres.NewPostgresqlTournamentRepositoryImpl(conf.DB)

	msgBroker := rmq.NewUser(conf.RabbitMQ.Channel)

	usvc := services.NewUser(urepo, msgBroker, evrepo)
	tsvc := services.NewTeamService(trepo, urepo)
	gsvc := services.NewGameService(grepo)
	asvc := services.NewAccountService(arepo)
	isvc := services.NewInviteService(irepo, urepo, trepo)
	tournamentService := services.NewTournamentService(tournamentRepo, urepo)

	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx = postgresql.WithClient(ctx, postgresqlClient)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})

	// -

	rest.NewUserHandler(usvc).Register(router)
	rest.NewTeamHandler(tsvc).Register(router)
	rest.NewGameHandler(gsvc).Register(router)
	rest.NewLOLAccountHandler(asvc).Register(router)
	rest.NewInviteHandler(isvc).Register(router)
	rest.NewTournamentHandler(tournamentService).Register(router)

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// fsys, _ := fs.Sub(content, "static")
	// router.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.FS(fsys))))

	router.Handle("/metrics", conf.Metrics)

	// -

	lmt := tollbooth.NewLimiter(3, &limiter.ExpirableOptions{DefaultExpirationTTL: time.Second})

	lmtmw := tollbooth.LimitHandler(lmt, router)

	return &http.Server{
		Handler:           lmtmw,
		Addr:              conf.Address,
		ReadTimeout:       5 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       15 * time.Second,
	}, nil
}
