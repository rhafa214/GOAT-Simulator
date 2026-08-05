// Just a quick check to see if we can parse the JSON of the new model
import fs from 'fs';
const buffer = fs.readFileSync('public/models/characters/default/goat_player.glb');
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonBuffer = buffer.slice(20, 20 + jsonChunkLength);
const json = JSON.parse(jsonBuffer.toString('utf8'));
console.log(json.meshes[0]);
