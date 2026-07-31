import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://raw.githubusercontent.com/openfootball/clubs/master/south-america/brazil/br.clubs.txt';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'raw', 'openfootball_clubs_brazil.json');

async function fetchAndParseOpenFootball() {
  console.log(`Baixando dados do OpenFootball: ${TARGET_URL}`);
  
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) throw new Error(`Falha no download: ${response.statusText}`);
    
    const text = await response.text();
    const lines = text.split('\n').map(l => l.trim());
    
    const clubs = [];
    
    for (const line of lines) {
      if (!line || line.startsWith('=') || line.startsWith('#')) continue;
      
      const parts = line.split('|').map(p => p.trim());
      const mainPart = parts[0];
      const mainSplit = mainPart.split(',');
      
      const shortName = mainSplit[0]?.trim();
      const city = mainSplit[1]?.trim() || null;
      
      // O último elemento depois dos pipes é geralmente o nome oficial no OpenFootball
      const officialName = parts.length > 1 ? parts[parts.length - 1] : shortName;
      
      if (shortName) {
         clubs.push({
           external_id: `of_br_${shortName.replace(/\s+/g, '').toLowerCase()}`,
           name: officialName,
           short_name: shortName,
           city: city,
           country: "Brasil"
         });
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(clubs, null, 2));
    console.log(`Total de clubes extraídos: ${clubs.length}`);

  } catch (error) {
    console.error('Erro na extração OpenFootball:', error);
  }
}

fetchAndParseOpenFootball();
