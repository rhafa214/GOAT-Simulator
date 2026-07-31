import { useGameEngine } from './GameEngine';
import { GameState, Club, MatchStats, NewsItem } from '../types';

export function useGameActions() {
  const { dispatch } = useGameEngine();
  
  return {
    setState: (state: GameState) => dispatch({ type: 'SET_STATE', payload: state }),
    advancePhase: (phase: GameState['phase']) => dispatch({ type: 'CHANGE_PHASE', payload: phase }),
    initializePlayer: (data: Partial<GameState['player']>) => dispatch({ type: 'INITIALIZE_PLAYER', payload: data }),
    setDraftLength: (length: 'SHORT' | 'LONG') => dispatch({ type: 'SET_DRAFT_LENGTH', payload: length }),
    setupCareer: (club: Club) => dispatch({ type: 'SETUP_CAREER', payload: { club } }),
    trainAttribute: (attr: 'SHO' | 'PAS' | 'DRI' | 'DEF') => dispatch({ type: 'TRAIN_ATTRIBUTE', payload: attr }),
    advanceWeek: () => dispatch({ type: 'ADVANCE_WEEK' }),
    advanceMonth: () => dispatch({ type: 'ADVANCE_MONTH' }),
    resolveEvent: (eventId: string, optionId: string) => dispatch({ type: 'RESOLVE_EVENT', payload: { eventId, optionId } }),
    addNews: (news: Omit<NewsItem, 'id'>) => dispatch({ type: 'ADD_NEWS', payload: news }),
    playMatch: (stats: MatchStats) => dispatch({ type: 'PLAY_MATCH', payload: stats }),
  };
}
