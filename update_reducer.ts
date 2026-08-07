import fs from 'fs';

let content = fs.readFileSync('src/core/state/reducers/index.ts', 'utf-8');

const oldLine = 'const generated = generateInitialPlayerStats(position, seed, draftPotential, dna);';
const newLine = 'const draftCurrent = action.payload.technical || {};\n    const generated = generateInitialPlayerStats(position, seed, draftCurrent, draftPotential, dna);';

if (content.includes(oldLine)) {
  content = content.replace(oldLine, newLine);
  fs.writeFileSync('src/core/state/reducers/index.ts', content);
  console.log('reducer updated');
} else {
  console.log('reducer not found');
}
