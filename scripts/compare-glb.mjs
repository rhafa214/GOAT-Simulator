import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node compare-glb.mjs <file1> <file2>');
  process.exit(1);
}

const file1 = path.resolve(args[0]);
const file2 = path.resolve(args[1]);

console.log(`\n--- Comparing ${file1} and ${file2} ---`);

if (!fs.existsSync(file1)) {
  console.error(`File not found: ${file1}`);
  process.exit(1);
}

if (!fs.existsSync(file2)) {
  console.error(`File not found: ${file2}`);
  process.exit(1);
}

const stats1 = fs.statSync(file1);
const stats2 = fs.statSync(file2);

console.log(`${path.basename(file1)} size: ${stats1.size} bytes`);
console.log(`${path.basename(file2)} size: ${stats2.size} bytes`);

if (stats1.size !== stats2.size) {
  console.error('ERROR: File sizes differ!');
  process.exit(1);
}

const hash1 = crypto.createHash('sha256').update(fs.readFileSync(file1)).digest('hex');
const hash2 = crypto.createHash('sha256').update(fs.readFileSync(file2)).digest('hex');

console.log(`${path.basename(file1)} hash: ${hash1}`);
console.log(`${path.basename(file2)} hash: ${hash2}`);

if (hash1 !== hash2) {
  console.error('ERROR: File hashes differ!');
  process.exit(1);
}

console.log('Files are identical.');
