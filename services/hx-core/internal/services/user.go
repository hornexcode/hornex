package services

import (
	"context"
	goerrors "errors"

	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type User struct {
	repo UserRepository
	// msgBroker UserMessageBrokerRepository
}

// New
func NewUser(repo UserRepository) *User {
	return &User{
		repo: repo,
	}
}

func (u *User) SignUp(ctx context.Context, params internal.UserCreateParams) (*internal.User, error) {
	_, err := u.repo.FindByEmail(ctx, params.Email)

	var ierr *errors.Error
	goerrors.As(err, &ierr)
	if err != nil && ierr.Code() != errors.ErrorCodeNotFound {
		return &internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "search.Search")
	}

	params.Password = internal.User{}.HashPassword(params.Password)
	user, err := u.repo.Create(ctx, params)
	if err != nil {
		return &internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "error creating user")
	}

	// u.msgBroker.Created(ctx, user)

	// body, _ := json.Marshal(map[string]string{
	// 	"to":      user.Email,
	// 	"from":    "onboarding@resend.dev",
	// 	"subject": "Confirmation code",
	// 	"html":    "Your confirmation code is: 492823",
	// })
	// url := "https://api.resend.com/emails"
	// req, _ := http.NewRequest("POST", url, bytes.NewReader(body))
	// req.Header.Add("Content-Type", "application/json")
	// req.Header.Add("Authorization", "Bearer "+os.Getenv("RESEND_API_KEY"))

	// res, err := http.DefaultClient.Do(req)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// data, _ := io.ReadAll(res.Body)
	// fmt.Println(data)
	// defer res.Body.Close()

	return &user, nil
}

func (u *User) ConfirmSignUp(ctx context.Context, email, confirmationCode string) error {
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
	user, err := u.repo.FindByEmail(ctx, id)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "repo.Find")
	}

	return user, nil
}
