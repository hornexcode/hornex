package postgresql

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
)

type EmailConfirmationCode struct {
	q *db.Queries
}

func NewEmailConfirmationCode(d db.DBTX) *EmailConfirmationCode {
	return &EmailConfirmationCode{q: db.New(d)}
}

func (e *EmailConfirmationCode) Create(ctx context.Context, email string) error {
	everifcode := internal.NewEmailConfirmationCode(email)

	_, err := e.q.InsertEmailConfirmationCode(ctx, db.InsertEmailConfirmationCodeParams{
		ConfirmationCode: everifcode.ConfirmationCode,
		Email:            everifcode.Email,
	})
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert email verification code")
	}

	return nil
}

func (e *EmailConfirmationCode) Find(ctx context.Context, email string) (internal.EmailConfirmationCode, error) {
	emailcc, err := e.q.SelectEmailConfirmationCode(ctx, email)
	if err != nil {
		return internal.EmailConfirmationCode{}, errors.WrapErrorf(err, errors.ErrorCodeNotFound, "find email verification code")
	}

	return internal.EmailConfirmationCode{
		Email:            emailcc.Email,
		ConfirmationCode: emailcc.ConfirmationCode,
		CreatedAt:        emailcc.CreatedAt.Time,
	}, nil
}
