// lib/gameUtils.ts

export type Cell = {
  row: number;
  col: number;
  player: number | null;
};

export function checkWinner(
  board: (number | null)[][],
  marksToWin: number
): number | null {
  const n = board.length;

  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal right
    [1, -1], // diagonal left
  ];

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const player = board[row][col];
      if (player === null) continue;

      for (const [dr, dc] of directions) {
        let count = 1;
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < n && c >= 0 && c < n && board[r][c] === player) {
          count++;
          if (count === marksToWin) return player;
          r += dr;
          c += dc;
        }
      }
    }
  }

  return null;
}

export const generateEmptyBoard = (size: number) =>
  Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

export const getGapClass = (size: number) => {
  if (size <= 4) return "gap-4";
  if (size <= 6) return "gap-3";
  if (size <= 9) return "gap-2";
  return "gap-1";
};
