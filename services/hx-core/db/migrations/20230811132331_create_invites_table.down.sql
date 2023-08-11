DROP TABLE IF EXISTS invites;

DROP INDEX IF EXISTS invites_team_id_idx;
DROP INDEX IF EXISTS invites_user_id_idx;

DROP CONSTRAINT IF EXISTS invites_team_id_fkey;
DROP CONSTRAINT IF EXISTS invites_user_id_fkey;
