import fs from 'fs';
import path from 'path';

const CLUBS_URL = 'https://raw.githubusercontent.com/openfootball/clubs/master/europe/england/eng.clubs.txt';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'raw', 'openfootball_clubs_england.json');

// Alguns logos do repositório qiulot/clublogos (formato com espaço convertido pra %20 ao usar na URL)
const getLogoUrl = (clubName: string) => {
  // Vamos tentar mapear para o nome exato do arquivo no repo qiulot/clublogos, ou nulo se não soubermos
  // A URL base é: https://raw.githubusercontent.com/qiulot/clublogos/master/
  const mapping: Record<string, string> = {
    "Arsenal": "Arsenal",
    "Chelsea": "Chelsea",
    "Liverpool": "Liverpool",
    "Manchester City": "Manchester City",
    "Manchester United": "Manchester United",
    "Tottenham Hotspur": "Tottenham Hotspur",
    "Everton": "Everton",
    "Newcastle United": "Newcastle United",
    "Aston Villa": "Aston Villa",
    "West Ham United": "West Ham", // verificar se é West Ham.png
    "Leicester City": "Leicester City",
    "Southampton": "Southampton",
    "Crystal Palace": "Crystal Palace",
    "Wolverhampton Wanderers": "Wolverhampton Wanderers", // ou Wolves
    "Leeds United": "Leeds United",
    "Nottingham Forest": "Nottingham Forest",
    "Fulham": "Fulham",
    "Brighton & Hove Albion": "Brighton & Hove Albion",
    "Brentford": "Brentford",
    "Bournemouth": "Bournemouth",
    "Burnley": "Burnley",
    "Sheffield United": "Sheffield United",
    "Luton Town": "Luton Town"
  };

  const exactMatches = Object.keys(mapping);
  const found = exactMatches.find(k => clubName.includes(k));
  
  if (found) {
    return `https://raw.githubusercontent.com/qiulot/clublogos/master/${encodeURIComponent(mapping[found])}.png`;
  }
  return null;
}

async function fetchAndParse() {
  console.log(`Baixando dados da Inglaterra do OpenFootball...`);
  
  try {
    const response = await fetch(CLUBS_URL);
    if (!response.ok) throw new Error(`Falha no download: ${response.statusText}`);
    
    const text = await response.text();
    const lines = text.split('\n').map(l => l.trim());
    
    const clubs = [];
    
    for (const line of lines) {
      if (!line || line.startsWith('=') || line.startsWith('#')) continue;
      
      const parts = line.split('|').map(p => p.trim());
      const mainPart = parts[0]; 
      
      // Remove o comentário no meio, ex: ## Greater London
      const cleanMainPart = mainPart.split('##')[0].trim();
      const mainSplit = cleanMainPart.split(',');
      
      const primaryName = mainSplit[0]?.trim();
      if (!primaryName) continue;

      let foundationYear = null;
      let stadium = null;
      let city = null;

      // Parsing: Arsenal FC, 1886, @ Emirates Stadium, London (Highbury)
      for (let i = 1; i < mainSplit.length; i++) {
         const val = mainSplit[i].trim();
         if (/^\d{4}$/.test(val)) {
            foundationYear = parseInt(val, 10);
         } else if (val.startsWith('@')) {
            stadium = val.substring(1).trim();
         } else if (val.length > 2) {
            if (!city) city = val;
         }
      }

      const shortName = parts.length > 1 ? parts[1].trim() : primaryName;
      // Pegar o último alias como nome oficial ou o próprio primaryName se não tiver alias
      // Alguns tem comments nos aliases (ex: The Arsenal FC # old name). Limpar:
      const rawOfficialName = parts.length > 1 ? parts[parts.length - 1] : primaryName;
      const officialName = rawOfficialName.split('#')[0].trim();

      const logo = getLogoUrl(primaryName);

      clubs.push({
        external_id: `of_eng_${primaryName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
        name: officialName,
        short_name: shortName,
        city: city || "England",
        country: "Inglaterra",
        founded: foundationYear,
        stadium: stadium,
        logo: logo
      });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(clubs, null, 2));
    console.log(`Dados extraídos e salvos em formato Raw (JSON): ${OUTPUT_FILE}`);
    console.log(`Total de clubes ingleses extraídos: ${clubs.length}`);

  } catch (error) {
    console.error('Erro na extração Inglaterra:', error);
  }
}

fetchAndParse();
