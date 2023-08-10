
CREATE TABLE user_accounts (
  account_id UUID NOT NULL,
  game_id UUID NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (account_id, game_id),
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);