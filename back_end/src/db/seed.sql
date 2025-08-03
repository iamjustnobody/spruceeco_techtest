-- Players
INSERT OR IGNORE INTO player (id, username) VALUES
  ('uuid-alice', 'alice'),
  ('uuid-bob', 'bob'),
  ('uuid-charlie', 'charlie');

-- Matches
INSERT OR IGNORE INTO matches (id, board_size, win_condition, player_x, player_o, winner, played_at)
VALUES
  ('match-1', 3, 3, 'uuid-alice', 'uuid-bob', 'X', '2025-08-01T10:00:00'),
  ('match-2', 3, 3, 'uuid-bob', 'uuid-alice', 'O', '2025-08-01T10:10:00'),
  ('match-3', 3, 3, 'uuid-alice', 'uuid-charlie', NULL, '2025-08-01T10:15:00'); -- draw
