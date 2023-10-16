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
		Status:    internal.InviteStatusType(res.Status.InviteStatusType),
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
		Status:    internal.InviteStatusType(res.Status.InviteStatusType),
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
		Status:    internal.InviteStatusType(res.Status.InviteStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (i *Invite) Update(ctx context.Context, params internal.UpdateInviteParams) (*internal.Invite, error) {
	inviteUUID, err := uuid.Parse(params.ID)
	if err != nil {
		return &internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.UpdateInvite(ctx, db.UpdateInviteParams{
		Status: db.NullInviteStatusType{
			InviteStatusType: getStatusType(params.Status),
			Valid:            true,
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
		Status:    internal.InviteStatusType(res.Status.InviteStatusType),
		CreatedAt: res.CreatedAt.Time,
	}, nil
}

func (i *Invite) List(ctx context.Context, userId string) (*[]internal.Invite, error) {
	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return &[]internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := i.q.SelectInvitesByUser(ctx, userUUID)

	if err != nil {
		if err.Error() == "no rows in result set" {
			return &[]internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeNotFound, "select invites")
		}
	}

	var invites []internal.Invite

	for _, invite := range res {
		team := internal.Team{
			ID:        invite.TeamID.String(),
			Name:      invite.TeamName,
			CreatedBy: invite.CreatedBy.String(),
			GameID:    invite.GameID.String(),
		}

		invites = append(invites, internal.Invite{
			ID:        invite.ID.String(),
			TeamID:    invite.TeamID.String(),
			UserID:    userId,
			Status:    internal.InviteStatusType(invite.Status.InviteStatusType),
			CreatedAt: invite.CreatedAt.Time,
			Team:      &team,
		})
	}

	return &invites, nil

}

func getStatusType(status internal.InviteStatusType) db.InviteStatusType {
	switch status {
	case internal.InviteStatusTypePending:
		return db.InviteStatusTypePending
	case internal.InviteStatusTypeAccepted:
		return db.InviteStatusTypeAccepted
	case internal.InviteStatusTypeDeclined:
		return db.InviteStatusTypeDeclined
	default:
		return db.InviteStatusTypePending
	}
}
