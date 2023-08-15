package services

import (
	"context"
	"fmt"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Invite struct {
	teamRepository   TeamRepository
	userRepository   UserRepository
	inviteRepository InviteRepository
}

func NewInviteService(irepo InviteRepository, urepo UserRepository, trepo TeamRepository) *Invite {
	return &Invite{
		inviteRepository: irepo,
		userRepository:   urepo,
		teamRepository:   trepo,
	}
}

func (i *Invite) Create(ctx context.Context, userEmail, teamId, inviterId string) error {
	user, err := i.userRepository.FindByEmail(ctx, userEmail)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "userRepository.FindByEmail")
	}

	team, err := i.teamRepository.Find(ctx, teamId)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "teamRepository.Find")
	}

	if team.CreatedBy != inviterId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "only team owner can invite members")
	}

	_, err = i.inviteRepository.FindByUserAndTeam(ctx, user.ID, team.ID)
	if err == nil {
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "user already invited")
	}

	_, err = i.inviteRepository.Create(ctx, user.ID, team.ID)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.Create")
	}

	return nil
}

func (i *Invite) Accept(ctx context.Context, inviteId, userId string) error {
	invite, err := i.inviteRepository.FindById(ctx, inviteId, userId)
	if err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "inviteRepository.FindById")
	}

	if invite.UserID != userId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite does not belong to user")
	}

	if invite.Status != internal.StatusTypePending {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite can't be accepted anymore")
	}

	// create team member
	memberExists, _ := i.teamRepository.FindTeamMember(ctx, invite.UserID, invite.TeamID)
	if memberExists.UserID != "" {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "member already belongs to the team")
	}

	// accept invite
	if invite, err = i.inviteRepository.Update(ctx, internal.UpdateInviteParams{
		ID:     invite.ID,
		Status: internal.StatusTypeAccepted,
	}); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.AcceptInvite")
	}

	if invite.Status != internal.StatusTypeAccepted {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.AcceptInvite")
	}

	// create team member
	_, err = i.teamRepository.CreateTeamMember(ctx, invite.UserID, invite.TeamID)

	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.CreateTeamMember")
	}

	return nil
}

func (i *Invite) Decline(ctx context.Context, inviteId, userId string) error {
	invite, err := i.inviteRepository.FindById(ctx, inviteId, userId)
	if err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "inviteRepository.FindById")
	}

	if invite.UserID != userId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite does not belong to user")
	}

	if invite.Status != internal.StatusTypePending {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite can't be declined anymore")
	}

	if _, err = i.inviteRepository.Update(ctx, internal.UpdateInviteParams{
		ID:     invite.ID,
		Status: internal.StatusTypeDeclined,
	}); err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.RejectInvite")
	}

	return nil
}

func (i *Invite) List(ctx context.Context, userId string) (*[]internal.Invite, error) {
	invites, err := i.inviteRepository.List(ctx, userId)

	if err != nil {
		return &[]internal.Invite{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.List")
	}

	return invites, nil
}
