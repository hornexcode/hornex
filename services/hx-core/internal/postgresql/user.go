package postgresql

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/pedrosantosbr/x5/internal"
	"github.com/pedrosantosbr/x5/internal/postgresql/db"
	"github.com/pedrosantosbr/x5/internal/services"
)

// User is the User Repository
type User struct {
	q *db.Queries
}

// NewUser instatiates the User Repository
func NewUser(d db.DBTX) *User {
	return &User{q: db.New(d)}
}

// Create inserts a new user record
func (u *User) Create(ctx context.Context, params services.UserCreateParams) (internal.User, error) {
	// XXX: `ID` is being created on the database side
	// XXX: `CreatedAt` is being created on the database side
	// XXX: `UpdatedAt` is being created on the database side

	res, err := u.q.InsertUser(ctx, db.InsertUserParams{
		Email:     params.Email,
		FirstName: params.FirstName,
		LastName:  params.LastName,
		Password:  params.Password,
		DateOfBirth: pgtype.Date{
			Time:  params.DateOfBirth,
			Valid: true,
		},
	})
	if err != nil {
		return internal.User{}, internal.WrapErrorf(err, internal.ErrorCodeUnknown, "insert user")
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
		if err.Error() == "no rows in result set" {
			return internal.User{}, nil
		}

		return internal.User{}, internal.WrapErrorf(err, internal.ErrorCodeUnknown, "select user by email")
	}

	return internal.User{
		ID:          res.ID.String(),
		Email:       res.Email,
		Password:    res.Password,
		FirstName:   res.FirstName,
		LastName:    res.LastName,
		DateOfBirth: res.DateOfBirth.Time,
		CreatedAt:   res.CreatedAt.Time,
		UpdatedAt:   res.UpdatedAt.Time,
	}, nil
}
