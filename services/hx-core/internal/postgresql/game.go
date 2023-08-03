package postgresql

import (
	"context"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
)

// Game is the Game Repository
type Game struct {
	q *db.Queries
}

// NewPostgresqlGameRepositoryImpl instantiates the Game Repository
func NewPostgresqlGameRepositoryImpl(d db.DBTX) *Game {
	return &Game{q: db.New(d)}
}

// List list all games record
func (u *Game) List(ctx context.Context) (*[]internal.Game, error) {
	res, err := u.q.SelectGames(ctx)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return &[]internal.Game{}, errors.WrapErrorf(err, errors.ErrorCodeNotFound, "select games")
		}
	}

	var games []internal.Game

	for _, game := range res {
		games = append(games, internal.Game{
			ID:   game.ID.String(),
			Name: game.Name,
			Slug: game.Slug,
		})
	}

	return &games, nil
}

func (t *Game) Find(ctx context.Context, id string) (*internal.Game, error) {
	uuid, err := uuid.Parse(id)

	if err != nil {
		return &internal.Game{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.SelectGameById(ctx, uuid)

	if err != nil {
		return &internal.Game{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team by id")
	}

	return &internal.Game{
		ID:   res.ID.String(),
		Name: res.Name,
		Slug: res.Slug,
	}, nil
}
