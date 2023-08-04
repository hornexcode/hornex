package internal

import (
	"regexp"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type Team struct {
	ID        string `json:"id"`
	CreatedBy string `json:"created_by"`
	Name      string `json:"name"`
	Members   []User `json:"members"`
}

type Member struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	TeamID string `json:"team_id"`
}

var regexpUUID = "^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$"

// Validate ...
func (team Team) Validate() error {
	if err := validation.ValidateStruct(&team,
		validation.Field(&team.Name, validation.Required),
		validation.Field(&team.CreatedBy, validation.Required, validation.Match(regexp.MustCompile(regexpUUID))),
	); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "invalid values")
	}

	return nil
}
