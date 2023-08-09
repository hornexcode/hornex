package services

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Game struct {
	gameRepository GameRepository
}

func NewGameService(trepo GameRepository) *Game {
	return &Game{gameRepository: trepo}
}

func (t *Game) Find(ctx context.Context, id string) (*internal.Game, error) {
	team, err := t.gameRepository.Find(ctx, id)

	if err != nil {
		return &internal.Game{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "gameRepository.Find")
	}

	return team, nil
}

func (t *Game) List(ctx context.Context) (*[]internal.Game, error) {
	team, err := t.gameRepository.List(ctx)

	if err != nil {
		return &[]internal.Game{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "gameRepository.List")
	}

	return team, nil
}
