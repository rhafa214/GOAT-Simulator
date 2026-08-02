import fs from 'fs';

let content = fs.readFileSync('src/core/state/reducers/advanceWeek.ts', 'utf8');

const getTrainingLogic = `
    const plan = newPlayer.trainingPlan || { focus: 'GENERAL', intensity: 'MEDIUM' };
    let trainingLoad = 50;
    let fitnessDrain = 0;
    
    if (plan.intensity === 'LOW') {
      trainingLoad = 25;
      fitnessDrain = 10;
    } else if (plan.intensity === 'MEDIUM') {
      trainingLoad = 50;
      fitnessDrain = 20;
    } else if (plan.intensity === 'HIGH') {
      trainingLoad = 80;
      fitnessDrain = 35;
    }

    if (plan.focus === 'REST') {
      trainingLoad = 0;
      fitnessDrain = -30; // Heals fitness
    } else if (plan.focus === 'RECOVERY') {
      trainingLoad = 10;
      fitnessDrain = -15; // Heals some fitness
    }
    
    // Apply fitness drain
    newPlayer.rpg.fitness = Math.max(0, Math.min(100, newPlayer.rpg.fitness - fitnessDrain));

    // Injury risk from training
    let isInjuredInTraining = false;
    let trainingInjurySeverity = 0;
    if (plan.focus !== 'REST' && plan.focus !== 'RECOVERY' && newPlayer.rpg.fitness < 40) {
      const risk = (40 - newPlayer.rpg.fitness) + (plan.intensity === 'HIGH' ? 20 : 0);
      if (rng.chance(risk / 2)) {
         isInjuredInTraining = true;
         trainingInjurySeverity = rng.integer(10, 50);
      }
    }

    // Chemistry boosts relationships
    if (plan.focus === 'CHEMISTRY') {
       newPlayer.relationships.squad = Math.min(100, newPlayer.relationships.squad + 2);
       newPlayer.rpg.morale = Math.min(100, newPlayer.rpg.morale + 2);
    }
`;

const progParamsMatch = `
      trainingFocus: plan.focus,
      trainingLoad,
      isInjured: matchLog ? matchLog.injured : isInjuredInTraining,
      injurySeverity: (matchLog && matchLog.injured) ? rng.integer(1, 100) : trainingInjurySeverity,
`;

content = content.replace(
  `      trainingFocus: 'GENERAL',
      trainingLoad: 50,
      isInjured: matchLog ? matchLog.injured : false,
      injurySeverity: (matchLog && matchLog.injured) ? rng.integer(1, 100) : undefined,`,
  progParamsMatch
);

const progParamsNoMatch = `
      trainingFocus: plan.focus,
      trainingLoad,
      isInjured: isInjuredInTraining,
      injurySeverity: trainingInjurySeverity,
`;

content = content.replace(
  `      trainingFocus: 'GENERAL',
      trainingLoad: 50,
      isInjured: false,`,
  progParamsNoMatch
);

content = content.replace(
  `    if (!newPlayer.progression) {
      newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }`,
  `    if (!newPlayer.progression) {
      newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }\n` + getTrainingLogic
);

content = content.replace(
  `    if (!newPlayer.progression) {
       const avgTechnical = Object.values(state.player.technical).reduce((a, b) => a + b, 0) / 17;
       newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }`,
  `    if (!newPlayer.progression) {
       const avgTechnical = Object.values(state.player.technical).reduce((a, b) => a + b, 0) / 17;
       newPlayer.progression = PlayerProgressionEngine.initializeProgression(rng, 80 + Math.floor(avgTechnical / 5));
    }\n` + getTrainingLogic
);

fs.writeFileSync('src/core/state/reducers/advanceWeek.ts', content);
