package postgresql

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
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

	startTime, err := time.Parse(time.DateTime, params.StartTime)
	if err != nil {
		return internal.Tournament{}, err
	}

	endTime, err := time.Parse(time.DateTime, params.EndTime)
	if err != nil {
		return internal.Tournament{}, err
	}

	res, err := u.q.InsertTournament(ctx, db.InsertTournamentParams{
		Name:      params.Name,
		GameID:    gameUUID,
		CreatedBy: createdByUUID,
		Description: pgtype.Text{
			String: params.Description,
			Valid:  params.Description != "",
		},
		EntryFee:  params.EntryFee,
		PrizePool: params.PrizePool,
		IsActive: pgtype.Bool{
			Bool:  true,
			Valid: true,
		},
		Status: db.NullTournamentsStatusType{
			TournamentsStatusType: db.TournamentsStatusTypeCreated,
			Valid:                 true,
		},
		StartTime: pgtype.Timestamp{
			Time:  startTime,
			Valid: true,
		},
		EndTime: pgtype.Timestamp{
			Time:  endTime,
			Valid: true,
		},
	})

	if err != nil {
		return internal.Tournament{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert tournament")
	}

	return internal.Tournament{
		ID:        res.ID.String(),
		Name:      res.Name,
		CreatedAt: res.CreatedAt.Time,
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
