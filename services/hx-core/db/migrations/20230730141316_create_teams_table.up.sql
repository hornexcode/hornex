CREATE TABLE teams (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR NOT NULL UNIQUE,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);