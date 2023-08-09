package internal

import (
	"regexp"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/errors"
)

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	BirthDate string `json:"birth_date"`

	EmailConfirmed bool `json:"email_confirmed"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Validate ...
func (u User) Validate() error {
	if err := validation.ValidateStruct(&u,
		validation.Field(&u.Email, validation.Required, validation.Match(regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`))),
		validation.Field(&u.Password, validation.Required),
		validation.Field(&u.FirstName, validation.Required),
		validation.Field(&u.LastName, validation.Required),
		validation.Field(&u.BirthDate, validation.Date("2006-01-02")),
	); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "invalid values")
	}

	return nil
}

func (u User) HashPassword(password string) string {
	hasher := auth.NewHasher()
	return hasher.Hash(password)
}

func (u *User) ComparePasswords(password string) error {
	hasher := auth.NewHasher()
	return hasher.Check(password, u.Password)
}
