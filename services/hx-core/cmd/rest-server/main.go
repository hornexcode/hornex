package main

import (
	"context"
	goerrors "errors"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/auth/cognito"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/postgresql"
	"hornex.gg/hx-core/internal/rest"
	"hornex.gg/hx-core/internal/services"

	"github.com/didip/tollbooth/v6"
	"github.com/didip/tollbooth/v6/limiter"
	"github.com/riandyrn/otelchi"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"go.uber.org/zap"

	cognitorepositories "hornex.gg/hx-core/internal/repositories/cognito"
	postgresqlrepositories "hornex.gg/hx-core/internal/repositories/postgresql"
)

type loggerKey struct{}

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

	// - Cognito initialization

	cognitoClient := cognito.NewCognitoClient("sa-east-1", "3nllt32pm2occfqukt07lhf4qf")
	// msg, err := cognitoAuthClient.SignUp("pehome7132@kkoup.com", "Passw0rd!123", "Test", "User", "1990-01-01")
	// msg, err := cognitoAuthClient.ConfirmSignUp("pehome7132@kkoup.com", "036849")
	// msg, output, err := cognitoAuthClient.SignIn("pehome7132@kkoup.com", "Passw0rd!123")

	// if err != nil {
	// 	fmt.Printf("Error: %s \n", err)
	// 	panic(err)
	// }

	// fmt.Printf("Message: \n" + fmt.Sprintf("%s \n %s \n", msg, *output.AuthenticationResult.IdToken))

	// // faking a token not valid
	// providedUser, err := cognito.ProviderUser(*output.AuthenticationResult.IdToken)
	// if err != nil {
	// 	fmt.Printf("Error: %s \n", err)
	// 	panic(err)
	// }

	// fmt.Println(providedUser)

	// - Server initialization
	srv, err := newServer(ServerConfig{
		Address:     address,
		DB:          pool,
		Middlewares: []func(next http.Handler) http.Handler{otelchi.Middleware("todo-api-server"), logging},
		Logger:      logger,
		Cognito:     cognitoClient,
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
	Cognito     cognito.Client
}

func newServer(conf ServerConfig) (*http.Server, error) {
	router := chi.NewRouter()
	router.Use(render.SetContentType(render.ContentTypeJSON))

	// - Context initialization

	// router.Use(func(next http.Handler) http.Handler {
	// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		ctx := r.Context()

	// 		ctx = cognito.WithClient(ctx, cognitoAuthClient)

	// 		next.ServeHTTP(w, r.WithContext(ctx))
	// 	})
	// })

	// - Middlewares

	for _, mw := range conf.Middlewares {
		router.Use(mw)
	}

	// -

	hasher := auth.NewHasher()
	urepo := postgresqlrepositories.NewPostgresqlUserRepositoryImpl(conf.DB)
	auth := cognitorepositories.NewCognitoImpl(conf.Cognito)
	usvc := services.NewUserService(urepo, hasher, auth)
	rest.NewUserHandler(usvc).Register(router)

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
