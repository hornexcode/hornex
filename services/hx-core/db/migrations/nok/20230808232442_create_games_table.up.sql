CREATE TABLE IF NOT EXISTS games (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name             VARCHAR NOT NULL UNIQUE,
  slug             VARCHAR NOT NULL UNIQUE
);