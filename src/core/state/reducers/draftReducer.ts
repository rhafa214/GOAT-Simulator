import { GameState, GameAction, DraftState } from '../../../types';
import { DraftEngine } from '../../domain/draftEngine';

export function draftReducer(state: DraftState | undefined, action: GameAction): DraftState | undefined {
  if (action.type === 'INIT_DRAFT') {
    const engine = new DraftEngine(action.payload.seed);
    return engine.initializeDraft(action.payload.mode, action.payload.seed);
  }

  if (!state) return state;

  if (action.type === 'SELECT_DRAFT_OPTION') {
    const engine = new DraftEngine(state.seed);
    return engine.selectOption(state, action.payload);
  }

  if (action.type === 'COMPLETE_DRAFT') {
    return state; // handled in gameReducer to apply stats
  }

  return state;
}
