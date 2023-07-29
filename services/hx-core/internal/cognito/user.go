package cognito

import (
	"context"

	"hornex.gg/hornex/auth/cognito"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Provider struct {
	client cognito.Client
}

func NewCognitoImpl(client cognito.Client) *Provider {
	return &Provider{client}
}

func (u *Provider) SignUp(_ context.Context, user *internal.User) error {
	err := u.client.SignUp(user.Email, user.Password, user.FirstName, user.LastName, user.BirthDate.Format("2006-01-02"))
	if err != nil {
		return err
	}
	return nil
}

func (u *Provider) ConfirmSignUp(_ context.Context, email, confirmationCode string) error {
	err := u.client.ConfirmSignUp(email, confirmationCode)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.ConfirmSignUp")
	}
	return nil
}

func (u *Provider) SignIn(_ context.Context, email, password string) (string, error) {
	output, err := u.client.SignIn(email, password)
	if err != nil {
		return "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, err.Error())
	}
	return *output.AuthenticationResult.IdToken, nil
}
