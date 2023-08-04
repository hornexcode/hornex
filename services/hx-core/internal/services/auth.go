package services

import (
	"context"

	"hornex.gg/hornex/auth"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories"
)

type Provider interface {
	SignUp(ctx context.Context, user *internal.User) error
	ConfirmSignUp(ctx context.Context, email, confirmationCode string) error
	SignIn(ctx context.Context, email, password string) (string, error)
}

type Auth struct {
	provider Provider
	repo     repositories.UserRepository
}

func NewAuthService(provider Provider, repo repositories.UserRepository) *Auth {
	return &Auth{
		provider: provider,
		repo:     repo,
	}
}

// UserSignUp is a method that creates a new user in the database and in the cognito user pool
func (a *Auth) SignUp(ctx context.Context, params internal.UserCreateParams) error {
	err := a.provider.SignUp(ctx, &internal.User{
		Email:     params.Email,
		FirstName: params.FirstName,
		LastName:  params.LastName,
		BirthDate: params.BirthDate,
		Password:  params.Password,
	})

	if err != nil {
		return err
	}
	return nil
}

// UserSignIn is a method that authenticates a user in the cognito user pool
func (a *Auth) ConfirmSignUp(ctx context.Context, email, confirmationCode string) error {
	err := a.provider.ConfirmSignUp(ctx, email, confirmationCode)
	if err != nil {
		return err
	}
	return nil
}

// UserSignIn is a method that authenticates a user in the cognito user pool and return the user and the access token
func (a *Auth) SignIn(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error) {
	token, err := a.provider.SignIn(ctx, params.Email, params.Password)
	if err != nil {
		return internal.UserToken{}, err
	}

	user, err := a.repo.FindByEmail(ctx, params.Email)
	if err != nil {
		return internal.UserToken{}, err
	}

	return internal.UserToken{
		User:        user,
		AccessToken: token,
	}, nil
}

func (a *Auth) Login(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error) {
	user, err := a.repo.FindByEmail(ctx, params.Email)
	if err != nil {
		return internal.UserToken{}, err
	}
	token, err := auth.GenerateJWTAccessToken(user.ID, user.Email, user.FirstName, user.LastName)
	if err != nil {
		return internal.UserToken{}, err
	}

	return internal.UserToken{
		User:        user,
		AccessToken: token,
	}, nil
}
