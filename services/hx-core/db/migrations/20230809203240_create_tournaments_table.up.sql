CREATE TYPE tournaments_status_type AS ENUM ('created', 'started', 'finished', 'cancelled');

CREATE TABLE tournaments (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name              VARCHAR NOT NULL UNIQUE,
  game_id           UUID NOT NULL,
  description       TEXT,
  entry_fee         INTEGER NOT NULL DEFAULT 0,
  prize_pool        INTEGER NOT NULL,
  is_active         BOOLEAN DEFAULT FALSE,
  status            tournaments_status_type DEFAULT 'created',
  start_time        TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_time          TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  max_participants  INTEGER NOT NULL,
  created_by        UUID NOT NULL,
  created_at        TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);