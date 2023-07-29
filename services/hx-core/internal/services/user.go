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
	auth   repositories.AuthorizerRepository
	hasher PasswordHasher
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
		return internal.User{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "user already exists")
	}

	err = u.auth.SignUp(ctx, &internal.User{
		Email:     params.Email,
		FirstName: params.FirstName,
		LastName:  params.LastName,
		BirthDate: params.BirthDate,
		Password:  params.Password,
	})
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "auth.SignUp")
	}

	hashedPassword := u.hasher.Hash(params.Password)
	params.Password = hashedPassword

	user, err := u.repo.Create(ctx, params)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Create")
	}

	return user, nil
}

func (u *User) SignIn(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error) {
	return internal.UserToken{}, nil
}

// NewUserService...
func NewUserService(repo repositories.UserRepository, hasher PasswordHasher, auth repositories.AuthorizerRepository) *User {
	return &User{
		repo:   repo,
		hasher: hasher,
		auth:   auth,
	}
}
