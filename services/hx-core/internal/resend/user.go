package resend

import (
	"context"
	"encoding/json"
	"fmt"

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

func (u *User) SendConfirmationCode(_ context.Context, user internal.User, code string) error {
	body, _ := json.Marshal(map[string]string{
		"to":      user.Email,
		"from":    "accounts@hornex.gg",
		"subject": fmt.Sprintf("Email verification code: %s", code),
		"html":    "Your confirmation code is: " + code,
	})

	err := u.client.Send(user.Email, "Confirmation code", body)
	if err != nil {
		return err
	}

	return nil
}
