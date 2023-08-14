package internal

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type UserCreateParams struct {
	FirstName     string
	LastName      string
	Email         string
	Password      string
	TermsAccepted bool
}

// Validate indicates whether the fields are valid or not.
func (p UserCreateParams) Validate() error {
	user := User{
		FirstName: p.FirstName,
		LastName:  p.LastName,
		Email:     p.Email,
		Password:  p.Password,
	}

	if err := validation.Validate(&user); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "validation.Validate")
	}

	if !p.TermsAccepted {
		return validation.Errors{
			"termsAccepted": errors.NewErrorf(errors.ErrorCodeInvalidArgument, "terms and conditions not accepted"),
		}
	}

	return nil
}

type UserUpdateParams struct {
	ID             string
	Email          string
	FirstName      string
	LastName       string
	BirthDate      string
	EmailConfirmed bool
}

type UserSearchParams struct {
	Email string
	Name  string
}

type UserSearchResults struct {
	Users []User
	Total int64
}

type UserSignInParams struct {
	Email    string
	Password string
}

func (p UserSignInParams) Validate() error {
	return nil
}

// -

type TeamCreateParams struct {
	Name      string
	CreatedBy string
	GameID    string
}

func (p TeamCreateParams) Validate() error {
	team := Team{
		Name:      p.Name,
		CreatedBy: p.CreatedBy,
		GameID:    p.GameID,
	}

	if err := validation.Validate(&team); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "validation.Validate")
	}
	return nil
}

type TeamSearchParams struct {
	CreatedBy string
}

type TeamUpdateParams struct {
	Name string
}

// - Account

type LOLAccountCreateParams struct {
	ID            string
	UserID        string
	AccountID     string
	Region        string
	Puuid         string
	SummonerName  string
	SummonerLevel int32
	ProfileIconID int32
	RevisionDate  int64
}

func (a LOLAccountCreateParams) Validate() error {
	team := LOLAccount{
		ID:            a.ID,
		UserID:        a.UserID,
		AccountID:     a.AccountID,
		Region:        a.Region,
		Puuid:         a.Puuid,
		SummonerName:  a.SummonerName,
		SummonerLevel: a.SummonerLevel,
		ProfileIconID: a.ProfileIconID,
		RevisionDate:  a.RevisionDate,
	}

	if err := validation.Validate(&team); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "validation.Validate")
	}
	return nil
}

// -
type UpdateInviteParams struct {
	ID     string
	Status StatusType
}
