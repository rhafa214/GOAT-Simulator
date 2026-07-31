import { GameState, GameAction } from '../../../types';

export function playerReducer(state: GameState["player"], action: GameAction): GameState["player"] {
  switch (action.type) {
    case 'INITIALIZE_PLAYER':
      return { ...state, ...action.payload };
    case 'TRAIN_ATTRIBUTE': {
      if (state.rpg.fitness < 20) return state; // Not enough fitness
      
      const newTech = { ...state.technical };
      
      const ageMultiplier = state.age < 23 ? 1.5 : (state.age > 30 ? 0.5 : 1.0);
      const growth = 0.5 * ageMultiplier;
      const secondaryGrowth = 0.2 * ageMultiplier;
      
      switch(action.payload) {
        case 'SHO':
          newTech.SHO = Math.min(99, newTech.SHO + growth);
          newTech.HEA = Math.min(99, newTech.HEA + secondaryGrowth);
          break;
        case 'PAS':
          newTech.PAS = Math.min(99, newTech.PAS + growth);
          newTech.VIS = Math.min(99, newTech.VIS + secondaryGrowth);
          break;
        case 'DRI':
          newTech.DRI = Math.min(99, newTech.DRI + growth);
          newTech.PAC = Math.min(99, newTech.PAC + secondaryGrowth);
          break;
        case 'DEF':
          newTech.DEF = Math.min(99, newTech.DEF + growth);
          newTech.PHY = Math.min(99, newTech.PHY + secondaryGrowth);
          break;
      }
      
      return {
        ...state,
        technical: newTech,
        rpg: {
          ...state.rpg,
          fitness: state.rpg.fitness - 20
        }
      };
    }
    default:
      return state;
  }
}
