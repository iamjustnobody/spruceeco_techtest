-- Players
-- INSERT OR IGNORE INTO player (id, username) VALUES
--   ('uuid-alice', 'alice'),
--   ('uuid-bob', 'bob'),
--   ('uuid-charlie', 'charlie');

-- -- Matches
-- INSERT OR IGNORE INTO matches (id, board_size, win_condition, player_x, player_o, winner, played_at)
-- VALUES
--   ('match-1', 3, 3, 'uuid-alice', 'uuid-bob', 'X', '2025-08-01T10:00:00'),
--   ('match-2', 3, 3, 'uuid-bob', 'uuid-alice', 'O', '2025-08-01T10:10:00'),
--   ('match-3', 3, 3, 'uuid-alice', 'uuid-charlie', NULL, '2025-08-01T10:15:00'); -- draw


-- postgresql
-- INSERT INTO players (id, name) VALUES
--   ('uuid-alice', 'alice'),
--   ('uuid-bob', 'bob'),
--   ('uuid-charlie', 'charlie')
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO matches (id, board_size, win_condition, player_x, player_o, winner, played_at)
-- VALUES
--   ('match-1', 3, 3, 'uuid-alice', 'uuid-bob', 'X', '2025-08-01T10:00:00+00'),
--   ('match-2', 3, 3, 'uuid-bob', 'uuid-alice', 'O', '2025-08-01T10:10:00+00'),
--   ('match-3', 3, 3, 'uuid-alice', 'uuid-charlie', NULL, '2025-08-01T10:15:00+00')
-- ON CONFLICT (id) DO NOTHING;

-- Ensure usernames are unique first
ALTER TABLE players
ADD CONSTRAINT IF NOT EXISTS unique_username UNIQUE (username);

-- Insert players safely
INSERT INTO players (username)
VALUES
  ('alice'),
  ('bob'),
  ('charlie')
ON CONFLICT (username) DO NOTHING;

-- -- Add a unique constraint to matches
-- ALTER TABLE matches
-- ADD CONSTRAINT IF NOT EXISTS unique_match UNIQUE (player_x, player_o, played_at);


-- WITH player_ids AS (
--   SELECT id, username FROM players
-- )
-- INSERT INTO matches (board_size, win_condition, player_a_id, player_b_id, result, created_at)
-- VALUES
--   (
--     3,
--     3,
--     (SELECT id FROM player_ids WHERE username = 'alice'),
--     (SELECT id FROM player_ids WHERE username = 'bob'),
--     'A',
--     '2025-08-01T10:00:00+00'
--   ),
--   (
--     3,
--     3,
--     (SELECT id FROM player_ids WHERE username = 'bob'),
--     (SELECT id FROM player_ids WHERE username = 'alice'),
--     'B',
--     '2025-08-01T10:10:00+00'
--   ),
--   (
--     3,
--     3,
--     (SELECT id FROM player_ids WHERE username = 'alice'),
--     (SELECT id FROM player_ids WHERE username = 'charlie'),
--     'draw',
--     '2025-08-01T10:15:00+00'
--   )
-- ON CONFLICT (board_size, win_condition, player_a_id, player_b_id, created_at) DO NOTHING;

ALTER TABLE matches
ADD CONSTRAINT IF NOT EXISTS unique_match UNIQUE (player_x, player_o, played_at);
-- Insert matches safely using a CTE for player IDs
WITH player_ids AS (
    SELECT id, username FROM players
),
match_data AS (
    VALUES
      ('alice', 'bob', 'X', '2025-08-01T10:00:00+00'),
      ('bob', 'alice', 'O', '2025-08-01T10:10:00+00'),
      ('alice', 'charlie', NULL, '2025-08-01T10:15:00+00')
) AS m(username_x, username_o, winner, played_at)
INSERT INTO matches (board_size, win_condition, player_x, player_o, winner, played_at)
SELECT
    3, 3,
    px.id AS player_x,
    po.id AS player_o,
    m.winner,
    m.played_at
FROM match_data m
JOIN player_ids px ON px.username = m.username_x
JOIN player_ids po ON po.username = m.username_o
ON CONFLICT (player_x, player_o, played_at) DO NOTHING;
