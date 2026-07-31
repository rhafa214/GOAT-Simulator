import fs from 'fs';
import path from 'path';

// URL Exemplo: Premier League 23/24
const TARGET_URL = 'https://www.football-data.co.uk/mmz4281/2324/E0.csv';
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'raw', 'football_data_uk_e0_2324.json');

async function fetchAndParseCSV() {
  console.log(`Baixando dados reais de: ${TARGET_URL}`);
  
  try {
    const response = await fetch(TARGET_URL);
    if (!response.ok) throw new Error(`Falha no download: ${response.statusText}`);
    
    const csvText = await response.text();
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length < 2) {
      console.log('CSV Vazio ou inválido.');
      return;
    }

    const headers = lines[0].split(',');
    const results = [];

    // Lendo as linhas
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        if (header) {
          row[header] = values[index];
        }
      });

      // Validar se tem times (evitar linhas em branco no final do CSV)
      if (row['HomeTeam'] && row['AwayTeam']) {
        results.push({
          date: row['Date'],
          home_team: row['HomeTeam'],
          away_team: row['AwayTeam'],
          home_goals: parseInt(row['FTHG'], 10),
          away_goals: parseInt(row['FTAG'], 10),
          referee: row['Referee'] || null
        });
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`Dados extraídos e salvos em formato Raw (JSON): ${OUTPUT_FILE}`);
    console.log(`Total de partidas importadas: ${results.length}`);

  } catch (error) {
    console.error('Erro na extração:', error);
  }
}

fetchAndParseCSV();
