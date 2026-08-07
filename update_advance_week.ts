import fs from 'fs';

let content = fs.readFileSync('src/core/state/reducers/advanceWeek.ts', 'utf-8');

// Replace initializeProgression calls in advanceWeek.ts
content = content.replace(/PlayerProgressionEngine\.initializeProgression\(rng,\s*80\s*\+\s*Math\.floor\(avgTechnical\s*\/\s*5\)\)/g,
  "PlayerProgressionEngine.initializeProgression(rng, Math.min(99, 80 + Math.floor(avgTechnical / 5) + rng.integer(-5, 5)))");

fs.writeFileSync('src/core/state/reducers/advanceWeek.ts', content);
console.log('advanceWeek updated');
