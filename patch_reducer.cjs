const fs = require('fs');
const path = './src/core/state/reducers/index.ts';
let code = fs.readFileSync(path, 'utf8');

const importStr = "import { generateInitialPlayerStats } from '../../domain/potentialSystem';\n";
code = importStr + code;

const interceptStr = `
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

    const generated = generateInitialPlayerStats(position, seed, draftPotential, dna);

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
`;

code = code.replace(/return \{\s*\.\.\.state,\s*phase: flowReducer[\s\S]*draftState: draftReducer\(state.draftState, action\)\s*\};\s*\}/, interceptStr);

fs.writeFileSync(path, code);
