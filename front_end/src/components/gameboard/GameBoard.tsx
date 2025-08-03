import type { Player } from "@/types";
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
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  boardSize,
  players,
  handleCellClick,
  gapClass,
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
        row.map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            onClick={() => handleCellClick(rowIdx, colIdx)}
            className={`aspect-square flex items-center justify-center rounded-md border border-gray-600 transition-opacity duration-200 cursor-pointer ${
              cell === null ? "hover:opacity-60" : ""
            } ${cell !== null ? players[cell].color : ""}`}
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold">
              {cell !== null ? players[cell].shape : ""}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GameBoard;
