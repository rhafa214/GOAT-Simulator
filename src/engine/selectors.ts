import { useMemo } from 'react';
import { useGameEngine } from './GameEngine';
import { GameState } from '../types';
import { calculatePlayerOverall } from '../core/domain/playerUtils';

export function useGameState(): GameState {
  return useGameEngine().state;
}

export function useGameSelector<T>(selector: (state: GameState) => T): T {
  const state = useGameState();
  return useMemo(() => selector(state), [state, selector]);
}

export function usePlayer() {
  return useGameSelector(state => state.player);
}

export function useCareer() {
  return useGameSelector(state => state.career);
}

export function useCurrentClub() {
  return useGameSelector(state => state.career.currentClub);
}

export function useNextMatch() {
  return useGameSelector(state => state.career.nextMatch);
}

export function useSeasonStats() {
  return useGameSelector(state => state.career.currentSeasonStats);
}

export function useGamePhase() {
  return useGameSelector(state => state.phase);
}

export function useNews() {
  return useGameSelector(state => state.narrative.news);
}

export function useOverall() {
  return useGameSelector(state => {
    return calculatePlayerOverall(state.player.technical || {}, state.player.position);
  });
}

export function useFinances() {
  return useGameSelector(state => state.finances);
}
