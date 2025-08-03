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
