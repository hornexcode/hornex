CREATE TABLE users (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email            VARCHAR NOT NULL UNIQUE,
  password         VARCHAR NOT NULL,
  first_name       VARCHAR NOT NULL,
  last_name        VARCHAR NOT NULL,
  birth_date       DATE NOT NULL,
  email_confirmed  BOOLEAN DEFAULT FALSE NOT NULL,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
