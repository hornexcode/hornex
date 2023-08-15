package postgresql

import (
	"context"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
)

type Invite struct {
	q *db.Queries
}

// NewPostgresqlInviteRepositoryImpl instantiates the Invite Repository
func NewPostgresqlInviteRepositoryImpl(d db.DBTX) *Invite {
	return &Invite{q: db.New(d)}
}

func (i *Invite) FindById(ctx context.Context, id, userId string) (*internal.Invite, error) {
	inviteUUID, err := uuid.Parse(id)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.SelectInviteByIdAndUser(ctx, db.SelectInviteByIdAndUserParams{
		ID:     inviteUUID,
		UserID: userUUID,
	})

	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select invite by id")
	}

	return &internal.Invite{
		ID:        res.ID.String(),
		UserID:    res.UserID.String(),
		TeamID:    res.TeamID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (i *Invite) FindByUserAndTeam(ctx context.Context, userId, teamId string) (*internal.Invite, error) {
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.SelectInviteByUserAndTeam(ctx, db.SelectInviteByUserAndTeamParams{
		UserID: userUUID,
		TeamID: teamUUID,
	})

	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team invite by user email and team id")
	}

	return &internal.Invite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (i *Invite) Create(ctx context.Context, userId, teamId string) (*internal.Invite, error) {
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.InsertTeamInvite(ctx, db.InsertTeamInviteParams{
		TeamID: teamUUID,
		UserID: userUUID,
	})

	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert team invite")
	}

	return &internal.Invite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (i *Invite) Update(ctx context.Context, params internal.UpdateInviteParams) (*internal.Invite, error) {
	inviteUUID, err := uuid.Parse(params.ID)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.UpdateInvite(ctx, db.UpdateInviteParams{
		Status: db.NullTeamsStatusType{
			TeamsStatusType: getStatusType(params.Status),
			Valid:           true,
		},
		ID: inviteUUID,
	})

	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "update team invite")
	}

	return &internal.Invite{
		ID:        res.ID.String(),
		TeamID:    res.TeamID.String(),
		UserID:    res.UserID.String(),
		Status:    internal.StatusType(res.Status.TeamsStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

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
