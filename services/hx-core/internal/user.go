package internal

import (
	"fmt"
	"regexp"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
)

type User struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Username    string    `json:"username"`
	Password    string    `json:"password"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	DateOfBirth time.Time `json:"dateOfBirth"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UserToken struct {
	User User   `json:"user"`
	JWT  string `json:"jwt"`
}

// Validate ...
func (user User) Validate() error {
	fmt.Println("user.Validate", user.DateOfBirth)
	if err := validation.ValidateStruct(&user,
		validation.Field(&user.Email, validation.Required, validation.Match(regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`))),
		validation.Field(&user.Username, validation.Required),
		validation.Field(&user.Password, validation.Required),
		validation.Field(&user.FirstName, validation.Required),
		validation.Field(&user.LastName, validation.Required),
		validation.Field(&user.DateOfBirth, validation.Required),
	); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "invalid values")
	}

	return nil
}
