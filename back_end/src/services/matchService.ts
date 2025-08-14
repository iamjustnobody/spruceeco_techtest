import type { Player } from "@/models/index.js";
import { pool } from "@/server.js";

type MatchInput = {
  player_x: string;
  player_o: string;
  board_size: number;
  win_condition: number;
  winner: string | null;
};
type PlayerStatsRow = { wins: number; losses: number; draws: number };

export async function saveMatch(input: MatchInput) {
  const client = await pool.connect();
  try {
    const playerX = await client.query<Player>(
      `SELECT id FROM players WHERE username = $1`,
      [input.player_x]
    );
    if (playerX.rows.length === 0 || !playerX.rows[0])
      throw new Error(`Player not found: ${input.player_x}`);

    const playerO = await client.query<Player>(
      `SELECT id FROM players WHERE username = $1`,
      [input.player_o]
    );
    if (playerO.rows.length === 0 || !playerO.rows[0])
      throw new Error(`Player not found: ${input.player_o}`);

    const id = `match-${Date.now()}`; // simple unique ID

    await client.query(
      `
      INSERT INTO matches (id, player_x, player_o, board_size, win_condition, winner)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        id,
        playerX.rows[0]?.id ?? null,
        playerO.rows[0]?.id ?? null,
        input.board_size,
        input.win_condition,
        input.winner,
      ]
    );

    return { id };
  } finally {
    client.release();
  }
}
