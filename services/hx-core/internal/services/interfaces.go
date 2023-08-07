package services

import (
	"context"

	"hornex.gg/hx-core/internal"
)

type UserRepository interface {
	Create(ctx context.Context, user internal.UserCreateParams) (internal.User, error)
	// Find(ctx context.Context, user internal.UserCreateParams) (internal.User, error)
	FindByEmail(ctx context.Context, email string) (internal.User, error)
}

type UserMessageBrokerRepository interface {
	Created(ctx context.Context, user internal.User) error
}

type TeamRepository interface {
	Create(ctx context.Context, params *internal.TeamCreateParams) (internal.Team, error)
	FindByName(ctx context.Context, params string) (internal.Team, error)
	Find(ctx context.Context, id string) (*internal.Team, error)
	Update(ctx context.Context, id string, params internal.TeamUpdateParams) (*internal.Team, error)
}

type EmailConfirmationCodeRepository interface {
	Create(ctx context.Context, email string) error
}
