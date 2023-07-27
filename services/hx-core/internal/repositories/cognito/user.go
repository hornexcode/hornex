package cognito

import (
	"fmt"

	"hornex.gg/hornex/auth/cognito"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type User struct {
	client *cognito.Client
}

func NewCognitoUserIdentifierImpl(client *cognito.Client) *User {
	return &User{client}
}

func (u *User) Register(user *internal.User) error {
	err := u.client.AdminCreateUser(fmt.Sprintf("%s %s", user.FirstName, user.LastName), user.Email, user.Email, user.Password, user.DateOfBirth.Format("2006-01-02"))
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.AdminCreateUser")
	}
	return nil
}
