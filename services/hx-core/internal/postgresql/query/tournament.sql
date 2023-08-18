
-- name: InsertTournament :one
INSERT INTO tournaments (
  name,
  game_id,
  description,
  entry_fee,
  prize_pool,
  is_active,
  status,
  due_date,
  created_by
)
VALUES (
  @name,
  @game_id,
  @description,
  @entry_fee,
  @prize_pool,
  @is_active,
  @status,
  @due_date,
  @created_by
)
RETURNING id, name, created_at;

-- name: SelectTournamentByName :one
SELECT * FROM tournaments WHERE name = @name;