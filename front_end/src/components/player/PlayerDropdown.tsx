import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import type { Player } from "@/types";

interface PlayerDropdownProps {
  player: Player;
  isActive: boolean;
}

const PlayerDropdown: React.FC<PlayerDropdownProps> = ({
  player,
  isActive,
}) => {
  return (
    <div
      className={`p-4 rounded-md border ${
        isActive ? "ring-2 ring-yellow-400 animate-pulse" : "border-gray-600"
      }`}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold">{player?.username} </h2>
        <div className={`text-xl ${player?.color}`}>{player?.shape}</div>
      </div>
      <div className="mt-2 space-y-1 text-sm text-gray-400">
        <p>🏆 Wins: {player?.score?.wins}</p>
        <p>⚖️ Even: {player?.score?.even}</p>
        <p>❌ Lose: {player?.score?.lose}</p>
      </div>
    </div>
  );

  //   const [open, setOpen] = useState(false);

  //   return (
  //     <div className="w-full max-w-[180px]">
  //       <button
  //         onClick={() => setOpen(!open)}
  //         className={`w-full flex justify-between items-center px-4 py-2 text-left border rounded-md ${
  //           isActive
  //             ? "border-yellow-400 ring-1 ring-yellow-300"
  //             : "border-gray-600"
  //         }`}
  //       >
  //         <span className="flex items-center gap-2">
  //           <span className={`font-bold ${player.color}`}>{player.shape}</span>
  //           {player.username}
  //         </span>
  //         {open ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
  //       </button>

  //       {open && (
  //         <div className="mt-2 p-3 border border-gray-500 rounded-md bg-gray-800 text-sm text-gray-200 shadow-lg animate-fadeIn">
  //           <p className="mb-1">🏆 Wins: {player.score.wins}</p>
  //           <p className="mb-1">⚖️ Draws: {player.score.even}</p>
  //           <p className="mb-1">❌ Losses: {player.score.lose}</p>
  //         </div>
  //       )}
  //     </div>
  //   );
};

export default PlayerDropdown;
