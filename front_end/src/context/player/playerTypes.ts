import type { Player } from "@/types";

export interface PlayerState {
  players: Player[];
}

export type PlayerAction =
  | { type: "SET_PLAYERS"; payload: Player[] }
  | { type: "INCREMENT_WIN"; index: number }
  | { type: "INCREMENT_LOSE"; index: number }
  | { type: "INCREMENT_EVEN" }
  | { type: "FINISH_MATCH"; payload: { winnerIndex: number | null } }
  | { type: "CLEAR_SCORES" };
