-- name: SelectGames :many
SELECT * FROM games;

-- name: SelectGameById :one
SELECT * FROM games WHERE id = @id;