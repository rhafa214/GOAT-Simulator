import fs from 'fs';
let content = fs.readFileSync('src/core/state/reducers/advanceWeek.ts', 'utf8');

const importStatement = `import { PlayerProgressionEngine, ProgressionParams } from '../../domain/progressionEngine';\n`;
if (!content.includes('PlayerProgressionEngine')) {
  content = importStatement + content;
}

const progressionBlock = `
    // --- Progression Engine ---
    if (!newPlayer.progression) {
      newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }
    
    const progParams: ProgressionParams = {
      age: newPlayer.age,
      position: newPlayer.position || '',
      personality: newPlayer.personality || '',
      dna: newPlayer.dna || [],
      minutesPlayed: matchLog ? matchLog.minutesPlayed : 0,
      matchRating: matchLog ? matchLog.rating : 0,
      trainingFocus: 'GENERAL',
      trainingLoad: 50,
      isInjured: matchLog ? matchLog.injured : false,
      injurySeverity: (matchLog && matchLog.injured) ? rng.integer(1, 100) : undefined,
      clubFacilitiesLevel: state.career.currentClub ? (6 - state.career.currentClub.tier) * 20 : 50,
      coachQuality: state.career.currentClub ? (6 - state.career.currentClub.tier) * 20 : 50
    };

    const progResult = PlayerProgressionEngine.processWeek(
      newPlayer.technical,
      newPlayer.progression,
      progParams,
      rng
    );
    
    newPlayer.technical = progResult.technical;
    newPlayer.progression = progResult.progression;
    // --- End Progression Engine ---
`;

// Insert after `if (matchLog.wasCaptain) nextSeasonStats.captaincies++;`
content = content.replace(
  'if (matchLog.wasCaptain) nextSeasonStats.captaincies++;',
  'if (matchLog.wasCaptain) nextSeasonStats.captaincies++;\n' + progressionBlock
);

// We also need to process progression if there's no match (e.g. resting/training)
const elseProgressionBlock = `
  } else {
    // --- Progression Engine (No Match) ---
    if (!newPlayer.progression) {
       const avgTechnical = Object.values(state.player.technical).reduce((a, b) => a + b, 0) / 17;
       newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }
    const progParams: ProgressionParams = {
      age: newPlayer.age,
      position: newPlayer.position || '',
      personality: newPlayer.personality || '',
      dna: newPlayer.dna || [],
      minutesPlayed: 0,
      matchRating: 0,
      trainingFocus: 'GENERAL',
      trainingLoad: 50,
      isInjured: false,
      clubFacilitiesLevel: state.career.currentClub ? (6 - state.career.currentClub.tier) * 20 : 50,
      coachQuality: state.career.currentClub ? (6 - state.career.currentClub.tier) * 20 : 50
    };
    const progResult = PlayerProgressionEngine.processWeek(
      newPlayer.technical,
      newPlayer.progression,
      progParams,
      rng
    );
    newPlayer.technical = progResult.technical;
    newPlayer.progression = progResult.progression;
    // --- End Progression Engine ---
  }
`;

content = content.replace(
  'if (currentSeasonState && state.career.nextMatch.fixtureId) {\n         currentSeasonState = registerMatchResult(currentSeasonState, state.career.nextMatch.fixtureId, aggregate.result.homeScore, aggregate.result.awayScore);\n     }\n  }',
  'if (currentSeasonState && state.career.nextMatch.fixtureId) {\n         currentSeasonState = registerMatchResult(currentSeasonState, state.career.nextMatch.fixtureId, aggregate.result.homeScore, aggregate.result.awayScore);\n     }\n  }' + elseProgressionBlock
);

fs.writeFileSync('src/core/state/reducers/advanceWeek.ts', content);
