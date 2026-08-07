import fs from 'fs';

let pot = fs.readFileSync('src/core/domain/potentialSystem.ts', 'utf-8');
pot = pot.replace("d.rarity === 'LEGENDARY' ? 40 : d.rarity === 'LEGENDARY' ? 30 : d.rarity === 'EPIC' ? 20 : 10", 
                  "d.rarity === 'LEGENDARY' ? 40 : d.rarity === 'EPIC' ? 30 : 10");
fs.writeFileSync('src/core/domain/potentialSystem.ts', pot);
console.log('fixed again');
