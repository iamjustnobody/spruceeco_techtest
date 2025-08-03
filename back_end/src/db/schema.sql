-- PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS player (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL COLLATE BINARY  -- Enforce case-sensitive uniqueness
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  board_size INTEGER NOT NULL,
  win_condition INTEGER NOT NULL,
  player_x TEXT NOT NULL REFERENCES player(id),
  player_o TEXT NOT NULL REFERENCES player(id),
  winner TEXT CHECK(winner IN ('X', 'O')) DEFAULT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
