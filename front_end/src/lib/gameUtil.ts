export type Cell = {
  row: number;
  col: number;
  player: number | null;
};

export type CheckWinnerPathOutcome = {
  winningPlayer: number;
  path: [number, number][];
} | null;

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

export function checkWinnerWinningPath(
  board: (number | null)[][],
  marksToWin: number
): CheckWinnerPathOutcome | null {
  const size = board.length;
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [1, 1], // down-right
    [1, -1], // down-left
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const player = board[r][c];
      if (player === null) continue;

      for (const [dr, dc] of directions) {
        const path: [number, number][] = [[r, c]];
        let i = 1;
        while (i < marksToWin && board[r + dr * i]?.[c + dc * i] === player) {
          path.push([r + dr * i, c + dc * i]);
          i++;
        }

        if (path.length === marksToWin) {
          return { winningPlayer: player, path };
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
