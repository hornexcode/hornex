package resend

import (
	"context"

	"hornex.gg/hornex-consumer/internal"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/resend"
)

// Match service...
type Match struct {
	client resend.Clientable
}

// NewMatch ...
func NewMatch(client resend.Clientable) *Match {
	return &Match{
		client: client,
	}
}

// Started...
func (m *Match) Started(ctx context.Context, match internal.Match) error {
	if err := m.client.Send(); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.Send")
	}
	return nil
}
