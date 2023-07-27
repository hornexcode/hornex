package postgresql

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Client struct {
	DB *pgxpool.Pool
}

type clientKey struct{}

func WithClient(ctx context.Context, client *Client) context.Context {
	return context.WithValue(ctx, clientKey{}, client)
}

func NewClient(db *pgxpool.Pool) *Client {
	return &Client{}
}
