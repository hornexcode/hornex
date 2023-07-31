-- name: InsertTeam :one
INSERT INTO teams (
  name,
  owner_id
)
VALUES (
  @name,
  @owner_id
)
RETURNING id, created_at, updated_at;

-- name: SelectTeamById :one
SELECT * FROM teams WHERE id = @id;

-- name: SelectTeamsByOwnerId :many
SELECT * FROM teams WHERE owner_id = @owner_id;

-- name: SelectTeamByName :one
SELECT * FROM teams WHERE name = @name;

-- name: UpdateTeam :one
UPDATE teams SET name = @name, updated_at = NOW() WHERE id = @id RETURNING id, owner_id, created_at, updated_at;