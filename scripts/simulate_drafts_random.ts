import { DraftEngine } from '../src/core/domain/draftEngine';
import { DraftMode } from '../src/types';

function runSimulation(mode: DraftMode, count: number) {
  const engine = new DraftEngine();
  const overalls: number[] = [];
  
  for (let i = 0; i < count; i++) {
    let state = engine.initializeDraft(mode, i);
    let rng = 0; // simple predictable rng
    while (!engine.isComplete(state)) {
      const currentRound = state.rounds[state.currentRoundIndex];
      // Pick randomly
      let pickIndex = (i + rng) % currentRound.options.length;
      rng++;
      const pickedOption = currentRound.options[pickIndex];
      state = engine.selectOption(state, pickedOption.idolId);
    }
    
    const stats = engine.applyToTechnicalStats(state);
    const ovr = engine.calculateEstimatedOverall(stats, 'ST');
    overalls.push(ovr);
  }
  
  overalls.sort((a, b) => a - b);
  const min = overalls[0];
  const max = overalls[overalls.length - 1];
  const avg = overalls.reduce((a, b) => a + b, 0) / count;
  console.log(`\n--- Random Pick Results for ${mode} Draft ---`);
  console.log(`Min: ${min} | Max: ${max} | Avg: ${avg.toFixed(2)}`);
}
runSimulation('QUICK', 1000);
runSimulation('COMPLETE', 1000);
