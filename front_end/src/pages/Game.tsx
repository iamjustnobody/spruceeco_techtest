import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateEmptyBoard,
  getGapClass,
  checkWinner,
  checkWinnerWinningPath,
  type CheckWinnerPathOutcome,
} from "../lib/gameUtil";
import GameBoard from "../components/gameboard/GameBoard";
import { PlayerDropdown, PlayerPanel } from "../components/player";
// import type { Player } from "@/types";
import { usePlayerContext } from "@/context/player/playerContext";
import { maxBoardSize, stepsToWinOptions } from "@/common/constants";
import { useToast } from "@/hooks/useToast";
// import clsx from "clsx";
// import { APP_ROUTES, ROUTE_PATHS } from "@/routes";
import { ROUTE_PATHS } from "@/routes/router";
import { useRoutes } from "@/hooks/useRoutes";
import { APIs, config } from "@/config";
import { saveMatch } from "@/services/matchService";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [boardSize, setBoardSize] = useState(3);
  const [marksToWin, setMarksToWin] = useState(3);
  const [board, setBoard] = useState(generateEmptyBoard(3));

  const [winner, setWinner] = useState<null | number>(null);
  const [whoStartsFirst, setWhoStartsFirst] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(whoStartsFirst);
  const [gameStatus, setGameStatus] = useState<"ON" | "OFF">("OFF");

  const [winnerWinningPath, setWinnerWinningPath] =
    useState<CheckWinnerPathOutcome>(null);

  const { state, dispatch: setPlayers } = usePlayerContext();
  const players = state.players;

  const hasMounted = useRef(false);
  const routes = useRoutes();
  useEffect(() => {
    if (players.length < 2) {
      // navigate("/"); // redirect if no player set
      navigate(routes.HOME);
    }
  }, [players]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    setBoard(generateEmptyBoard(boardSize));
    // restart(false);
    restart(gameStatus === "OFF" ? true : false);
    // clearCurrentAccumScores();
  }, [boardSize, marksToWin]);

  const restart = (alternate: boolean) => {
    if (alternate) {
      setCurrentPlayer(1 - whoStartsFirst);
      setWhoStartsFirst((prev) => (prev === 0 ? 1 : 0));
    } else {
      setCurrentPlayer(whoStartsFirst);
    }
    if (winner != null) setWinner(null);
    setWinnerWinningPath(null);
    // setGameStatus("OFF");
    setGameStatus("ON");
  };

  const clearCurrentAccumScores = () => {
    setPlayers({ type: "CLEAR_SCORES" });
  };

  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setBoardSize(newSize);
  };

  const handleMarksToWinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMarksToWin(parseInt(e.target.value));
    // setBoard(generateEmptyBoard(boardSize));
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || winner !== null) return;

    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    //method 1
    // const result = checkWinner(newBoard, marksToWin);
    // const winnerIndex: number = result !== null ? result : -1;
    //method 2
    const result = checkWinnerWinningPath(newBoard, marksToWin);
    const winnerIndex: number = result !== null ? result.winningPlayer : -1;

    const matchFinished =
      result !== null || newBoard.flat().every((cell) => cell !== null);

    if (result !== null) {
      setWinner(winnerIndex);
      setWinnerWinningPath({ winningPlayer: winnerIndex, path: result.path });
      setGameResultAfterCellClick("game_finished", winnerIndex);
    } else if (newBoard.flat().every((cell) => cell !== null)) {
      setWinner(-1);
      setWinnerWinningPath({ winningPlayer: -1, path: [] });
      setGameResultAfterCellClick("draw", null);
    } else {
      setGameResultAfterCellClick("ongoing", null);
    }

    if (matchFinished && config.enableLocalHostApiCalls) {
      handleSaveMatch_Api(winnerIndex != null ? winnerIndex : null);
    }
  };
  const setGameResultAfterCellClick = (
    stageOfGame: "game_finished" | "draw" | "ongoing",
    winnerIndex: number | null
  ) => {
    if (stageOfGame === "game_finished") {
      // setPlayers({ type: "INCREMENT_WIN", index: winnerIndex });
      // setPlayers({ type: "INCREMENT_LOSE", index: winnerIndex === 0 ? 1 : 0 });
      setPlayers({ type: "FINISH_MATCH", payload: { winnerIndex } });
      if (gameStatus === "ON") setGameStatus("OFF");
      return;
    } else if (stageOfGame === "draw") {
      // setPlayers({ type: "INCREMENT_EVEN" });
      setPlayers({ type: "FINISH_MATCH", payload: { winnerIndex: null } });
      if (gameStatus === "ON") setGameStatus("OFF");
      return;
    } else {
      setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
      if (gameStatus === "OFF") setGameStatus("ON");
    }
    return;
  };

  const handleSaveMatch_Api = async (winnerResult: number | null) => {
    try {
      const input = {
        player_x: players[0].username,
        player_o: players[1].username,
        board_size: boardSize,
        win_condition: marksToWin,
        winner:
          winnerResult === null || winnerResult === -1
            ? null
            : players[winnerResult].username === players[0].username
            ? "X"
            : "O",
      };

      const res = await saveMatch(input);
      console.log("Match saved successfully:", res);
    } catch (err) {
      console.error("Error saving match:", err);
      toast("Failed to save match. Please try again later.", "error");
    }
  };

  const gapClass = getGapClass(boardSize);

  // const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   setVisible(true);
  // }, []);

  // const [showToast, setShowToast] = useState(false);

  // useEffect(() => {
  //   if (winner !== null) {
  //     setShowToast(true);
  //     const timer = setTimeout(() => setShowToast(false), 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [winner]);

  const toast = useToast();

  useEffect(() => {
    if (winner !== null) {
      if (winner === -1) {
        toast("It's a draw!", "info", {
          className: "animate-fadeInPos",
        });
      } else {
        toast(`🎉 Congrats ${players[winner].username} wins!`, "success", {
          className: "animate-pop",
        });
      }
    }
  }, [winner]);

  return (
    <div className="min-h-screen p-4 bg-dark text-white flex flex-col">
      <div className="w-full flex justify-start">
        <button
          className="text-sm text-white hover:underline bg-transparent border-0"
          // onClick={() => navigate("/")}
          onClick={() => navigate(ROUTE_PATHS.HOME)}
        >
          ← Back
        </button>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-center items-center my-4 gap-4">
        <label>
          <span className="mr-1">Board Size:</span>
          <select
            className="bg-gray-800 text-white p-1 rounded"
            value={boardSize}
            onChange={handleBoardSizeChange}
          >
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
            {stepsToWinOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* <div className="w-full flex justify-center items-start md:gap-6 gap-2">
       
        <div
          className={`p-4 rounded-md border min-w-[150px] ${
            currentPlayer === 0
              ? "ring-2 ring-yellow-400 animate-pulse"
              : "border-gray-600"
          }`}
        >
          <h2 className="text-lg font-semibold">{players[0].username}</h2>
          <div className={`text-2xl ${players[0].color}`}>
            {players[0].shape}
          </div>
          <p className="text-sm text-gray-400">Wins: {players[0].score.wins}</p>
          <p className="text-sm text-gray-400">Even: {players[0].score.even}</p>
          <p className="text-sm text-gray-400">Lose: {players[0].score.lose}</p>
        </div>

      
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

      
        <div
          className={`p-4 rounded-md border min-w-[150px] ${
            currentPlayer === 1
              ? "ring-2 ring-yellow-400 animate-pulse"
              : "border-gray-600"
          }`}
        >
          <h2 className="text-lg font-semibold">{players[1].username}</h2>
          <div className={`text-2xl ${players[1].color}`}>
            {players[1].shape}
          </div>
          <p className="text-sm text-gray-400">Wins: {players[1].score.wins}</p>
          <p className="text-sm text-gray-400">Even: {players[1].score.even}</p>
          <p className="text-sm text-gray-400">Lose: {players[1].score.lose}</p>
        </div>
      </div> */}

      <div className="w-full flex flex-col md:flex-row justify-center items-start md:gap-6 gap-4 px-2">
        <div className="md:block hidden">
          <PlayerPanel player={players[0]} isActive={currentPlayer === 0} />
        </div>
        <div className="md:hidden flex justify-around w-full">
          <PlayerPanel player={players[0]} isActive={currentPlayer === 0} />
          <PlayerPanel player={players[1]} isActive={currentPlayer === 1} />
        </div>

        <div className="w-full md:w-auto flex justify-center">
          <GameBoard
            board={board}
            boardSize={boardSize}
            players={players}
            handleCellClick={handleCellClick}
            gapClass={gapClass}
            winningPath={winnerWinningPath?.path}
          />
        </div>

        <div className="md:block hidden">
          <PlayerPanel player={players[1]} isActive={currentPlayer === 1} />
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => {
            setBoard(generateEmptyBoard(boardSize));
            // setWinner(null);
            restart(gameStatus === "OFF");
          }}
        >
          Restart
        </button>

        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          onClick={clearCurrentAccumScores}
        >
          Clear
        </button>
      </div>

      {/* {showToast && winner !== null && (
        <div //className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-4 rounded shadow-lg transition-opacity duration-500 animate-fadeInPos"
          className={clsx(
            "fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg transition-all duration-300",
            visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
          )}
        >
          {winner === -1
            ? "It's a draw!"
            : `🎉 Congrats ${players[winner].username} wins!`}
        </div>
      )} */}
    </div>
  );
};

export default GamePage;
