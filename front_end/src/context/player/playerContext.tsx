import React, { createContext, useReducer, useContext } from "react";
import { playerReducer, initialPlayerState } from "./playerReducer";
import type { PlayerState, PlayerAction } from "./playerTypes";

interface PlayerContextType {
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayerContext must be used within PlayerProvider");
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(playerReducer, initialPlayerState);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
};
