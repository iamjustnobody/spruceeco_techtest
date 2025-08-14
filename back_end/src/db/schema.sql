-- PRAGMA foreign_keys = ON;

-- CREATE TABLE IF NOT EXISTS player (
--   id TEXT PRIMARY KEY,
--   username TEXT UNIQUE NOT NULL COLLATE BINARY  -- Enforce case-sensitive uniqueness
-- );

-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CREATE TABLE players (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name TEXT NOT NULL
-- );
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_player_username ON player(username COLLATE BINARY);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL
);


-- CREATE TABLE IF NOT EXISTS matches (
--   id TEXT PRIMARY KEY,
--   board_size INTEGER NOT NULL,
--   win_condition INTEGER NOT NULL,
--   player_x TEXT NOT NULL REFERENCES player(id),
--   player_o TEXT NOT NULL REFERENCES player(id),
--   winner TEXT CHECK(winner IN ('X', 'O')) DEFAULT NULL,
--   played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    board_size INT NOT NULL,
    win_condition INT NOT NULL,

    player_x UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player_o UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,

    winner CHAR(1) CHECK (winner IN ('X', 'O')) DEFAULT NULL, -- NULL = draw

    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

