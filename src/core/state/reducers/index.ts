import { generateInitialPlayerStats } from '../../domain/potentialSystem';
import { GameState, GameAction, TechnicalStat } from '../../../types';
import { playerReducer } from './playerReducer';
import { careerReducer } from './careerReducer';
import { financeReducer } from './financeReducer';
import { narrativeReducer } from './narrativeReducer';
import { flowReducer } from './flowReducer';
import { draftReducer } from './draftReducer';
import { DraftEngine, applyDraftResultToPlayer } from '../../domain/draftEngine';
import { advanceWeekLogic } from './advanceWeek';
import { resolveEventLogic } from './resolveEvent';

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'COMPLETE_DRAFT' && state.draftState) {
    const engine = new DraftEngine();
    const result = engine.getDraftResult(state.draftState);
    
    const newPlayer = applyDraftResultToPlayer(state.player, result, state.draftState.acquiredDNA || []);
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
  
  let nextState = {
    ...state,
    phase: flowReducer(state.phase, action),
    player: playerReducer(state.player, action),
    career: careerReducer(state.career, action),
    finances: financeReducer(state.finances, action),
    narrative: narrativeReducer(state.narrative, action),
    draftLength: action.type === 'SET_DRAFT_LENGTH' ? action.payload : state.draftLength,
    draftState: draftReducer(state.draftState, action)
  };

  if (action.type === 'INITIALIZE_PLAYER' && action.payload.technical && state.draftState) {
    const position = state.player.position || 'ST';
    const seed = state.draftState.seed;
    const dna = action.payload.dna || [];
    const draftPotential = action.payload.potential || {};

    const draftCurrent = action.payload.technical || {};
    const generated = generateInitialPlayerStats(position, seed, draftCurrent, draftPotential, dna);

    nextState.player = {
      ...nextState.player,
      technical: generated.technical,
      potential: generated.potential,
      progression: {
        ...(nextState.player.progression || {}),
        growthProfile: generated.growthProfile,
        developmentPoints: {},
        temporaryForm: 0,
        potential: generated.potentialOverall,
        consistency: 10,
        peakAge: 27,
        declineAge: 32,
        milestones: []
      }
    };
  }

  return nextState;
}

