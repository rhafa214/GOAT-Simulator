import { GameState, GameAction } from '../../../types';
import { playerReducer } from './playerReducer';
import { careerReducer } from './careerReducer';
import { financeReducer } from './financeReducer';
import { narrativeReducer } from './narrativeReducer';
import { flowReducer } from './flowReducer';
import { draftReducer } from './draftReducer';
import { DraftEngine } from '../../domain/draftEngine';
import { advanceWeekLogic } from './advanceWeek';
import { resolveEventLogic } from './resolveEvent';

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'COMPLETE_DRAFT' && state.draftState) {
    const engine = new DraftEngine();
    const stats = engine.applyToTechnicalStats(state.draftState);
    const newPlayer = { ...state.player };
    newPlayer.technical = { ...newPlayer.technical, ...stats };
    if (state.draftState.acquiredDNA && state.draftState.acquiredDNA.length > 0) {
      newPlayer.dna = [...(newPlayer.dna || []), ...state.draftState.acquiredDNA];
    }
    return { ...state, player: newPlayer, phase: 'MAIN_MENU' };
  }
  if (action.type === 'SET_STATE') {
    return action.payload;
  }
  // Cross-cutting actions
  if (action.type === 'ADVANCE_WEEK') {
    return advanceWeekLogic(state);
  }
  
  if (action.type === 'ADVANCE_MONTH') {
    let currentState = state;
    for (let i = 0; i < 4; i++) {
       currentState = advanceWeekLogic(currentState);
       if (currentState.phase === 'EVENT' || currentState.phase === 'POST_MATCH') {
          break;
       }
    }
    return currentState;
  }
  
  if (action.type === 'RESOLVE_EVENT') {
    return resolveEventLogic(state, action.payload);
  }

  // Slice actions
  return {
    ...state,
    phase: flowReducer(state.phase, action),
    player: playerReducer(state.player, action),
    career: careerReducer(state.career, action),
    finances: financeReducer(state.finances, action),
    narrative: narrativeReducer(state.narrative, action),
    // Draft length uses flowReducer but let's handle it manually to avoid duplicate states if needed
    draftLength: action.type === 'SET_DRAFT_LENGTH' ? action.payload : state.draftLength,
    draftState: draftReducer(state.draftState, action)
  };
}
