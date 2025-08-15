import type { SupabaseClient } from "@supabase/supabase-js";
import type { Pool } from "pg";

export interface Player {
  username: string;
  shape?: string;
  color?: string;
  wins: number;
  draws: number;
  losses: number;
  opponents?: string[];
  id: string;
}

export interface Matchup {
  id: string;
  players: [string, string];
  boardSize: number;
  winCondition: number;
  whoStarted: string;
  winner: string | null;
  timestamp: Date;
  boardState?: string[][]; // opt
}
export type NewMatch = Omit<Matchup, "id" | "timestamp">;

export interface GameSession {
  id: string;
  players: [string, string];
  gameMode: "local" | "online";
  boardSize: number;
  winCondition: number;
  history?: Matchup["id"][];
  score?: {
    [username: string]: {
      wins: number;
      draws: number;
      losses: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export type PlayerStats = {
  wins: number | null;
  losses: number | null;
  draws: number | null;
};

type PlayerInMatch = {
  id: string;
  shape?: string;
  color?: string;
  username?: string;
};

export type Match = {
  id: string;
  boardSize: number;
  winCondition: number;
  playerX: PlayerInMatch;
  playerO: PlayerInMatch;
  winner: "X" | "O" | null;
  playedAt: string;
};

export interface PlayerDB {
  id?: string;
  username: string;
  created_at?: string;
}

export interface MatchDB {
  id?: string;
  board_size: number;
  win_condition: number;
  player_x: string;
  player_o: string;
  winner: "X" | "O" | null;
  played_at: string;
}

export type DatabaseType = Pool | SupabaseClient<any, "public", any>;
