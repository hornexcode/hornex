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

func (i *Invite) InviteMember(ctx context.Context, userEmail, teamId, inviterId string) error {
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

func (i *Invite) AcceptInvite(ctx context.Context, userId, inviteId string) error {
	invite, err := i.inviteRepository.FindById(ctx, inviteId, userId)
	if err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "inviteRepository.FindByUserAndTeam")
	}

	if invite.UserID != userId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite does not belong to user")
	}

	if _, err = i.inviteRepository.Update(ctx, internal.UpdateInviteParams{
		ID:     invite.ID,
		Status: internal.StatusTypeAccepted,
	}); err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "inviteRepository.AcceptInvite")
	}

	return nil
}
