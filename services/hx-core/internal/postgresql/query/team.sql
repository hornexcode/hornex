-- name: InsertTeam :one
INSERT INTO teams (
  name,
  game_id,
  created_by
)
VALUES (
  @name,
  @game_id,
  @created_by
)
RETURNING id, created_at, updated_at;

-- name: SelectTeamById :one
SELECT * FROM teams WHERE id = @id;

-- name: SelectTeamsByCreatorId :many
SELECT * FROM teams WHERE created_by = @created_by;

-- name: SelectTeamByName :one
SELECT * FROM teams WHERE name = @name;

-- name: UpdateTeam :one
UPDATE teams SET name = @name, updated_at = NOW() WHERE id = @id RETURNING id, created_by, created_at, updated_at;