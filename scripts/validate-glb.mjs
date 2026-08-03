import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node validate-glb.mjs <path-to-glb>');
  process.exit(1);
}

const glbPath = path.resolve(args[0]);
console.log(`\n--- Validating ${glbPath} ---`);
if (!fs.existsSync(glbPath)) {
  console.error(`File not found: ${glbPath}`);
  process.exit(1);
}

const stats = fs.statSync(glbPath);
const fileSize = stats.size;
console.log(`File size: ${fileSize} bytes`);

const fileBuffer = fs.readFileSync(glbPath);
const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
console.log(`SHA-256 Hash: ${hash}`);

if (fileSize < 20) {
  console.error('ERROR: File too small to be a valid GLB');
  process.exit(1);
}

const fd = fs.openSync(glbPath, 'r');
const header = Buffer.alloc(12);
fs.readSync(fd, header, 0, 12, 0);

const magic = header.toString('utf8', 0, 4);
const version = header.readUInt32LE(4);
const length = header.readUInt32LE(8);

console.log(`Magic: ${magic}`);
console.log(`Version: ${version}`);
console.log(`Header Length: ${length}`);

if (magic !== 'glTF') {
  console.error('ERROR: Invalid magic string. Expected "glTF".');
  const textBuffer = Buffer.alloc(Math.min(100, fileSize));
  fs.readSync(fd, textBuffer, 0, textBuffer.length, 0);
  console.log(`First bytes as string: ${textBuffer.toString('utf8').replace(/\n/g, '\\n')}`);
  process.exit(1);
}

if (length !== fileSize) {
  console.error(`ERROR: GLB header length (${length}) does not match actual file size (${fileSize})`);
  process.exit(1);
}

// Read Chunk 0 (JSON)
const chunk0Header = Buffer.alloc(8);
fs.readSync(fd, chunk0Header, 0, 8, 12);
const chunk0Length = chunk0Header.readUInt32LE(0);
const chunk0Type = chunk0Header.toString('utf8', 4, 8);

console.log(`Chunk 0 Length: ${chunk0Length}`);
console.log(`Chunk 0 Type: ${chunk0Type}`);

if (chunk0Type !== 'JSON') {
  console.error('ERROR: Chunk 0 must be JSON');
  process.exit(1);
}

let pos = 12 + 8 + chunk0Length;
if (pos < fileSize) {
  // Read Chunk 1 (BIN)
  const chunk1Header = Buffer.alloc(8);
  fs.readSync(fd, chunk1Header, 0, 8, pos);
  const chunk1Length = chunk1Header.readUInt32LE(0);
  const chunk1Type = chunk1Header.toString('utf8', 4, 8);
  console.log(`Chunk 1 Length: ${chunk1Length}`);
  console.log(`Chunk 1 Type: ${chunk1Type}`);
} else {
  console.log('No BIN chunk found.');
}

console.log('GLB validation passed.');
fs.closeSync(fd);
