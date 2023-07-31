package postgresql

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type clientKey struct{}

type Client struct {
	DB *pgxpool.Pool
}

func WithClient(ctx context.Context, client *Client) context.Context {
	return context.WithValue(ctx, clientKey{}, client)
}

func FromContext(ctx context.Context) *Client {
	return ctx.Value(clientKey{}).(*Client)
}

func NewClient(db *pgxpool.Pool) *Client {
	return &Client{}
}
