package postgresql

import (
	"context"
	"time"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
)

type Tournament struct {
	q *db.Queries
}

func NewPostgresqlTournamentRepositoryImpl(d db.DBTX) *Tournament {
	return &Tournament{q: db.New(d)}
}

func (u *Tournament) Create(ctx context.Context, params *internal.CreateTournamentParams) (internal.Tournament, error) {

	createdByUUID, err := uuid.Parse(params.CreatedBy)
	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}
	gameUUID, err := uuid.Parse(params.GameID)
	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	// TODO : To finish
	res, err := u.q.InsertTournament(ctx, db.InsertTournamentParams{
		Name:        params.Name,
		GameID:      gameUUID,
		CreatedBy:   createdByUUID,
		Description: params.Description,
		EntryFee:    params.EntryFee,
		PrizePool:   params.PrizePool,
		IsActive:    true,
		Status:      db.NullTournamentsStatusType{TournamentsStatusType: db.TournamentsStatusTypeCreated},
		DueDate:     time.Now(),
	})

	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert tournament")
	}

	return internal.Tournament{
		ID:        res.ID.String(),
		Name:      params.Name,
		CreatedBy: params.CreatedBy,
	}, nil
}

func (u *Tournament) FindByName(ctx context.Context, name string) (internal.Tournament, error) {
	res, err := u.q.SelectTournamentByName(ctx, name)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeNotFound, "select tournament")
		}
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select tournament")
	}

	return internal.Tournament{
		ID:        res.ID.String(),
		CreatedBy: res.CreatedBy.String(),
		Name:      res.Name,
	}, nil
}
