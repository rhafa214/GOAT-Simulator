import { DraftEngine } from './src/core/domain/draftEngine';

const eng = new DraftEngine(0);
let s = eng.initializeDraft('COMPLETE');
let passed = true;

while (!eng.isComplete(s)) {
  const round = s.rounds[s.currentRoundIndex];
  
  if (round.options.length === 0) {
     console.log("No options!");
     break;
  }
  
  const selectedIdol = round.options[0].idolId;
  
  for (const opt of round.options) {
     if (s.selectedIdolIds.includes(opt.idolId)) {
       console.log(`Round ${s.currentRoundIndex}: selectedIdolIds already contains ${opt.idolId}!`);
       console.log(`selectedIdolIds: ${s.selectedIdolIds}`);
       console.log(`options: ${round.options.map(o => o.idolId)}`);
       passed = false;
       break;
     }
  }
  if (!passed) break;

  s = eng.selectOption(s, selectedIdol);
}
console.log("Passed:", passed);
