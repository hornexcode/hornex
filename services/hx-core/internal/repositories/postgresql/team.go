package postgresql

import (
	"context"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories/postgresql/db"
)

// Team is the Team Repository
type Team struct {
	q *db.Queries
}

// NewPostgresqlTeamRepositoryImpl instatiates the Team Repository
func NewPostgresqlTeamRepositoryImpl(d db.DBTX) *Team {
	return &Team{q: db.New(d)}
}

// Create inserts a new team record
func (u *Team) Create(ctx context.Context, params *internal.TeamCreateParams) (internal.Team, error) {
	// XXX: `ID` is being created on the database side
	// XXX: `CreatedAt` is being created on the database side
	// XXX: `UpdatedAt` is being created on the database side

	uuid, err := uuid.Parse(params.OwnerID)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := u.q.InsertTeam(ctx, db.InsertTeamParams{
		Name:    params.Name,
		OwnerID: uuid,
	})

	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert team")
	}

	return internal.Team{
		ID:      res.ID.String(),
		Name:    params.Name,
		OwnerID: params.OwnerID,
	}, nil
}

// Update a team by id
func (u *Team) Update(ctx context.Context, id string, params *internal.TeamUpdateParams) (internal.Team, error) {
	// XXX: `UpdatedAt` is being created on the database side
	// XXX: `ID` is being created on the database side

	uuid, err := uuid.Parse(id)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := u.q.UpdateTeam(ctx, db.UpdateTeamParams{
		ID:   uuid,
		Name: params.Name,
	})

	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "update team")
	}

	return internal.Team{
		ID:      res.ID.String(),
		Name:    params.Name,
		OwnerID: res.OwnerID.String(),
	}, nil
}

// Search searches for a team record
func (u *Team) FindByName(ctx context.Context, name string) (internal.Team, error) {
	// XXX: `ID` is being created on the database side
	// XXX: `CreatedAt` is being created on the database side
	// XXX: `UpdatedAt` is being created on the database side
	res, err := u.q.SelectTeamByName(ctx, name)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeNotFound, "select team")
		}
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team")
	}

	return internal.Team{
		ID:      res.ID.String(),
		OwnerID: res.OwnerID.String(),
		Name:    res.Name,
	}, nil
}
