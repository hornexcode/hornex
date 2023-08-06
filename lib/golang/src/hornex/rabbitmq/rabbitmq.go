package internal

import (
	"github.com/streadway/amqp"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
)

// RabbitMQ ...
type RabbitMQ struct {
	Connection *amqp.Connection
	Channel    *amqp.Channel
}

// NewRabbitMQ instantiates the RabbitMQ instances using configuration defined in environment variables.
func NewRabbitMQ(conf *envvar.Configuration) (*RabbitMQ, error) {
	// XXX: Instead of using `RABBITMQ_URL` perhaps it makes sense to define
	// concrete `RABBIT_XYZ` variables similar to what we do for PostgreSQL to
	// clearly separate each field, like hostname, username, password, etc.
	url := conf.Get("RABBITMQ_URL")
	// if err != nil {
	// 	return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "conf.Get")
	// }

	conn, err := amqp.Dial(url)
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "amqp.Dial")
	}

	channel, err := conn.Channel()
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "conn.Channel")
	}

	err = channel.ExchangeDeclare(
		"users", // name
		"topic", // type
		true,    // durable
		false,   // auto-deleted
		false,   // internal
		false,   // no-wait
		nil,     // arguments
	)
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "ch.ExchangeDeclare")
	}

	if err := channel.Qos(
		1,     // prefetch count
		0,     // prefetch size
		false, // global
	); err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "ch.Qos")
	}

	// XXX: Dead Letter Exchange will be implemented in future episodes

	return &RabbitMQ{
		Connection: conn,
		Channel:    channel,
	}, nil
}

// Close ...
func (r *RabbitMQ) Close() {
	r.Connection.Close()
}
