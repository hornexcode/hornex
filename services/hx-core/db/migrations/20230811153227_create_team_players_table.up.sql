CREATE TABLE team_players (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id          UUID NOT NULL,
  lol_account_id   UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (lol_account_id) REFERENCES lol_accounts(id) ON DELETE CASCADE
);

CREATE INDEX team_players_team_id_idx ON team_players(team_id);