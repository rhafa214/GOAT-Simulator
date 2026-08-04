import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const configPath = path.resolve('protected-assets.json');
if (!fs.existsSync(configPath)) {
  console.log('No protected-assets.json found, skipping post-build validation.');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
let hasError = false;

for (const asset of config.assets) {
  // Check the asset in the dist/ folder instead of public/
  const distPath = asset.path.replace('public/', 'dist/');
  const fullPath = path.resolve(distPath);
  
  console.log(`\nValidating post-build asset: ${distPath}`);
  
  if (!fs.existsSync(fullPath)) {
    if (asset.pending) {
      console.log(`OK: Asset is marked as pending and not found: ${distPath}. Skipping validation.`);
      continue;
    } else {
      console.error(`ERROR: Protected asset not found in build: ${distPath}`);
      hasError = true;
      continue;
    }
  }

  // Asset is present
  console.log(`Asset found: ${distPath}`);
  const stats = fs.statSync(fullPath);
  const fileSize = stats.size;
  console.log(`Size: ${fileSize} bytes`);

  if (asset.expectedSize !== null && asset.expectedSize !== undefined) {
    if (fileSize !== asset.expectedSize) {
      console.error(`ERROR: File size mismatch! Expected ${asset.expectedSize}, got ${fileSize}`);
      hasError = true;
    }
  }

  if (fileSize >= 20) {
    const fd = fs.openSync(fullPath, 'r');
    const header = Buffer.alloc(12);
    fs.readSync(fd, header, 0, 12, 0);
    const magic = header.toString('utf8', 0, 4);
    const length = header.readUInt32LE(8);
    fs.closeSync(fd);
    
    if (asset.expectedMagic && magic !== asset.expectedMagic) {
      console.error(`ERROR: Magic bytes mismatch! Expected ${asset.expectedMagic}, got ${magic}`);
      hasError = true;
    }
    
    if (magic === 'glTF' && length !== fileSize) {
      console.error(`ERROR: GLB header length (${length}) does not match actual file size (${fileSize}). File is likely corrupted.`);
      hasError = true;
    }
  }

  if (asset.expectedHash) {
    const fileBuffer = fs.readFileSync(fullPath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log(`SHA-256: ${hash}`);
    if (hash !== asset.expectedHash) {
      console.error(`ERROR: SHA-256 hash mismatch! Expected ${asset.expectedHash}, got ${hash}`);
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\nERROR: Post-build validation of protected assets failed. One or more files are missing or corrupted.');
  process.exit(1);
}

console.log('\nSUCCESS: Post-build asset validation passed.');
