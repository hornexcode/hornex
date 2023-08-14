CREATE TABLE teams_members (
  team_id          UUID NOT NULL,
  user_id          UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX teams_members_team_id_idx ON teams_members(team_id);