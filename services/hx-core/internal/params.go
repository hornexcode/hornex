package internal

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type UserCreateParams struct {
	Email         string
	Password      string
	BirthDate     string
	TermsAccepted bool
}

// Validate indicates whether the fields are valid or not.
func (p UserCreateParams) Validate() error {
	user := User{
		Email:     p.Email,
		BirthDate: p.BirthDate,
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
}

func (p TeamCreateParams) Validate() error {
	team := Team{
		Name:      p.Name,
		CreatedBy: p.CreatedBy,
	}

	if err := validation.Validate(&team); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "validation.Validate")
	}
	return nil
}

type TeamSearchParams struct {
	Name string
}

type TeamUpdateParams struct {
	Name string
}
