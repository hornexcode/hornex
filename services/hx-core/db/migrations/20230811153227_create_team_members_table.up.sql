CREATE TABLE team_members (
  team_id          UUID NOT NULL,
  user_id          UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX team_members_team_id_idx ON team_members(team_id);