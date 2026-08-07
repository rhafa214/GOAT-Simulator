import { DraftEngine } from './src/core/domain/draftEngine';

const engine = new DraftEngine();

let hasDuplicates = false;
let rng = 0;
for (let i = 0; i < 1000; i++) {
  let state = engine.initializeDraft('COMPLETE');
  const seenCards = new Set<string>();
  
  while (!engine.isComplete(state)) {
    const round = state.rounds[state.currentRoundIndex];
    
    for (const opt of round.options) {
      if (seenCards.has(opt.idolId)) {
        console.log(`Draft ${i}, Round ${state.currentRoundIndex}: duplicate found: ${opt.idolId}`);
        hasDuplicates = true;
      }
    }
    
    const pickIndex = (i + rng) % round.options.length;
    rng++;
    const chosen = round.options[pickIndex];
    seenCards.add(chosen.idolId);
    
    state = engine.selectOption(state, chosen.idolId);
  }
}
console.log('hasDuplicates:', hasDuplicates);
