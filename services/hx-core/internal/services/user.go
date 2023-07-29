package services

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories"
)

type PasswordHasher interface {
	Hash(password string) string
	Check(password, hash string) error
}

type User struct {
	repo   repositories.UserRepository
	hasher PasswordHasher
}

func (u *User) Create(ctx context.Context, params internal.UserCreateParams) (internal.User, error) {
	found, err := u.repo.FindByEmail(ctx, params.Email)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.FindByEmail")
	}

	if found.ID != "" {
		return internal.User{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "user already exists")
	}

	hashedPassword := u.hasher.Hash(params.Password)
	params.Password = hashedPassword

	user, err := u.repo.Create(ctx, params)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Create")
	}

	return user, nil
}

func (u *User) GetUserByEmail(ctx context.Context, email string) (internal.User, error) {
	user, err := u.repo.FindByEmail(ctx, email)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Find")
	}

	return user, nil
}

// NewUserService...
func NewUserService(repo repositories.UserRepository, hasher PasswordHasher) *User {
	return &User{
		repo:   repo,
		hasher: hasher,
	}
}
