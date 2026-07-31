import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction } from '../types';
import { createInitialGameState } from '../core/state/initialState';
import { gameReducer } from '../core/state/reducers';

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: createInitialGameState(), dispatch: () => null });

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameEngine() {
  return useContext(GameContext);
}
