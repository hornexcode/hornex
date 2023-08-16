package services

import (
	"context"

	"hornex.gg/hx-core/internal"
)

type UserRepository interface {
	Create(ctx context.Context, user internal.UserCreateParams) (internal.User, error)
	Find(ctx context.Context, id string) (internal.User, error)
	FindByEmail(ctx context.Context, email string) (internal.User, error)
	Update(ctx context.Context, user internal.UserUpdateParams) (internal.User, error)
}

type UserMessageBrokerRepository interface {
	Created(ctx context.Context, user internal.User) error
}

type TeamRepository interface {
	Create(ctx context.Context, params *internal.TeamCreateParams) (internal.Team, error)
	FindByName(ctx context.Context, params string) (internal.Team, error)
	Find(ctx context.Context, id string) (*internal.Team, error)
	Update(ctx context.Context, id string, params *internal.TeamUpdateParams) (*internal.Team, error)
	List(ctx context.Context, params *internal.TeamSearchParams) (*[]internal.Team, error)
	CreateTeamMember(ctx context.Context, memberId, teamId string) (*internal.TeamMember, error)
	FindTeamMember(ctx context.Context, memberId, teamId string) (*internal.TeamMember, error)
}

type EmailConfirmationCodeRepository interface {
	Create(ctx context.Context, email string) error
	Find(ctx context.Context, email string) (internal.EmailConfirmationCode, error)
}

type GameRepository interface {
	Find(ctx context.Context, id string) (*internal.Game, error)
	List(ctx context.Context) (*[]internal.Game, error)
}

type AccountRepository interface {
	Create(ctx context.Context, params *internal.LOLAccountCreateParams) (*internal.LOLAccount, error)
	Find(ctx context.Context, id string) (*internal.LOLAccount, error)
}

type InviteRepository interface {
	FindById(ctx context.Context, id, userId string) (*internal.Invite, error)
	FindByUserAndTeam(ctx context.Context, userId, teamId string) (*internal.Invite, error)
	Create(ctx context.Context, userId, teamId string) (*internal.Invite, error)
	Update(ctx context.Context, params internal.UpdateInviteParams) (*internal.Invite, error)
	List(ctx context.Context, userId string) (*[]internal.Invite, error)
}
