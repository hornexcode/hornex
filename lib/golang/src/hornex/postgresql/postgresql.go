package postgresql

import (
	"context"
	"fmt"
	"net/url"

	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/jackc/pgx/v5/stdlib"
	"hornex.gg/hornex/envvar"
	"hornex.gg/hornex/errors"
)

// NewPostgreSQL instantiates the PostgreSQL database using configuration defined in environment variables.
func NewPostgreSQL(conf *envvar.Configuration) (*pgxpool.Pool, error) {

	// XXX: We will revisit this code in future episodes replacing it with another solution
	databaseHost := conf.Get("DATABASE_HOST")
	databasePort := conf.Get("DATABASE_PORT")
	databaseUsername := conf.Get("DATABASE_USERNAME")
	databasePassword := conf.Get("DATABASE_PASSWORD")
	databaseName := conf.Get("DATABASE_NAME")
	databaseSSLMode := conf.Get("DATABASE_SSLMODE")
	// XXX: -

	dsn := url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(databaseUsername, databasePassword),
		Host:   fmt.Sprintf("%s:%s", databaseHost, databasePort),
		Path:   databaseName,
	}

	q := dsn.Query()
	q.Add("sslmode", databaseSSLMode)

	dsn.RawQuery = q.Encode()

	pool, err := pgxpool.New(context.Background(), dsn.String())
	if err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "pgxpool.Connect")
	}

	if err := pool.Ping(context.Background()); err != nil {
		return nil, errors.WrapErrorf(err, errors.ErrorCodeUnknown, "db.Ping")
	}

	return pool, nil
}
