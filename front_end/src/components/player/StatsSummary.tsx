import type { StatsSummary } from "@/types";
import React from "react";

type Props = {
  stats: StatsSummary[] | null;
};

export default function PlayerStatsResult({ stats }: Props) {
  if (!stats) return null;
  if (stats.length === 0)
    return <div className="text-gray-400 mt-4">No stats found.</div>;

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <table className="w-full border border-gray-700 text-sm text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="border px-3 py-2">Username</th>
            <th className="border px-3 py-2">Wins</th>
            <th className="border px-3 py-2">Losses</th>
            <th className="border px-3 py-2">Draws</th>
          </tr>
        </thead>
        <tbody>
          {stats?.map((s) => (
            <tr key={s.username} className="text-center">
              <td className="border px-3 py-2">{s.username}</td>
              <td className="border px-3 py-2">{s.wins}</td>
              <td className="border px-3 py-2">{s.losses}</td>
              <td className="border px-3 py-2">{s.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
