package internal

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type Game struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// Validate ...
func (team Game) Validate() error {
	if err := validation.ValidateStruct(&team,
		validation.Field(&team.Name, validation.Required),
		validation.Field(&team.Slug, validation.Required),
	); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "invalid values")
	}

	return nil
}
