package services

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Tournament struct {
	tournamentRepository TournamentRepository
	userRepository       UserRepository
}

func NewTournamentService(trepo TournamentRepository, urepo UserRepository) *Tournament {
	return &Tournament{tournamentRepository: trepo, userRepository: urepo}
}

func (t *Tournament) Create(ctx context.Context, params internal.CreateTournamentParams) (internal.Tournament, error) {
	err := params.Validate()
	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	exists, _ := t.tournamentRepository.FindByName(ctx, params.Name)
	if exists.ID != "" {
		return internal.Tournament{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "tournament already exists for name %s", params.Name)
	}

	tournament, err := t.tournamentRepository.Create(ctx, &params)
	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "tournamentRepository.Create")
	}

	return tournament, nil
}
