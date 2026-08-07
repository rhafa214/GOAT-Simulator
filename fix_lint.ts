import fs from 'fs';

// 1. Fix progressionEngine.ts
let prog = fs.readFileSync('src/core/domain/progressionEngine.ts', 'utf-8');
if (!prog.includes("import { GrowthProfile } from '../../types';") && !prog.includes("GrowthProfile") || prog.includes("GrowthProfile")) {
  prog = prog.replace("import { IRNG } from '../../utils/rng';", "import { IRNG } from '../../utils/rng';\nimport { GrowthProfile } from '../../types';");
  fs.writeFileSync('src/core/domain/progressionEngine.ts', prog);
}

// 2. Fix potentialSystem.ts
let pot = fs.readFileSync('src/core/domain/potentialSystem.ts', 'utf-8');
pot = pot.replace("d.rarity === 'GOAT' ? 40 : d.rarity === 'LEGENDARY'", "d.rarity === 'LEGENDARY' ? 40 : d.rarity === 'LEGENDARY'"); // GOAT rarity doesn't exist, epic is next
fs.writeFileSync('src/core/domain/potentialSystem.ts', pot);

// 3. Fix idols.ts
let idols = fs.readFileSync('src/data/idols.ts', 'utf-8');
idols = idols.replace("name: 'Franz Beckenbauer',\n    positionOrEra:", "name: 'Franz Beckenbauer',\n    nationality: 'Alemanha',\n    positionOrEra:");
fs.writeFileSync('src/data/idols.ts', idols);
console.log('fixed');
