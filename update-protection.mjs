import fs from 'fs';

// 1. Update AGENTS.md
const agentsPath = 'AGENTS.md';
let agentsContent = fs.readFileSync(agentsPath, 'utf8');
const protectionRules = `\n\n## PROTECTED BINARY ASSETS
- arquivos .glb, .gltf, .fbx, .blend, .png, .jpg, .jpeg, .webp, .mp3, .wav, .mp4 e .zip são somente leitura para agentes de IA;
- nunca editar, recriar, converter, reserializar, mover ou excluir esses arquivos;
- nunca gerar conteúdo textual e salvá-lo com extensão binária;
- nunca usar scripts para sobrescrever assets;
- qualquer alteração exige autorização explícita do proprietário;
- o agente pode apenas ler metadados, caminhos, tamanho e hash;
- alterações em manifest.json continuam permitidas, mas o binário não.\n`;
if (!agentsContent.includes('PROTECTED BINARY ASSETS')) {
  agentsContent += protectionRules;
  fs.writeFileSync(agentsPath, agentsContent);
}

// 2. Create .gitattributes
const gitAttributesContent = `*.glb binary
*.gltf binary
*.fbx binary
*.blend binary
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.mp3 binary
*.wav binary
*.mp4 binary
*.zip binary\n`;
fs.writeFileSync('.gitattributes', gitAttributesContent);

// 3. Create protected-assets.json
const protectedAssets = {
  version: "1.0.0",
  assets: [
    {
      path: "public/models/avatar/goat_base_human_v2.glb",
      readOnly: true,
      description: "GOAT Base Human v2 validated production avatar",
      expectedSize: 1279988,
      expectedMagic: "glTF",
      expectedHash: "fa98c638bc217100d9514db14fd96b77d69226ea678b0ea499b9b53eeb64ef2b"
    }
  ]
};
fs.writeFileSync('protected-assets.json', JSON.stringify(protectedAssets, null, 2));

// 4. Create scripts/check-protected-assets.mjs
const checkScriptContent = `import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const configPath = path.resolve('protected-assets.json');
if (!fs.existsSync(configPath)) {
  console.error(\`Configuration file not found: \${configPath}\`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let hasError = false;

for (const asset of config.assets) {
  const assetPath = path.resolve(asset.path);
  console.log(\`\\nValidating protected asset: \${asset.path}\`);
  
  if (!fs.existsSync(assetPath)) {
    console.error(\`ERROR: Protected asset not found: \${assetPath}\`);
    hasError = true;
    continue;
  }

  const stats = fs.statSync(assetPath);
  const fileSize = stats.size;
  console.log(\`Size: \${fileSize} bytes\`);

  if (fileSize !== asset.expectedSize) {
    console.error(\`ERROR: File size mismatch! Expected \${asset.expectedSize}, got \${fileSize}\`);
    hasError = true;
  }

  if (fileSize >= 20) {
    const fd = fs.openSync(assetPath, 'r');
    const header = Buffer.alloc(4);
    fs.readSync(fd, header, 0, 4, 0);
    const magic = header.toString('utf8', 0, 4);
    fs.closeSync(fd);
    
    if (asset.expectedMagic && magic !== asset.expectedMagic) {
      console.error(\`ERROR: Magic bytes mismatch! Expected \${asset.expectedMagic}, got \${magic}\`);
      hasError = true;
    }
  }

  if (asset.expectedHash) {
    const fileBuffer = fs.readFileSync(assetPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log(\`SHA-256: \${hash}\`);
    if (hash !== asset.expectedHash) {
      console.error(\`ERROR: SHA-256 hash mismatch! Expected \${asset.expectedHash}, got \${hash}\`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\\nERROR: Validation of protected assets failed. The files may have been corrupted or improperly modified.');
  process.exit(1);
}

console.log('\\nSUCCESS: All protected assets validated successfully.');
`;
fs.writeFileSync('scripts/check-protected-assets.mjs', checkScriptContent);

// 6. Update package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts['validate:assets'] = 'node scripts/check-protected-assets.mjs';

const existingPrebuild = packageJson.scripts.prebuild || '';
const newPrebuild = "npm run validate:assets && node scripts/validate-glb.mjs public/models/avatar/goat_base_human_v2.glb";
packageJson.scripts.prebuild = newPrebuild;

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 8. Update GitHub Actions Workflow
const workflowPath = '.github/workflows/deploy.yml';
if (fs.existsSync(workflowPath)) {
  let workflowContent = fs.readFileSync(workflowPath, 'utf8');
  if (!workflowContent.includes('npm run validate:assets')) {
    workflowContent = workflowContent.replace(
      '      - name: Run Linter',
      '      - name: Validate Protected Assets\n        run: npm run validate:assets\n      - name: Run Linter'
    );
    fs.writeFileSync(workflowPath, workflowContent);
  }
}

