import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const configPath = path.resolve('protected-assets.json');
if (!fs.existsSync(configPath)) {
  console.error(`Configuration file not found: ${configPath}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let hasError = false;

for (const asset of config.assets) {
  const assetPath = path.resolve(asset.path);
  console.log(`\nValidating protected asset: ${asset.path}`);
  
  if (!fs.existsSync(assetPath)) {
    console.error(`ERROR: Protected asset not found: ${assetPath}`);
    hasError = true;
    continue;
  }

  const stats = fs.statSync(assetPath);
  const fileSize = stats.size;
  console.log(`Size: ${fileSize} bytes`);

  if (fileSize !== asset.expectedSize) {
    console.error(`ERROR: File size mismatch! Expected ${asset.expectedSize}, got ${fileSize}`);
    hasError = true;
  }

  if (fileSize >= 20) {
    const fd = fs.openSync(assetPath, 'r');
    const header = Buffer.alloc(4);
    fs.readSync(fd, header, 0, 4, 0);
    const magic = header.toString('utf8', 0, 4);
    fs.closeSync(fd);
    
    if (asset.expectedMagic && magic !== asset.expectedMagic) {
      console.error(`ERROR: Magic bytes mismatch! Expected ${asset.expectedMagic}, got ${magic}`);
      hasError = true;
    }
  }

  if (asset.expectedHash) {
    const fileBuffer = fs.readFileSync(assetPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log(`SHA-256: ${hash}`);
    if (hash !== asset.expectedHash) {
      console.error(`ERROR: SHA-256 hash mismatch! Expected ${asset.expectedHash}, got ${hash}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\nERROR: Validation of protected assets failed. The files may have been corrupted or improperly modified.');
  process.exit(1);
}

console.log('\nSUCCESS: All protected assets validated successfully.');
