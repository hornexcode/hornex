# README

## Requirements


Install the `migrate` tool using [`install_tools`](../bin/install_tools), you can [read more](../internal/tools/) about how those are versioned as well.

$ go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate
$ brew install golang-migrate

## Local PostgreSQL

```
docker run \
  -d \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=dbname \
  -p 5432:5432 \
  postgres:15.2-bullseye
```

## Migrations

Run:

```
export POSTGRESQL_URL='postgres://hxcore:password@localhost:5432/hxcore?sslmode=disable'
migrate -database ${POSTGRESQL_URL} -path ./services/hx-core/db/migrations up
```

```
tern migrate \
    --migrations 'db/migrations/' \
    --conn-string 'postgres://hxcore:password@localhost:5432/hxcore?sslmode=disable'
```

Create:

```
tern migrate create -ext sql -dir db/migrations/ <migration name>
or
migrate create -ext sql -dir services/hx-core/db/migrations/ create_teams_table
```
