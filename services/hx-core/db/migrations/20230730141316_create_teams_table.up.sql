CREATE TABLE teams (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR NOT NULL UNIQUE,
  created_by       UUID NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);