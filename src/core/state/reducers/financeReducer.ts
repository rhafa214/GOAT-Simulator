import { GameState, GameAction } from '../../../types';

export function financeReducer(state: GameState["finances"], action: GameAction): GameState["finances"] {
  switch (action.type) {
    case 'SETUP_CAREER':
      return { ...state, weeklyWage: action.payload.club.baseSalary };
    default:
      return state;
  }
}
