import db from "../db/index.js";
// import { v4 as uuidv4 } from "uuid";
// import db from "@/db/index.js";
import type { Player, PlayerStats } from "../models/index.js";

type Stats = {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  total: number;
};

export function getStats(
  username: string,
  boardSize?: number,
  winCondition?: number,
  opponentUsername?: string
): Stats | null {
  const player = db
    .prepare(`SELECT id FROM player WHERE username = ?`)
    .get(username) as Partial<Player>;
  if (!player) return null;

  let opponentId: string | undefined;
  if (opponentUsername) {
    const opp = db
      .prepare(`SELECT id FROM player WHERE username = ?`)
      .get(opponentUsername) as Partial<Player>;
    if (!opp) return null;
    opponentId = opp.id;
  }

  const filters: string[] = [];
  const params: any[] = [];

  if (boardSize !== undefined) {
    filters.push("board_size = ?");
    params.push(boardSize);
  }

  if (winCondition !== undefined) {
    filters.push("win_condition = ?");
    params.push(winCondition);
  }

  if (opponentId) {
    filters.push(
      "((player_x = ? AND player_o = ?) OR (player_x = ? AND player_o = ?))"
    );
    params.push(player.id, opponentId, opponentId, player.id);
  }

  const whereClause = filters.length > 0 ? `AND ${filters.join(" AND ")}` : "";

  const sql = `
    SELECT
      SUM(CASE
          WHEN (winner = 'X' AND player_x = ?) OR (winner = 'O' AND player_o = ?) THEN 1
          ELSE 0
        END) AS wins,
      SUM(CASE
          WHEN (winner = 'X' AND player_o = ?) OR (winner = 'O' AND player_x = ?) THEN 1
          ELSE 0
        END) AS losses,
      SUM(CASE WHEN winner IS NULL AND (player_x = ? OR player_o = ?) THEN 1 ELSE 0 END) AS draws
    FROM matches
    WHERE (player_x = ? OR player_o = ?)
      ${whereClause}
  `;

  const row = db.prepare(sql).get(
    player.id,
    player.id, // wins
    player.id,
    player.id, // losses
    player.id,
    player.id, // draws
    player.id,
    player.id, // WHERE player_x/o = ?
    ...params // filters
  ) as Partial<PlayerStats>;

  return {
    username,
    wins: row?.wins || 0,
    losses: row?.losses || 0,
    draws: row?.draws || 0,
    total: (row?.wins || 0) + (row?.losses || 0) + (row?.draws || 0),
  };
}

export function savePlayer(username: string) {
  const existing = db
    .prepare(`SELECT id FROM player WHERE username = ?`)
    .get(username) as Partial<Player>;

  if (existing) {
    return { id: existing.id, username };
  }

  const id = crypto.randomUUID(); //uuidv4();
  const stmt = db.prepare(`INSERT INTO player (id, username) VALUES (?, ?)`);
  stmt.run(id, username);

  return { id, username };
}

export function getPlayerStatsService(username: string, query: any) {
  // Case-sensitive player lookup
  const player = db
    .prepare(`SELECT * FROM player WHERE username = ?`)
    .get(username) as Partial<Player>;
  if (!player) return null;

  const filters: string[] = [];
  const params: Record<string, any> = { id: player.id }; // id: player.username };

  if (query.boardSize) {
    filters.push("board_size = @boardSize");
    params.boardSize = Number(query.boardSize);
  }

  if (query.winCondition) {
    filters.push("win_condition = @winCondition");
    params.winCondition = Number(query.winCondition);
  }

  //   if (query.opponent) { //id
  //     filters.push("(player_x = @opponent OR player_o = @opponent)");
  //     params.opponent = query.opponent;
  //   }

  if (query.opponent) {
    //username
    const opponentPlayer = db
      .prepare(`SELECT id FROM player WHERE username = ?`)
      .get(query.opponent) as Partial<Player>;
    if (opponentPlayer) {
      filters.push("(player_x = @opponent OR player_o = @opponent)");
      params.opponent = opponentPlayer.id;
    }
  }

  const whereClause = filters.length > 0 ? `AND ${filters.join(" AND ")}` : "";

  const sql = `
    SELECT
      SUM(CASE
          WHEN (winner = 'X' AND player_x = @id) OR (winner = 'O' AND player_o = @id) THEN 1
          ELSE 0
        END) AS wins,
      SUM(CASE
          WHEN (winner = 'X' AND player_o = @id) OR (winner = 'O' AND player_x = @id) THEN 1
          ELSE 0
        END) AS losses,
      SUM(CASE WHEN winner IS NULL AND (player_x = @id OR player_o = @id) THEN 1 ELSE 0 END) AS draws
    FROM matches
    WHERE (player_x = @id OR player_o = @id)
    ${whereClause}
  `;

  const row = db.prepare(sql).get(params) as Partial<PlayerStats>;

  return {
    username: player?.username,
    wins: row?.wins ?? 0,
    losses: row?.losses ?? 0,
    draws: row?.draws ?? 0,
  };
}
