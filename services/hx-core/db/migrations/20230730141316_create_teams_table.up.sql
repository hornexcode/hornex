CREATE TABLE teams (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR NOT NULL UNIQUE,
  owner_id         UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),

  CONSTRAINT teams_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);