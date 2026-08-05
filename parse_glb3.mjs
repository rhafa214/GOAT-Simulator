import fs from 'fs';

const buffer = fs.readFileSync('public/models/characters/default/goat_player.glb');
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16); 
if (chunkType === 0x4E4F534A) {
  const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonString);
  const nodes = json.nodes;
  console.log(nodes.map(n => n.name).filter(n => n && n.toLowerCase().includes('clavicle')).join(', '));
}
