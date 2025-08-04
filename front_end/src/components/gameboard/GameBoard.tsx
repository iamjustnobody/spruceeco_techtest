import type { Player } from "@/types";
import clsx from "clsx";
import React from "react";

interface PlayerStyle {
  shape: string;
  color: string;
}

interface GameBoardProps {
  board: (number | null)[][];
  boardSize: number;
  players: Player[];
  handleCellClick: (row: number, col: number) => void;
  gapClass: string;
  winningPath?: [number, number][];
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  boardSize,
  players,
  handleCellClick,
  gapClass,
  winningPath,
}) => {
  return (
    <div
      className={`grid ${gapClass}`}
      style={{
        gridTemplateColumns: `repeat(${boardSize}, minmax(1.5rem, 1fr))`,
        width: boardSize > 11 ? "min(95vw, 45rem)" : "min(90vw, 35rem)",
      }}
    >
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isWinningCell =
            winningPath?.some(([r, c]) => r === rowIdx && c === colIdx) ??
            false;

          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleCellClick(rowIdx, colIdx)}
              className={clsx(
                "aspect-square flex items-center justify-center rounded-md border border-gray-600 transition-opacity duration-200 cursor-pointer",
                cell === null ? "hover:opacity-60" : "",
                cell !== null ? players[cell].color : "",
                isWinningCell
                  ? "animate-bounce scale-110 ring-2 ring-yellow-400"
                  : ""
              )}
            >
              <span className="text-lg sm:text-xl md:text-2xl font-bold">
                {cell !== null ? players[cell].shape : ""}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameBoard;
