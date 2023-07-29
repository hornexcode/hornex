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

type AuthorizerRepository interface {
	SignUp(ctx context.Context, user *internal.User) error
	ConfirmSignUp(ctx context.Context, email, confirmationCode string) error
	SignIn(ctx context.Context, email, password string) (string, error)
}
