export interface Player {
  username: string;
  color?: string;
  shape?: string;
  score: {
    wins: number;
    even: number;
    lose: number;
  };
}

export interface MatchInput {
  player_x: string; // username - previously id
  player_o: string; // username - previously id
  board_size: number;
  win_condition: number;
  winner: string | null;
}

export type StatsSummary = {
  username: string;
  wins: number;
  losses: number;
  draws: number;
};
