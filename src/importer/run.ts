import fs from 'fs';
import path from 'path';
import { validateClubs, RawClub } from './validators/clubValidator';

const RAW_DATA_PATH = path.join(process.cwd(), 'data', 'raw');
const CLEAN_DATA_PATH = path.join(process.cwd(), 'data', 'clean');
const LOGS_PATH = path.join(process.cwd(), 'data', 'logs');

// Certifica que as pastas existem
[RAW_DATA_PATH, CLEAN_DATA_PATH, LOGS_PATH].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function runImporter() {
  console.log('Iniciando o Pipeline de Importação Strict Mode...');

  // 1. Procurar arquivos brutos (Extract Simulation)
  const files = fs.readdirSync(RAW_DATA_PATH).filter(f => f.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('Nenhum arquivo bruto encontrado em /data/raw. Por favor, adicione um arquivo JSON extraído de uma base oficial (ex: clubs_brazil.json).');
    return;
  }

  for (const file of files) {
    console.log(`\nProcessando arquivo: ${file}`);
    
    try {
      const rawContent = fs.readFileSync(path.join(RAW_DATA_PATH, file), 'utf-8');
      const rawData: RawClub[] = JSON.parse(rawContent);

      // 2. Transform e Validação
      const { valid, invalid, warnings } = validateClubs(rawData);

      console.log(`Total de registros brutos: ${rawData.length}`);
      console.log(`Registros válidos: ${valid.length}`);
      console.log(`Registros inválidos (ignorados): ${invalid.length}`);
      console.log(`Avisos (Warnings): ${warnings.length}`);

      // 3. Gerar Logs de Erro e Warnings
      const logFilename = `${file.replace('.json', '')}_import_log_${Date.now()}.json`;
      fs.writeFileSync(
        path.join(LOGS_PATH, logFilename),
        JSON.stringify({ invalid, warnings }, null, 2)
      );
      console.log(`Log de erros/avisos salvo em /data/logs/${logFilename}`);

      // 4. Salvar os dados Limpos (Load)
      const cleanFilename = file.replace('.json', '_clean.json');
      fs.writeFileSync(
        path.join(CLEAN_DATA_PATH, cleanFilename),
        JSON.stringify(valid, null, 2)
      );
      console.log(`Dados válidos e seguros salvos em /data/clean/${cleanFilename}`);

    } catch (e) {
       console.error(`Erro ao processar o arquivo ${file}:`, e);
    }
  }

  console.log('\nPipeline de Importação finalizado.');
}

runImporter();
