import fs from 'fs';
import path from 'path';

// Copia o arquivo openfootball_clubs_brazil.json para rodar na nossa pipeline de validação
const rawFile = path.join(process.cwd(), 'data', 'raw', 'openfootball_clubs_brazil.json');
const clubs = JSON.parse(fs.readFileSync(rawFile, 'utf-8'));

// Simula rodando a importação do run.ts
import { validateClubs } from './src/importer/validators/clubValidator';

const { valid, invalid, warnings } = validateClubs(clubs);
console.log(`Total Bruto OpenFootball: ${clubs.length}`);
console.log(`Válidos: ${valid.length}, Inválidos: ${invalid.length}, Warnings: ${warnings.length}`);

// Salva Clean
fs.writeFileSync(path.join(process.cwd(), 'data', 'clean', 'openfootball_clubs_brazil_clean.json'), JSON.stringify(valid, null, 2));
