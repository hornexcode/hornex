CREATE TABLE league_of_legends_accounts (
  id VARCHAR NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL,
  account_id VARCHAR NOT NULL,
  region VARCHAR NOT NULL,
  puuid VARCHAR NOT NULL,
  summoner_name VARCHAR NOT NULL,
  summoner_level INTEGER NOT NULL,
  profile_icon_id INTEGER NOT NULL,
  revision_date BIGINT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);