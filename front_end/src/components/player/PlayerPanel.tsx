import type { Player } from "@/types";
import React from "react";

interface PlayerPanelProps {
  player: Player;
  isActive: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ player, isActive }) => {
  return (
    <div
      className={`p-4 rounded-md border min-w-[150px] ${
        isActive ? "ring-2 ring-yellow-400 animate-pulse" : "border-gray-600"
      }`}
    >
      <h2 className="text-lg font-semibold">{player?.username}</h2>
      <div className={`text-2xl ${player?.color}`}>{player?.shape}</div>
      {/* <p className="text-sm text-gray-400">Wins: {player.score.wins}</p>
      <p className="text-sm text-gray-400">Even: {player.score.even}</p>
      <p className="text-sm text-gray-400">Lose: {player.score.lose}</p> */}
      <div className="text-sm text-gray-400 mt-2 space-y-0.5">
        <p>🏆 Wins: {player?.score?.wins}</p>
        <p>⚖️ Draws: {player?.score?.even}</p>
        <p>❌ Losses: {player?.score?.lose}</p>
      </div>
    </div>
  );
};

export default PlayerPanel;
