package postgresql

import (
	"context"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
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

	createdByUUID, err := uuid.Parse(params.CreatedBy)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}
	gameUUID, err := uuid.Parse(params.GameID)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := u.q.InsertTeam(ctx, db.InsertTeamParams{
		Name:      params.Name,
		GameID:    gameUUID,
		CreatedBy: createdByUUID,
	})

	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert team")
	}

	return internal.Team{
		ID:        res.ID.String(),
		Name:      params.Name,
		CreatedBy: params.CreatedBy,
	}, nil
}

// Update a team by id
func (u *Team) Update(ctx context.Context, id string, params *internal.TeamUpdateParams) (*internal.Team, error) {
	// XXX: `UpdatedAt` is being created on the database side
	// XXX: `ID` is being created on the database side

	uuid, err := uuid.Parse(id)
	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := u.q.UpdateTeam(ctx, db.UpdateTeamParams{
		ID:   uuid,
		Name: params.Name,
	})

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "update team")
	}

	return &internal.Team{
		ID:        res.ID.String(),
		Name:      params.Name,
		CreatedBy: res.CreatedBy.String(),
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
		ID:        res.ID.String(),
		CreatedBy: res.CreatedBy.String(),
		Name:      res.Name,
	}, nil
}

func (t *Team) Find(ctx context.Context, id string) (*internal.Team, error) {
	uuid, err := uuid.Parse(id)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.SelectTeamById(ctx, uuid)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team by id")
	}

	return &internal.Team{
		ID:        res.ID.String(),
		Name:      res.Name,
		CreatedBy: res.CreatedBy.String(),
	}, nil
}

func (t *Team) List(ctx context.Context, params *internal.TeamSearchParams) (*[]internal.Team, error) {
	createdByUUID, err := uuid.Parse(params.CreatedBy)

	if err != nil {
		return &[]internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := t.q.SelectTeamsByCreatorId(ctx, createdByUUID)

	if err != nil {
		return &[]internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team by id")
	}

	var teams []internal.Team

	for _, team := range res {
		teams = append(teams, internal.Team{
			ID:        team.ID.String(),
			Name:      team.Name,
			GameID:    team.GameID.String(),
			CreatedBy: team.CreatedBy.String(),
		})
	}

	return &teams, nil
}

func (t *Team) FindInviteById(ctx context.Context, id string, userId string) (*internal.TeamInvite, error) {
	inviteUUID, err := uuid.Parse(id)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.SelectInviteByIdAndUser(ctx, db.SelectInviteByIdAndUserParams{
		ID:     inviteUUID,
		UserID: userUUID,
	})

	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team invite by id")
	}

	return &internal.TeamInvite{
		ID:        res.ID.String(),
		UserID:    res.UserID.String(),
		TeamID:    res.TeamID.String(),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (t *Team) FindInviteByUserAndTeam(ctx context.Context, userId string, teamId string) (*internal.TeamInvite, error) {
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.SelectInviteByUserAndTeam(ctx, db.SelectInviteByUserAndTeamParams{
		UserID: userUUID,
		TeamID: teamUUID,
	})

	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team invite by user email and team id")
	}

	return &internal.TeamInvite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (t *Team) CreateInvite(ctx context.Context, userId, teamId string) (*internal.TeamInvite, error) {
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.InsertTeamInvite(ctx, db.InsertTeamInviteParams{
		TeamID: teamUUID,
		UserID: userUUID,
	})

	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert team invite")
	}

	return &internal.TeamInvite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (t *Team) UpdateInvite(ctx context.Context, params internal.UpdateInviteParams) (*internal.TeamInvite, error) {
	res, err := t.q.UpdateInvite(ctx, db.UpdateInviteParams{
		Status: db.NullTeamsStatusType{
			TeamsStatusType: getStatusType(params.Status),
			Valid:           true,
		},
	})

	if err != nil {
		return &internal.TeamInvite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "update team invite")
	}

	return &internal.TeamInvite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

// -

func getStatusType(status internal.StatusType) db.TeamsStatusType {
	switch status {
	case internal.StatusTypePending:
		return db.TeamsStatusTypePending
	case internal.StatusTypeAccepted:
		return db.TeamsStatusTypeAccepted
	case internal.StatusTypeDeclined:
		return db.TeamsStatusTypeDeclined
	default:
		return db.TeamsStatusTypePending
	}
}
