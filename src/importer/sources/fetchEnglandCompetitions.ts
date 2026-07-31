import fs from 'fs';
import path from 'path';

const COMPS = [
  { id: 'comp_eng_premier_league', name: 'Premier League', level: 1 },
  { id: 'comp_eng_championship', name: 'Championship', level: 2 },
  { id: 'comp_eng_league_1', name: 'League One', level: 3 },
  { id: 'comp_eng_league_2', name: 'League Two', level: 4 },
  { id: 'comp_eng_national_league', name: 'National League', level: 5 }
];

const OUTPUT_FILE = path.join(process.cwd(), 'data', 'raw', 'openfootball_competitions_england.json');

async function generateEnglandComps() {
  console.log(`Gerando hierarquia de competições da Inglaterra...`);
  
  const results = COMPS.map(c => ({
    external_id: c.id,
    name: c.name,
    country: "Inglaterra",
    level: c.level,
    type: "LEAGUE"
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Competições salvas em: ${OUTPUT_FILE}`);
}

generateEnglandComps();
