import db from "../db/index.js";

// import db from "@/db/index.js";

type MatchInput = {
  player_x: string;
  player_o: string;
  board_size: number;
  win_condition: number;
  winner: string | null;
};
type PlayerStatsRow = { wins: number; losses: number; draws: number };

export function saveMatch(input: MatchInput) {
  const id = crypto.randomUUID(); //uuidv4();

  const stmt = db.prepare(`
    INSERT INTO matches (id, player_x, player_o, board_size, win_condition, winner)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    input.player_x,
    input.player_o,
    input.board_size,
    input.win_condition,
    input.winner
  );

  return { id };
}

export function getStats(username: string) {
  const stmt = db.prepare(`
    SELECT
      SUM(CASE WHEN (winner = 'X' AND player_x = ?) OR (winner = 'O' AND player_o = ?) THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN (winner = 'X' AND player_o = ?) OR (winner = 'O' AND player_x = ?) THEN 1 ELSE 0 END) AS losses,
      SUM(CASE WHEN winner IS NULL AND (player_x = ? OR player_o = ?) THEN 1 ELSE 0 END) AS draws
    FROM matches
    WHERE player_x = ? OR player_o = ?
  `);

  const row = stmt.get(
    username,
    username,
    username,
    username,
    username,
    username,
    username,
    username
  ) as PlayerStatsRow;

  if (!row) {
    return { username, wins: 0, losses: 0, draws: 0, total: 0 };
  }

  return {
    username,
    wins: row?.wins || 0,
    losses: row?.losses || 0,
    draws: row?.draws || 0,
    total: (row.wins || 0) + (row.losses || 0) + (row.draws || 0),
  };
}
