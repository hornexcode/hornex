package resend

import (
	"context"
	"encoding/json"

	"hornex.gg/hornex/resend"
	"hornex.gg/hx-core/internal"
)

type User struct {
	client *resend.Client
}

func NewUser(client *resend.Client) *User {
	return &User{
		client: client,
	}
}

func (u *User) SendConfirmationCode(_ context.Context, user internal.User) error {
	body, _ := json.Marshal(map[string]string{
		"to":      user.Email,
		"from":    "accounts@hornex.gg",
		"subject": "Email verification code: 492823",
		"html":    "Your confirmation code is: 492823",
	})

	err := u.client.Send(user.Email, "Confirmation code", body)
	if err != nil {
		return err
	}

	return nil
}
