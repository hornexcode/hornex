package resend

import (
	"os"

	"github.com/resend/resend-go/v2"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
)

type Clientable interface {
	Send() error
}

type Client struct {
	resend *resend.Client
}

func NewClient(conf *envvar.Configuration) *Client {
	rsnd := resend.NewClient(os.Getenv("RESEND_API_KEY"))
	return &Client{
		resend: rsnd,
	}
}

func (c *Client) Send() error {
	params := &resend.SendEmailRequest{
		From:    "Acme <onboarding@resend.dev>",
		To:      []string{"pedro357bm@gmail.com"},
		Html:    "<strong>hello world</strong>",
		Subject: "Hello from Golang",
		Cc:      []string{"cc@example.com"},
		Bcc:     []string{"bcc@example.com"},
		ReplyTo: "replyto@example.com",
	}

	_, err := c.resend.Emails.Send(params)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "resend.Emails.Send")
	}
	return nil
}
