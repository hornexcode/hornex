CREATE TYPE invite_status_type AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE teams_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status invite_status_type DEFAULT 'pending',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX teams_invites_team_id_idx ON teams_invites(team_id);
CREATE INDEX teams_invites_user_id_idx ON teams_invites(user_id);