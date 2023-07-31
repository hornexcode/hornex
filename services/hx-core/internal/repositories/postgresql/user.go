package postgresql

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/repositories/postgresql/db"
)

// User is the User Repository
type User struct {
	q *db.Queries
}

// NewUser instatiates the User Repository
func NewPostgresqlUserRepositoryImpl(d db.DBTX) *User {
	return &User{q: db.New(d)}
}

// Create inserts a new user record
func (u *User) Create(ctx context.Context, params internal.UserCreateParams) (internal.User, error) {
	// XXX: `ID` is being created on the database side
	// XXX: `CreatedAt` is being created on the database side
	// XXX: `UpdatedAt` is being created on the database side

	dob, err := time.Parse("2006-01-02", params.BirthDate)
	if err != nil {
		return internal.User{}, err
	}

	res, err := u.q.InsertUser(ctx, db.InsertUserParams{
		Email:     params.Email,
		FirstName: params.FirstName,
		LastName:  params.LastName,
		Password:  params.Password,
		BirthDate: pgtype.Date{
			Time:  dob,
			Valid: true,
		},
	})
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert user")
	}

	return internal.User{
		ID:        res.ID.String(),
		Email:     params.Email,
		FirstName: params.FirstName,
		LastName:  params.LastName,
		CreatedAt: res.CreatedAt.Time,
		UpdatedAt: res.UpdatedAt.Time,
	}, nil
}

func (u *User) FindByEmail(ctx context.Context, email string) (internal.User, error) {
	res, err := u.q.SelectUserByEmail(ctx, email)
	if err != nil {
		return internal.User{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select user by email")
	}

	return internal.User{
		ID:        res.ID.String(),
		Email:     res.Email,
		Password:  res.Password,
		FirstName: res.FirstName,
		LastName:  res.LastName,
		BirthDate: res.BirthDate.Time.Format("2006-01-02"),
		CreatedAt: res.CreatedAt.Time,
		UpdatedAt: res.UpdatedAt.Time,
	}, nil
}
