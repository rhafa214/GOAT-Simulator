import fs from 'fs';

const buffer = fs.readFileSync('public/models/characters/default/goat_player.glb');
if (buffer.toString('utf8', 0, 4) !== 'glTF') {
  console.log('Not a valid glTF file');
  process.exit(1);
}

const jsonChunkLength = buffer.readUInt32LE(12);
const jsonChunkType = buffer.readUInt32LE(16);
if (jsonChunkType !== 0x4E4F534A) {
  console.log('No JSON chunk found');
  process.exit(1);
}

const jsonBuffer = buffer.slice(20, 20 + jsonChunkLength);
const json = JSON.parse(jsonBuffer.toString('utf8'));

const meshes = json.meshes ? json.meshes.map(m => m.name || 'unnamed') : [];
const materials = json.materials ? json.materials.map(m => m.name || 'unnamed') : [];

console.log('Meshes:', meshes);
console.log('Materials:', materials);
