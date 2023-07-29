package repositories

import (
	"context"

	"hornex.gg/hx-core/internal"
)

type UserRepository interface {
	Create(ctx context.Context, user internal.UserCreateParams) (internal.User, error)
	FindByEmail(ctx context.Context, email string) (internal.User, error)
}

type UserMessageBrokerRepository interface {
	Created(ctx context.Context, user internal.User) error
}
