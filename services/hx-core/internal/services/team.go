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
	err := params.Validate()
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

func (t *Team) Find(ctx context.Context, id string) (*internal.Team, error) {
	team, err := t.teamRepository.Find(ctx, id)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.Find")
	}

	return team, nil
}

func (t *Team) Update(ctx context.Context, id string, params internal.TeamUpdateParams) (*internal.Team, error) {
	team, err := t.teamRepository.Update(ctx, id, params)

	return team, nil
}
