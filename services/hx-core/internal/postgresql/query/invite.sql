-- name: InsertTeamInvite :one
INSERT INTO teams_invites (
  team_id,
  user_id
) VALUES (
  @team_id,
  @user_id
) RETURNING id, team_id, user_id, status, created_at, updated_at;

-- name: SelectInviteByIdAndUser :one
SELECT * FROM teams_invites WHERE id = @id AND user_id = @user_id;

-- name: SelectInviteByUserAndTeam :one
SELECT * FROM teams_invites WHERE team_id = @team_id AND user_id = @user_id;

-- name: UpdateInvite :one
UPDATE teams_invites SET status = @status, updated_at = NOW() WHERE id = @id RETURNING id,team_id, user_id, status, created_at, updated_at;

-- name: SelectInvitesByUser :many
SELECT 
  ti.status as status, 
  ti.created_at as created_at, 
  ti.id as id, 
  t.id as team_id, 
  t.name team_name,
  t.game_id as game_id,
  t.created_by as created_by
FROM 
  teams_invites ti 
JOIN teams t ON ti.team_id = t.id 
WHERE ti.user_id = @user_id;
