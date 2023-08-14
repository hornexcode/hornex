package postgresql

import (
	"context"

	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
	"hornex.gg/hx-core/internal/postgresql/db"
)

// Account is the Account Repository
type Account struct {
	q *db.Queries
}

// NewPostgresqlAccountRepositoryImpl instatiates the Account Repository
func NewPostgresqlAccountRepositoryImpl(d db.DBTX) *Account {
	return &Account{q: db.New(d)}
}

func (u *Account) Create(ctx context.Context, params *internal.LOLAccountCreateParams) (*internal.LOLAccount, error) {
	userUUID, err := uuid.Parse(params.UserID)

	if err != nil {
		return &internal.LOLAccount{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "uuid.NewUUID")
	}

	res, err := u.q.InsertAccount(ctx, db.InsertAccountParams{
		ID:            params.ID,
		UserID:        userUUID,
		AccountID:     params.AccountID,
		Region:        params.Region,
		Puuid:         params.Puuid,
		SummonerName:  params.SummonerName,
		SummonerLevel: params.SummonerLevel,
		ProfileIconID: params.ProfileIconID,
		RevisionDate:  params.RevisionDate,
	})

	if err != nil {
		return &internal.LOLAccount{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "insert account")
	}

	return &internal.LOLAccount{
		ID:            res.ID,
		UserID:        res.UserID.String(),
		AccountID:     res.AccountID,
		Region:        res.Region,
		Puuid:         res.Puuid,
		SummonerName:  res.SummonerName,
		SummonerLevel: res.SummonerLevel,
		ProfileIconID: res.ProfileIconID,
		RevisionDate:  res.RevisionDate,
	}, nil
}

func (t *Account) Find(ctx context.Context, id string) (*internal.LOLAccount, error) {
	res, err := t.q.SelectAccountById(ctx, id)

	if err != nil {
		return &internal.LOLAccount{}, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "select team by id")
	}

	return &internal.LOLAccount{
		ID:            res.ID,
		UserID:        res.UserID.String(),
		AccountID:     res.AccountID,
		Region:        res.Region,
		Puuid:         res.Puuid,
		SummonerName:  res.SummonerName,
		SummonerLevel: res.SummonerLevel,
		ProfileIconID: res.ProfileIconID,
		RevisionDate:  res.RevisionDate,
	}, nil
}
