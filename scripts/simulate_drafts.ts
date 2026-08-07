import { DraftEngine } from '../src/core/domain/draftEngine';
import { DraftMode } from '../src/types';

function runSimulation(mode: DraftMode, count: number) {
  const engine = new DraftEngine();
  const overalls: number[] = [];
  
  for (let i = 0; i < count; i++) {
    let state = engine.initializeDraft(mode, i); // use i as seed for deterministic
    
    // Auto-pick the highest overall option or random?
    // A player might pick the idol with the highest baseVal.
    // We should pick the first option (which is often the highest because they are sorted by weight).
    while (!engine.isComplete(state)) {
      const currentRound = state.rounds[state.currentRoundIndex];
      // Pick the option with highest attributeValue
      let bestOption = currentRound.options[0];
      for (const opt of currentRound.options) {
        if (opt.attributeValue > bestOption.attributeValue) {
          bestOption = opt;
        }
      }
      state = engine.selectOption(state, bestOption.idolId);
    }
    
    const stats = engine.applyToTechnicalStats(state);
    const ovr = engine.calculateEstimatedOverall(stats, 'ST');
    overalls.push(ovr);
  }
  
  overalls.sort((a, b) => a - b);
  
  const min = overalls[0];
  const max = overalls[overalls.length - 1];
  const sum = overalls.reduce((a, b) => a + b, 0);
  const avg = sum / count;
  const p10 = overalls[Math.floor(count * 0.1)];
  const p50 = overalls[Math.floor(count * 0.5)];
  const p90 = overalls[Math.floor(count * 0.9)];
  
  const above67 = overalls.filter(o => o > 67).length;
  const above70 = overalls.filter(o => o > 70).length;
  
  console.log(`\n--- Results for ${mode} Draft (Count: ${count}) ---`);
  console.log(`Min: ${min}`);
  console.log(`Max: ${max}`);
  console.log(`Average: ${avg.toFixed(2)}`);
  console.log(`Median (p50): ${p50}`);
  console.log(`p10: ${p10}`);
  console.log(`p90: ${p90}`);
  console.log(`Above 67: ${above67}`);
  console.log(`Above 70: ${above70}`);
}

runSimulation('QUICK', 1000);
runSimulation('COMPLETE', 1000);
