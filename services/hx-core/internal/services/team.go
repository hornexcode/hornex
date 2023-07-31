package services

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories"
)

type Team struct {
	teamRepository repositories.TeamRepository
	userRepository repositories.UserRepository
}

func NewTeamService(trepo repositories.TeamRepository, urepo repositories.UserRepository) *Team {
	return &Team{teamRepository: trepo, userRepository: urepo}
}

func (t *Team) Create(ctx context.Context, params internal.TeamCreateParams) (internal.Team, error) {
	user, err := t.userRepository.FindByEmail(ctx, params.OwnerEmail)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "userRepository.FindByEmail %s", err)
	}
	params.OwnerID = user.ID

	err = params.Validate()
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	exists, _ := t.teamRepository.FindByName(ctx, params.Name)
	if exists.ID != "" {
		return internal.Team{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "team already exists for name %s", params.Name)
	}

	team, err := t.teamRepository.Create(ctx, &params)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.Create")
	}

	return team, nil
}
