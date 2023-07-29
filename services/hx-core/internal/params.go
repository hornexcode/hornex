package internal

import (
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type UserCreateParams struct {
	Email         string
	Username      string
	FirstName     string
	LastName      string
	Password      string
	BirthDate     time.Time
	TermsAccepted bool
}

// Validate indicates whether the fields are valid or not.
func (p UserCreateParams) Validate() error {
	user := User{
		Email:     p.Email,
		Username:  p.Username,
		FirstName: p.FirstName,
		LastName:  p.LastName,
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

type UserSignInParams struct {
	Email    string
	Password string
}

func (p UserSignInParams) Validate() error {
	return nil
}
