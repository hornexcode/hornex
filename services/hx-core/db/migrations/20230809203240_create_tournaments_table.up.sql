CREATE TABLE tournaments (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR NOT NULL UNIQUE,
  game_id          UUID NOT NULL,
  created_by       UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE INDEX tournaments_game_id_idx ON teams(game_id);