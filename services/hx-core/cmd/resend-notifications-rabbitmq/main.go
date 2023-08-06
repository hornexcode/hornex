package main

import (
	"bytes"
	"context"
	"encoding/gob"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/rabbitmq"
	"hornex.gg/hornex/resend"
	"hornex.gg/hx-core/internal"
	internalresend "hornex.gg/hx-core/internal/resend"
)

const rabbitMQConsumerName = "users-notifications-consumer"

type Server struct {
	logger *zap.Logger
	rmq    *rabbitmq.RabbitMQ
	done   chan struct{}
	user   *internalresend.User
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
		queue.Name,      // queue name
		"users.event.*", // routing key
		"users",         // exchange
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
			s.logger.Info(fmt.Sprintf("Received message: %s", msg.RoutingKey))

			var nack bool

			// XXX: Instrumentation to be added in a future episode

			// XXX: We will revisit defining these topics in a better way in future episodes
			switch msg.RoutingKey {
			case "users.event.updated", "users.event.created":
				user, err := decodeUser(msg.Body)
				if err != nil {
					nack = true
					return
				}

				if err := s.user.SendConfirmationCode(context.Background(), user); err != nil {
					nack = true
				}

				// if err := s.task.Index(context.Background(), task); err != nil {
				// 	nack = true
				// }
			// case "tasks.event.deleted":
			// 	id, err := decodeID(msg.Body)
			// 	if err != nil {
			// 		return
			// 	}

			// 	if err := s.task.Delete(context.Background(), id); err != nil {
			// 		nack = true
			// 	}
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

	conf := envvar.New()

	//-

	// esClient, err := internal.NewElasticSearch(conf)
	// if err != nil {
	// 	return nil, internaldomain.WrapErrorf(err, internaldomain.ErrorCodeUnknown, "internal.NewElasticSearch")
	// }

	//-

	rClient := resend.NewClient()

	//-

	rmq, err := rabbitmq.NewRabbitMQ(conf)
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "internal.newRabbitMQ")
	}

	//-

	// _, err = internal.NewOTExporter(conf)
	// if err != nil {
	// 	return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "newOTExporter")
	// }

	//-

	srv := &Server{
		logger: logger,
		rmq:    rmq,
		user:   internalresend.NewUser(rClient),
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

func decodeUser(b []byte) (internal.User, error) {
	var res internal.User

	if err := gob.NewDecoder(bytes.NewReader(b)).Decode(&res); err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "gob.Decode")
	}

	return res, nil
}

func decodeID(b []byte) (string, error) {
	var res string

	if err := gob.NewDecoder(bytes.NewReader(b)).Decode(&res); err != nil {
		return "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "gob.Decode")
	}

	return res, nil
}
