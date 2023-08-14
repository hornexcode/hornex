package services

import (
	"context"
	"fmt"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Team struct {
	teamRepository TeamRepository
	userRepository UserRepository
}

func NewTeamService(trepo TeamRepository, urepo UserRepository) *Team {
	return &Team{teamRepository: trepo, userRepository: urepo}
}

func (t *Team) Create(ctx context.Context, params internal.TeamCreateParams) (internal.Team, error) {
	err := params.Validate()
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	exists, _ := t.teamRepository.FindByName(ctx, params.Name)
	if exists.ID != "" {
		return internal.Team{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "team already exists for name %s", params.Name)
	}

	team, err := t.teamRepository.Create(ctx, &params)
	if err != nil {
		return internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.Create")
	}

	return team, nil
}

func (t *Team) Find(ctx context.Context, id string) (*internal.Team, error) {
	team, err := t.teamRepository.Find(ctx, id)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.Find")
	}

	return team, nil
}

func (t *Team) Update(ctx context.Context, id string, params internal.TeamUpdateParams) (*internal.Team, error) {
	team, err := t.teamRepository.Update(ctx, id, &params)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.Update")
	}

	return team, nil
}

func (t *Team) List(ctx context.Context, params internal.TeamSearchParams) (*[]internal.Team, error) {
	teams, err := t.teamRepository.List(ctx, &params)

	if err != nil {
		return &[]internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.List")
	}

	return teams, nil
}

func (t *Team) InviteMember(ctx context.Context, userEmail, teamId, inviterId string) error {
	user, err := t.userRepository.FindByEmail(ctx, userEmail)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "userRepository.FindByEmail")
	}

	team, err := t.teamRepository.Find(ctx, teamId)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "teamRepository.Find")
	}

	if team.CreatedBy != inviterId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "only team owner can invite members")
	}

	_, err = t.teamRepository.FindInviteByUserAndTeam(ctx, user.ID, team.ID)
	if err == nil {
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "user already invited")
	}

	_, err = t.teamRepository.CreateInvite(ctx, user.ID, team.ID)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.CreateInvite")
	}

	return nil
}

func (t *Team) AcceptInvite(ctx context.Context, userId, inviteId string) error {
	invite, err := t.teamRepository.FindInviteById(ctx, inviteId)
	if err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "teamRepository.FindInviteByUserAndTeam")
	}

	if invite.UserID != userId {
		fmt.Println(err)
		return errors.NewErrorf(errors.ErrorCodeInvalidArgument, "invite does not belong to user")
	}

	if _, err = t.teamRepository.UpdateInvite(ctx, internal.UpdateInviteParams{
		ID:     invite.ID,
		Status: internal.StatusTypeAccepted,
	}); err != nil {
		fmt.Println(err)
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "teamRepository.AcceptInvite")
	}

	return nil
}
