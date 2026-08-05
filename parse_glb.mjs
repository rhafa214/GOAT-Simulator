import fs from 'fs';

const buffer = fs.readFileSync('public/models/characters/default/goat_player.glb');
const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16); // Should be 0x4E4F534A (JSON)

if (chunkType === 0x4E4F534A) {
  const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonString);
  
  const nodes = json.nodes;
  if (nodes) {
    const boneNames = nodes.map(n => n.name).filter(n => n && (n.toLowerCase().includes('spine') || n.toLowerCase().includes('neck') || n.toLowerCase().includes('head') || n.toLowerCase().includes('shoulder') || n.toLowerCase().includes('hip') || n.toLowerCase().includes('pelvis') || n.toLowerCase().includes('root') || n.toLowerCase().includes('cc_base')));
    console.log(boneNames);
  }
}
