package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"
	"hornex.gg/hornex-consumer/internal"
	internalresend "hornex.gg/hornex-consumer/internal/resend"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/rabbitmq"
	"hornex.gg/hornex/resend"
)

const rabbitMQConsumerName = "resend-mailer-rabbitmq"

func main() {
	var env string

	flag.StringVar(&env, "env", "", "Environment Variables filename")
	flag.Parse()

	errC, err := run(env)
	if err != nil {
		log.Fatalf("Couldn't run: %s", err)
	}

	if err := <-errC; err != nil {
		log.Fatalf("Error while running: %s", err)
	}

}

func run(env string) (<-chan error, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "zap.NewProduction")
	}

	if err := envvar.Load(env); err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "envvar.Load")
	}

	conf := envvar.New(nil)

	// -

	rmq, err := rabbitmq.NewRabbitMQ(conf)
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "internal.newRabbitMQ")
	}

	rsndClient := resend.NewClient(conf)
	msvc := internalresend.NewMatch(rsndClient)

	srv := &Server{
		logger: logger,
		rmq:    rmq,
		match:  msvc,
		done:   make(chan struct{}),
	}

	errC := make(chan error, 1)

	ctx, stop := signal.NotifyContext(context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
		syscall.SIGQUIT)

	go func() {
		<-ctx.Done()

		logger.Info("Shutdown signal received")

		ctxTimeout, cancel := context.WithTimeout(context.Background(), 10*time.Second)

		defer func() {
			_ = logger.Sync()

			rmq.Close()
			stop()
			cancel()
			close(errC)
		}()

		if err := srv.Shutdown(ctxTimeout); err != nil { //nolint: contextcheck
			errC <- err
		}

		logger.Info("Shutdown completed")
	}()

	go func() {
		logger.Info("Listening and serving")

		if err := srv.ListenAndServe(); err != nil {
			errC <- err
		}
	}()

	return errC, nil
}

type Server struct {
	logger *zap.Logger
	rmq    *rabbitmq.RabbitMQ
	match  *internalresend.Match
	done   chan struct{}
}

// ListenAndServe ...
// XXX: Dead Letter Exchange will be implemented in future episodes.
func (s *Server) ListenAndServe() error {
	queue, err := s.rmq.Channel.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "channel.QueueDeclare")
	}

	err = s.rmq.Channel.QueueBind(
		queue.Name,        // queue name
		"matches.event.*", // routing key
		"matches",         // exchange
		false,
		nil,
	)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "channel.QueueBind")
	}

	msgs, err := s.rmq.Channel.Consume(
		queue.Name,           // queue
		rabbitMQConsumerName, // consumer
		false,                // auto-ack
		false,                // exclusive
		false,                // no-local
		false,                // no-wait
		nil,                  // args
	)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "channel.Consume")
	}

	go func() {
		for msg := range msgs {
			s.logger.Info("Received message: " + msg.RoutingKey)

			var nack bool

			// XXX: Instrumentation to be added in a future episode

			// XXX: We will revisit defining these topics in a better way in future episodes
			switch msg.RoutingKey {
			case "matches.event.started":
				match, err := decodeMatch(msg.Body)
				if err != nil {
					return
				}

				if err := s.match.Started(context.Background(), match); err != nil {
					nack = true
				}
				s.logger.Info("Match started")

			default:
				nack = true
			}

			if nack {
				s.logger.Info("NAcking :(")

				_ = msg.Nack(false, nack)
			} else {
				s.logger.Info("Acking :)")

				_ = msg.Ack(false)
			}
		}

		s.logger.Info("No more messages to consume. Exiting.")

		s.done <- struct{}{}
	}()

	return nil
}

// Shutdown ...
func (s *Server) Shutdown(ctx context.Context) error {
	s.logger.Info("Shutting down server")

	_ = s.rmq.Channel.Cancel(rabbitMQConsumerName, false)

	for {
		select {
		case <-ctx.Done():
			return errors.WrapErrorf(ctx.Err(), errors.ErrorCodeUnknown, "context.Done")
		case <-s.done:
			return nil
		}
	}
}

func decodeMatch(b []byte) (internal.Match, error) {
	var res internal.Match

	if err := json.Unmarshal(b, &res); err != nil {
		return internal.Match{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "json.Unmarshal")
	}
	return res, nil
}
