import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction } from '../types';
import { createInitialGameState } from '../core/state/initialState';
import { gameReducer } from '../core/state/reducers';
import { SaveGameService, LocalStorageSaveRepository } from '../core/domain/saveSystem';
import { Save } from 'lucide-react';

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: createInitialGameState(), dispatch: () => null });


export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialGameState());
  const [showAutosave, setShowAutosave] = React.useState(false);
  const saveService = React.useMemo(() => new SaveGameService(new LocalStorageSaveRepository()), []);
  const lastSavedWeek = React.useRef(state.career?.week);

  React.useEffect(() => {
    // Autosave when week changes, and we have a valid slot
    if (state.saveSlot && state.career && state.career.week !== lastSavedWeek.current) {
      lastSavedWeek.current = state.career.week;
      try {
        saveService.saveGame(state.saveSlot, state);
        setShowAutosave(true);
        setTimeout(() => setShowAutosave(false), 2000);
      } catch (e) {
        console.error("Autosave failed", e);
      }
    }
  }, [state, saveService]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
      {showAutosave && (
        <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 text-zinc-300 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 z-[9999]">
          <Save className="w-3 h-3 animate-pulse text-yellow-500" />
          SALVANDO...
        </div>
      )}
    </GameContext.Provider>
  );
}

export function useGameEngine() {
  return useContext(GameContext);
}
