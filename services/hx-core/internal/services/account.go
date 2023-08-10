package services

import (
	"context"

	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type Account struct {
	accountRepository AccountRepository
}

func NewAccountService(arepo AccountRepository) *Account {
	return &Account{accountRepository: arepo}
}

func (a *Account) Create(ctx context.Context, params internal.LOLAccountCreateParams) (*internal.LOLAccount, error) {
	err := params.Validate()
	if err != nil {
		return &internal.LOLAccount{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	exists, _ := a.accountRepository.Find(ctx, params.ID)
	if exists.ID != "" {
		return &internal.LOLAccount{}, errors.NewErrorf(errors.ErrorCodeInvalidArgument, "Account already exist summoner name %s", params.SummonerName)
	}

	account, err := a.accountRepository.Create(ctx, &params)
	if err != nil {
		return &internal.LOLAccount{}, errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "params.Validate")
	}

	return account, nil
}
