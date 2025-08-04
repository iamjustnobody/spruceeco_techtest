import { maxBoardSize, stepsToWinOptions } from "@/common/constants";
import PlayerStatsResult from "@/components/player/StatsSummary";
import { config } from "@/config";
import { useToast } from "@/hooks/useToast";
import { fetchPlayerStats } from "@/services/playerService";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export default function PlayerStats() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [boardSize, setBoardSize] = useState<number | "">(
    Number(searchParams.get("boardSize")) || ""
  );
  const [marksToWin, setMarksToWin] = useState<number | "">(
    Number(searchParams.get("winCondition")) || ""
  );
  const [opponent, setOpponent] = useState<string>(
    searchParams.get("opponent") || ""
  );
  const [PlayerStats, setPlayerStats] = useState<null | any[]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (username) {
  //       handleFetchStats();
  //     }
  //   }, []);
  useEffect(() => {
    const initialQuery: Record<string, string | number> = {};
    const bs = searchParams.get("boardSize");
    const wc = searchParams.get("winCondition");
    const op = searchParams.get("opponent");

    if (bs) {
      setBoardSize(Number(bs));
      initialQuery.boardSize = Number(bs);
    }
    if (wc) {
      setMarksToWin(Number(wc));
      initialQuery.winCondition = Number(wc);
    }
    if (op) {
      setOpponent(op);
      initialQuery.opponent = op;
    }

    if (username && config.enableLocalHostApiCalls) {
      setLoading(true);
      setError(null);
      fetchPlayerStats(username, initialQuery)
        // .then(setPlayerStats)
        .then((stats) => setPlayerStats([stats]))
        .catch(() => setError("Failed to load player stats."))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardSize(Number(e.target.value));
  };

  const handleMarksToWinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMarksToWin(Number(e.target.value));
  };

  const handleOpponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpponent(e.target.value);
  };

  const toast = useToast();
  const handleFetchStats = async () => {
    if (!username) return;

    const query: Record<string, string | number> = {};
    if (boardSize) query.boardSize = boardSize;
    if (marksToWin) query.winCondition = marksToWin;
    if (opponent.trim()) query.opponent = opponent.trim();

    // update URL with query params
    const queryStr = new URLSearchParams(query as any).toString();
    navigate(`/player/stats/${username}${queryStr ? "?" + queryStr : ""}`);

    if (config.enableLocalHostApiCalls)
      getPlayerPastScores_Api(username, query);
  };
  const getPlayerPastScores_Api = async (
    username: string,
    query: Record<string, string | number>
  ) => {
    // setPlayerStats(null);//opt
    try {
      setLoading(true);
      setError(null);

      const stats = await fetchPlayerStats(username, query);
      setPlayerStats(stats);
    } catch (err: any) {
      setError("Failed to load player stats.");
      toast(
        err instanceof Error
          ? typeof (err as any).status !== "undefined" &&
            (err as any).status === 404
            ? `Player '${username}' not found`
            : err.message || "Failed to load player stats."
          : "Failed to load player stats.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{username}</h2>

      <div className="w-full flex flex-col sm:flex-row justify-center items-center my-4 gap-4">
        <label>
          <span className="mr-1">Board Size:</span>
          <select
            className="bg-gray-800 text-white p-1 rounded"
            value={boardSize}
            onChange={handleBoardSizeChange}
          >
            <option value="">Any</option>
            {Array.from({ length: maxBoardSize }, (_, i) => i + 3).map((n) => (
              <option key={n} value={n}>
                {n} x {n}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mr-1">Win Condition:</span>
          <select
            className="bg-gray-800 text-white p-1 rounded"
            value={marksToWin}
            onChange={handleMarksToWinChange}
          >
            <option value="">Any</option>
            {stepsToWinOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mr-1">Opponent:</span>
          <input
            type="text"
            className="bg-gray-800 text-white p-1 rounded"
            value={opponent}
            onChange={handleOpponentChange}
            placeholder="Opponent username"
          />
        </label>

        <button
          onClick={handleFetchStats}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Enter
        </button>
      </div>

      {/* <div className="text-sm text-gray-500 mb-4">
        {boardSize ? `Board Size: ${boardSize} x ${boardSize}` : "Any Board Size"}{" "}
        | {marksToWin ? `Win Condition: ${marksToWin}` : "Any Win Condition"}{" "}
        | {opponent ? `Opponent: ${opponent}` : "Any Opponent"} */}
      {!config.enableLocalHostApiCalls && (
        <p className="text-sm text-gray-500 mb-4">API disabled</p>
      )}
      {loading && config.enableLocalHostApiCalls && (
        <div className="text-center text-gray-300 mt-4">Loading stats...</div>
      )}
      {error && config.enableLocalHostApiCalls && (
        <div className="text-center text-red-500 mt-4">{error}</div>
      )}
      {!loading && !error && config.enableLocalHostApiCalls && (
        <PlayerStatsResult stats={PlayerStats} />
      )}
    </div>
  );
}
