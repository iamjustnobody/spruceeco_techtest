// import { v4 as uuidv4 } from "uuid";
// import pool from "@/db/index.js";
import type { Player, PlayerStats } from "@/models/index.js";
import { pool } from "@/server.js";
import { namedToPositional } from "@/utils/arrayToObject.js";

type Stats = {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
};

export async function getPlayerStats(
  username: string,
  boardSize?: number,
  winCondition?: number,
  opponentUsername?: string
): Promise<Stats | null> {
  const client = await pool.connect();
  try {
    const playerRes = await client.query<Player>(
      `SELECT id FROM players WHERE username = $1`,
      [username]
    );
    if (playerRes.rows.length === 0 || !playerRes.rows[0]) return null;

    const playerId = playerRes.rows[0].id;
    let opponentId: string | undefined;

    if (opponentUsername) {
      const oppRes = await client.query<Player>(
        `SELECT id FROM players WHERE username = $1`,
        [opponentUsername]
      );
      if (oppRes.rows.length === 0 || !oppRes.rows[0]) return null;
      opponentId = oppRes.rows[0].id;
    }

    const filters: string[] = [];
    const params: any[] = [
      playerId,
      playerId,
      playerId,
      playerId,
      playerId,
      playerId,
      playerId,
      playerId,
    ];
    let paramIndex = 9;

    if (boardSize !== undefined) {
      filters.push(`board_size = $${paramIndex++}`);
      params.push(boardSize);
    }
    if (winCondition !== undefined) {
      filters.push(`win_condition = $${paramIndex++}`);
      params.push(winCondition);
    }
    if (opponentId) {
      filters.push(
        `((player_x = $${paramIndex} AND player_o = $${
          paramIndex + 1
        }) OR (player_x = $${paramIndex + 1} AND player_o = $${paramIndex}))`
      );
      params.push(playerId, opponentId);
      paramIndex += 2;
    }

    const whereClause =
      filters.length > 0 ? `AND ${filters.join(" AND ")}` : "";

    const sql = `
      SELECT
        SUM(CASE WHEN (winner = 'X' AND player_x = $1) OR (winner = 'O' AND player_o = $2) THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN (winner = 'X' AND player_o = $3) OR (winner = 'O' AND player_x = $4) THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN winner IS NULL AND (player_x = $5 OR player_o = $6) THEN 1 ELSE 0 END) AS draws
      FROM matches
      WHERE (player_x = $7 OR player_o = $8)
      ${whereClause}
    `;

    const res = await client.query<PlayerStats>(sql, params);
    const row = res.rows[0];

    return {
      username,
      wins: Number(row?.wins ?? 0),
      losses: Number(row?.losses ?? 0),
      draws: Number(row?.draws ?? 0),
      total:
        Number(row?.wins ?? 0) +
        Number(row?.losses ?? 0) +
        Number(row?.draws ?? 0),
    };
  } finally {
    client.release();
  }
}

export async function savePlayer(username: string) {
  const client = await pool.connect();
  try {
    const existing = await client.query<Player>(
      `SELECT id FROM players WHERE username = $1`,
      [username]
    );

    if (existing.rows.length > 0 && existing.rows[0]) {
      return { id: existing.rows[0].id, username };
    }

    const id = crypto.randomUUID(); //uuidv4();
    await client.query(`INSERT INTO players (id, username) VALUES ($1, $2)`, [
      id,
      username,
    ]);

    return { id, username };
  } finally {
    client.release();
  }
}

type PlayerStatsQuery = {
  boardSize?: number;
  winCondition?: number;
  opponentUsername?: string;
};

export async function getPlayerStatsService(
  username: string,
  query: PlayerStatsQuery = {}
): Promise<Stats | null> {
  const client = await pool.connect();
  try {
    // Get player ID
    const playerRes = await client.query<Player>(
      `SELECT id FROM players WHERE username = $1`,
      [username]
    );
    if (playerRes.rows.length === 0 || !playerRes.rows[0]) return null;
    const playerId = playerRes.rows[0].id;

    // Prepare params object
    const params: Record<string, any> = { id: playerId };

    // Filters
    const filters: string[] = [];

    if (query.boardSize !== undefined) {
      filters.push(`board_size = :boardSize`);
      params.boardSize = query.boardSize;
    }

    if (query.winCondition !== undefined) {
      filters.push(`win_condition = :winCondition`);
      params.winCondition = query.winCondition;
    }

    if (query.opponentUsername) {
      const oppRes = await client.query<Player>(
        `SELECT id FROM players WHERE username = $1`,
        [query.opponentUsername]
      );
      if (oppRes.rows.length > 0 && oppRes.rows[0]) {
        filters.push(`(player_x = :opponent OR player_o = :opponent)`);
        params.opponent = oppRes.rows[0].id;
      }
    }

    const whereClause =
      filters.length > 0 ? `AND ${filters.join(" AND ")}` : "";

    // Use a helper to convert :param → $1, $2… for pg
    const { text, values } = namedToPositional(
      `
      SELECT
        SUM(CASE WHEN (winner = 'X' AND player_x = :id) OR (winner = 'O' AND player_o = :id) THEN 1 ELSE 0 END) AS wins,
        SUM(CASE WHEN (winner = 'X' AND player_o = :id) OR (winner = 'O' AND player_x = :id) THEN 1 ELSE 0 END) AS losses,
        SUM(CASE WHEN winner IS NULL AND (player_x = :id OR player_o = :id) THEN 1 ELSE 0 END) AS draws
      FROM matches
      WHERE (player_x = :id OR player_o = :id)
      ${whereClause}
      `,
      params
    );

    const res = await client.query<PlayerStats>(text, values);
    const row = res.rows[0];

    return {
      username,
      wins: Number(row?.wins ?? 0),
      losses: Number(row?.losses ?? 0),
      draws: Number(row?.draws ?? 0),
      total:
        Number(row?.wins ?? 0) +
        Number(row?.losses ?? 0) +
        Number(row?.draws ?? 0),
    };
  } finally {
    client.release();
  }
}
