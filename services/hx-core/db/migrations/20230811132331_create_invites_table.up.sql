CREATE TYPE status_type AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  status status_type,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX invites_team_id_idx ON invites(team_id);
CREATE INDEX invites_user_id_idx ON invites(user_id);