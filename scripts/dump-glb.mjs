import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// GLTFLoader needs a DOM for images/blobs, it might fail.
// A simpler way: we can just parse the GLB JSON chunk.

const buffer = fs.readFileSync('public/models/characters/default/goat_player.glb');
const magic = buffer.readUInt32LE(0);
if (magic !== 0x46546C67) {
  console.log("Not a GLB");
  process.exit(1);
}
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);
if (chunkType === 0x4E4F534A) { // JSON
  const jsonChunk = buffer.toString('utf8', 20, 20 + chunkLength);
  const json = JSON.parse(jsonChunk);
  
  console.log("--- MESHES ---");
  json.meshes?.forEach((m, i) => console.log(i, m.name));
  console.log("\n--- MATERIALS ---");
  json.materials?.forEach((m, i) => console.log(i, m.name));
  console.log("\n--- NODES (SkinnedMeshes) ---");
  json.nodes?.forEach((n, i) => {
     if (n.mesh !== undefined) {
         console.log(i, n.name, "Mesh ID:", n.mesh);
     }
  });
}
