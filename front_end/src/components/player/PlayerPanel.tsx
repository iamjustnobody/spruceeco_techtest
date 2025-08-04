import type { Player } from "@/types";
import React from "react";
import { useLocation } from "react-router-dom";

interface PlayerPanelProps {
  player: Player;
  isActive: boolean;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ player, isActive }) => {
  const location = useLocation();
  const baseUrl = window.location.origin;
  // const scoresUrl = `${baseUrl}/player/stats/${player?.username}?redirect=${location.pathname}`;
  const scoresUrl = `${baseUrl}/player/stats/${player?.username}`;

  return (
    <div
      className={`p-4 rounded-md border md:min-w-[150px] ${
        isActive ? "ring-2 ring-yellow-400 animate-pulse" : "border-gray-600"
      }`}
    >
      <div className="flex items-center gap-3 md:hidden">
        <h2 className="text-base font-semibold">{player?.username} </h2>
        <div className={`text-xl ${player?.color}`}>{player?.shape}</div>
      </div>
      <h2 className="text-lg font-semibold hidden md:block">
        {player?.username}
      </h2>
      <div className={`text-2xl ${player?.color} hidden md:block`}>
        {player?.shape}
      </div>
      {/* <p className="text-sm text-gray-400">Wins: {player.score.wins}</p>
      <p className="text-sm text-gray-400">Even: {player.score.even}</p>
      <p className="text-sm text-gray-400">Lose: {player.score.lose}</p> */}
      <div className="text-sm text-gray-400 mt-2 space-y-1 md:space-y-0.5">
        <p>🏆 Wins: {player?.score?.wins}</p>
        <p>⚖️ Draws: {player?.score?.even}</p>
        <p>❌ Losses: {player?.score?.lose}</p>
      </div>
      <div className="mt-2 flex justify-end">
        <a
          href={scoresUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-end items-center gap-1 text-yellow-400 hover:text-yellow-300 transition-colors mt-2"
        >
          <span>Past scores</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 transform rotate-30"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 7l-10 10m0-10h10v10"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PlayerPanel;
