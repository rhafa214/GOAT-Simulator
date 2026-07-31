import { GameState, GameAction } from '../../../types';

export function flowReducer(state: GameState['phase'], action: GameAction): GameState['phase'] {
  switch (action.type) {
    case 'CHANGE_PHASE':
      return action.payload;
    case 'SETUP_CAREER':
      return 'HUB';
    default:
      return state;
  }
}
