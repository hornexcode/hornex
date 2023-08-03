package rabbitmq

import (
	"bytes"
	"context"
	"encoding/gob"
	"time"

	"github.com/streadway/amqp"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type User struct {
	ch *amqp.Channel
}

func NewUser(ch *amqp.Channel) *User {
	return &User{
		ch: ch,
	}
}

// Created publishes a message indicating a task was created.
func (u *User) Created(ctx context.Context, user internal.User) error {
	return u.publish(ctx, "User.Created", "users.event.created", user)
}

func (t *User) publish(ctx context.Context, spanName, routingKey string, event interface{}) error {
	// _, span := otel.Tracer(otelName).Start(ctx, spanName)
	// defer span.End()

	// span.SetAttributes(
	// 	attribute.KeyValue{
	// 		Key:   semconv.MessagingSystemKey,
	// 		Value: attribute.StringValue("rabbitmq"),
	// 	},
	// 	attribute.KeyValue{
	// 		Key:   semconv.MessagingRabbitmqRoutingKeyKey,
	// 		Value: attribute.StringValue(routingKey),
	// 	},
	// )

	//-

	var b bytes.Buffer

	if err := gob.NewEncoder(&b).Encode(event); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "gob.Encode")
	}

	err := t.ch.Publish(
		"users",    // exchange
		routingKey, // routing key
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			AppId:       "hornex-rest-server",
			ContentType: "application/x-encoding-gob", // XXX: We will revisit this in future episodes
			Body:        b.Bytes(),
			Timestamp:   time.Now(),
		})
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "ch.Publish")
	}

	return nil
}
