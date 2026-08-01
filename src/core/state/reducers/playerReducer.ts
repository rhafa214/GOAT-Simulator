import { GameState, GameAction, TechnicalStat } from '../../../types';

export function playerReducer(state: GameState["player"], action: GameAction): GameState["player"] {
  switch (action.type) {
    case 'INITIALIZE_PLAYER':
      return { ...state, ...action.payload };
    case 'SET_TRAINING_PLAN': {
      return {
        ...state,
        trainingPlan: action.payload
      };
    }
    default:
      return state;
  }
}
