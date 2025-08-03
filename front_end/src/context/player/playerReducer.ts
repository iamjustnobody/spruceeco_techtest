import type { PlayerAction, PlayerState } from "./playerTypes";

export const initialPlayerState: PlayerState = {
  players: [],
};

export const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case "SET_PLAYERS":
      return { ...state, players: action.payload };

    case "INCREMENT_WIN":
      return {
        ...state,
        players: state.players.map((p, idx) =>
          idx === action.index
            ? { ...p, score: { ...p.score, wins: p.score.wins + 1 } }
            : p
        ),
      };

    case "INCREMENT_LOSE":
      return {
        ...state,
        players: state.players.map((p, idx) =>
          idx === action.index
            ? { ...p, score: { ...p.score, lose: p.score.lose + 1 } }
            : p
        ),
      };

    case "INCREMENT_EVEN":
      return {
        ...state,
        players: state.players.map((p) => ({
          ...p,
          score: { ...p.score, even: p.score.even + 1 },
        })),
      };

    case "FINISH_MATCH":
      const { winnerIndex } = action.payload;

      if (winnerIndex === null) {
        // Draw
        return {
          ...state,
          players: state.players.map((p) => ({
            ...p,
            score: { ...p.score, even: p.score.even + 1 },
          })),
        };
      } else {
        // Win/Lose
        return {
          ...state,
          players: state.players.map((p, idx) =>
            idx === winnerIndex
              ? { ...p, score: { ...p.score, wins: p.score.wins + 1 } }
              : { ...p, score: { ...p.score, lose: p.score.lose + 1 } }
          ),
        };
      }

    case "CLEAR_SCORES":
      return {
        ...state,
        players: state.players.map((p) => ({
          ...p,
          score: { ...p.score, even: 0, wins: 0, lose: 0 },
        })),
      };

    default:
      return state;
  }
};
