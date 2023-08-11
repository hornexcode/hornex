package services

import (
	"context"
	goerrors "errors"
	"fmt"

	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type User struct {
	repo        UserRepository
	msgBroker   UserMessageBrokerRepository
	emailCCRepo EmailConfirmationCodeRepository
}

// New
func NewUser(repo UserRepository, msgBroker UserMessageBrokerRepository, emailCCRepo EmailConfirmationCodeRepository) *User {
	return &User{
		repo:        repo,
		msgBroker:   msgBroker,
		emailCCRepo: emailCCRepo,
	}
}

func (u *User) SignUp(ctx context.Context, params internal.UserCreateParams) (internal.User, string, error) {
	_, err := u.repo.FindByEmail(ctx, params.Email)

	var ierr *errors.Error
	goerrors.As(err, &ierr)
	if err != nil && ierr.Code() != errors.ErrorCodeNotFound {
		return internal.User{}, "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "search.Search")
	}

	params.Password = internal.User{}.HashPassword(params.Password)
	user, err := u.repo.Create(ctx, params)
	if err != nil {
		return internal.User{}, "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "error creating user")
	}

	// if err := u.msgBroker.Created(ctx, user); err != nil {
	// 	fmt.Println(err)
	// }

	token, err := auth.GenerateJWTAccessToken(user.ID, user.Email, user.FirstName, user.LastName)
	if err != nil {
		return internal.User{}, "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "auth.GenerateJWTAccessToken")
	}

	return user, token, nil
}

func (u *User) ConfirmSignUp(ctx context.Context, email, confirmationCode string) error {
	emailcc, err := u.emailCCRepo.Find(ctx, email)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "emailcc.Find")
	}
	fmt.Println("codes: ", emailcc.ConfirmationCode, confirmationCode)
	if emailcc.ConfirmationCode != confirmationCode {
		return errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "invalid confirmation code")
	}

	user, err := u.repo.FindByEmail(ctx, email)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeNotFound, "repo.Find")
	}

	_, err = u.repo.Update(ctx, internal.UserUpdateParams{
		ID:             user.ID,
		EmailConfirmed: true,
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		BirthDate:      user.BirthDate,
		Email:          user.Email,
	})

	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Update")
	}

	return nil
}

func (u *User) Login(ctx context.Context, email, password string) (string, error) {
	user, err := u.repo.FindByEmail(ctx, email)
	var ierr *errors.Error
	goerrors.As(err, &ierr)
	if err != nil {
		if ierr.Code() == errors.ErrorCodeNotFound {
			return "", errors.WrapErrorf(err, errors.ErrorCodeNotFound, "user does not exists")
		}
		return "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "search.Search")
	}

	if err := user.ComparePasswords(password); err != nil {
		return "", errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "user.ComparePasswords")
	}

	token, err := auth.GenerateJWTAccessToken(user.ID, user.Email, user.FirstName, user.LastName)
	if err != nil {
		return "", errors.WrapErrorf(err, errors.ErrorCodeUnknown, "auth.GenerateJWTAccessToken")
	}

	return token, nil
}

func (u *User) GetUserById(ctx context.Context, id string) (internal.User, error) {
	user, err := u.repo.Find(ctx, id)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Find")
	}

	return user, nil
}

// GetEmailConfirmationCode ... Creates a new confirmation code for given email
func (u *User) GetEmailConfirmationCode(ctx context.Context, email string) error {
	user, err := u.repo.FindByEmail(ctx, email)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Find")
	}

	if err := u.emailCCRepo.Create(ctx, user.Email); err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "email.Create")
	}

	if err := u.msgBroker.Created(ctx, user); err != nil {
		fmt.Println(err)
	}

	return nil
}

func (u *User) Search(ctx context.Context, email string) (*internal.User, error) {

	user, err := u.repo.FindByEmail(ctx, email)

	if err != nil {
		return &internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.FindByEmail")
	}

	return &user, nil
}
