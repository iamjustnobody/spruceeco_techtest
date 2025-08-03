import { defaultColors, defaultShapes } from "@/common/constants";
import { usePlayerContext } from "@/context/player/playerContext";
import { useRoutes } from "@/hooks/useRoutes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const routes = useRoutes();

  const { dispatch } = usePlayerContext();

  const handleStart = () => {
    if (!player1 || !player2) {
      setError("Both usernames are required.");
      return;
    }

    if (player1.trim() === player2.trim()) {
      setError("Usernames must be unique.");
      return;
    }

    dispatch({
      type: "SET_PLAYERS",
      payload: [
        {
          username: player1.trim(),
          color: defaultColors[0],
          shape: defaultShapes[0],
          score: { wins: 0, even: 0, lose: 0 },
        },
        {
          username: player2.trim(),
          color: defaultColors[1],
          shape: defaultShapes[1],
          score: { wins: 0, even: 0, lose: 0 },
        },
      ],
    });

    // navigate("/game");
    navigate(routes.GAME, {
      state: { players: [player1.trim(), player2.trim()] },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Tic Tac Toe</h1>

      <input
        className="mb-4 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 w-full max-w-sm"
        placeholder="Enter Player 1 Username"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />

      <input
        className="mb-4 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 w-full max-w-sm"
        placeholder="Enter Player 2 Username"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
      />

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded disabled:opacity-50"
        onClick={handleStart}
      >
        Start
      </button>
    </div>
  );
};

export default Home;
