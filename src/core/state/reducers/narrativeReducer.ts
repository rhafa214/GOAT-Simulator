import { GameState, GameAction } from '../../../types';

export function narrativeReducer(state: GameState["narrative"], action: GameAction): GameState["narrative"] {
  switch (action.type) {
    case 'ADD_NEWS':
      return {
        ...state,
        news: [{ id: Date.now().toString(), ...action.payload }, ...state.news]
      };
    default:
      return state;
  }
}
