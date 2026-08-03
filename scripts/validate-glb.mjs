import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node validate-glb.mjs <path-to-glb>');
  process.exit(1);
}

const glbPath = path.resolve(args[0]);
console.log(`Validating ${glbPath}...`);

if (!fs.existsSync(glbPath)) {
  console.error(`File not found: ${glbPath}`);
  process.exit(1);
}

const stats = fs.statSync(glbPath);
console.log(`File size: ${stats.size} bytes`);

if (stats.size < 20) {
  console.error('File too small to be a valid GLB');
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
console.log(`Length: ${length}`);

if (magic !== 'glTF') {
  console.error('ERROR: Invalid magic string. Expected "glTF".');
  // Check if it's text (like a git LFS pointer or HTML)
  const textBuffer = Buffer.alloc(100);
  fs.readSync(fd, textBuffer, 0, 100, 0);
  console.log(`First 100 bytes as string: ${header.toString('utf8') + textBuffer.toString('utf8').replace(/\n/g, '\\n')}`);
  process.exit(1);
}

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

console.log('GLB header looks valid.');
fs.closeSync(fd);
