-- name: InsertAccount :one
INSERT INTO lol_accounts (
  id,
  user_id,
  account_id,
  puuid,
  summoner_name,
  summoner_level,
  profile_icon_id,
  revision_date
)
VALUES (
  @id,
  @user_id,
  @account_id,
  @puuid,
  @summoner_name,
  @summoner_level,
  @profile_icon_id,
  @revision_date
)
RETURNING id, user_id, account_id, puuid, summoner_name, summoner_level, profile_icon_id, revision_date, verified, created_at, updated_at;