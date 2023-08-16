package postgresql

import (
	"context"
	"encoding/json"
	"fmt"

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

var rawMembers []struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	Email     string `json:"email"`
}

func (t *Team) FindWithMembers(ctx context.Context, id string) (*internal.Team, error) {
	uuid, err := uuid.Parse(id)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.Parse")
	}

	res, err := t.q.SelectTeamWithMembersById(ctx, uuid)

	if err != nil {
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team by id")
	}

	err = json.Unmarshal([]byte(res.Members), &rawMembers)

	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return &internal.Team{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "json.Unmarshal")
	}

	var members []internal.User

	for _, member := range rawMembers {
		members = append(members, internal.User{
			ID:        member.ID,
			Email:     member.Email,
			FirstName: member.FirstName,
		})
	}

	return &internal.Team{
		ID:        res.ID.String(),
		Name:      res.Name,
		CreatedBy: res.CreatedBy.String(),
		GameID:    res.GameID.String(),
		Members:   members,
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

func (t *Team) FindTeamMember(ctx context.Context, memberId, teamId string) (*internal.TeamMember, error) {
	memberUUID, err := uuid.Parse(memberId)
	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := t.q.SelectTeamMemberByMemberAndTeam(ctx, db.SelectTeamMemberByMemberAndTeamParams{
		TeamID: teamUUID,
		UserID: memberUUID,
	})

	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "find team member")
	}

	return &internal.TeamMember{
		UserID: res.TeamID.String(),
		TeamID: res.TeamID.String(),
	}, nil
}

func (t *Team) CreateTeamMember(ctx context.Context, memberId, teamId string) (*internal.TeamMember, error) {
	memberUUID, err := uuid.Parse(memberId)
	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}
	teamUUID, err := uuid.Parse(teamId)
	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := t.q.InsertTeamMember(ctx, db.InsertTeamMemberParams{
		TeamID: teamUUID,
		UserID: memberUUID,
	})

	if err != nil {
		return &internal.TeamMember{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert team member")
	}

	return &internal.TeamMember{
		UserID: res.UserID.String(),
		TeamID: res.TeamID.String(),
	}, nil
}
