import fs from 'fs';
import path from 'path';

const BRAZIL_FILE = path.join(process.cwd(), 'src', 'data', 'imported_brazil.json');

const mapping: Record<string, string> = {
  "Corinthians": "corinthians",
  "Palmeiras": "palmeiras",
  "São Paulo": "sao-paulo",
  "Santos": "santos",
  "Flamengo": "flamengo",
  "Fluminense": "fluminense",
  "Vasco": "vasco",
  "Botafogo": "botafogo",
  "Cruzeiro": "cruzeiro",
  "Atlético MG": "atletico-mg",
  "Grêmio": "gremio",
  "Internacional": "internacional",
  "Bahia": "bahia",
  "Vitória": "vitoria",
  "Athletico": "athletico-pr",
  "Coritiba": "coritiba",
  "Sport": "sport",
  "Fortaleza": "fortaleza",
  "Ceará": "ceara",
  "Goiás": "goias",
  "Atlético GO": "atletico-go"
};

function patchLogos() {
  const data = JSON.parse(fs.readFileSync(BRAZIL_FILE, 'utf-8'));
  for (const club of data) {
    const name = club.official_name;
    const found = Object.keys(mapping).find(k => name.includes(k));
    if (found) {
      club.logo_url = `https://raw.githubusercontent.com/washingtonos/escudos-futebol-api/main/assets/badges-png/${mapping[found]}.png`;
    }
  }
  fs.writeFileSync(BRAZIL_FILE, JSON.stringify(data, null, 2));
  console.log('Brazil logos patched!');
}

patchLogos();
