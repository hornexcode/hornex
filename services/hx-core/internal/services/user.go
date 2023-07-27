package services

import (
	"context"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories"
)

type PasswordHasher interface {
	Hash(password string) (string, error)
	Check(password, hash string) error
}

type Identifier interface {
	Register(user *internal.User) error
}

type User struct {
	repo       repositories.UserRepository
	hasher     PasswordHasher
	identifier Identifier
}

func (u *User) RegisterNewUser(ctx context.Context, params internal.UserCreateParams) (internal.User, error) {
	if err := params.Validate(); err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	found, err := u.repo.FindByEmail(ctx, params.Email)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.FindByEmail")
	}

	if found.ID != "" {
		return internal.User{}, errors.WrapErrorf(validation.Errors{
			"email": errors.NewErrorf(errors.ErrorCodeInvalidArgument, "email already exists"),
		}, errors.ErrorCodeInvalidArgument, "email already exists")
	}

	hashedPassword, err := u.hasher.Hash(params.Password)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "hasher.Hash")
	}

	params.Password = hashedPassword

	user, err := u.repo.Create(ctx, params)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Create")
	}

	err = u.identifier.Register(&user)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "token.GenerateToken")
	}

	return user, nil
}

func (u *User) SignIn(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error) {
	return internal.UserToken{}, nil
}

// NewUserService...
func NewUserService(repo repositories.UserRepository, hasher PasswordHasher, identifier Identifier) *User {
	return &User{
		repo:       repo,
		hasher:     hasher,
		identifier: identifier,
	}
}
