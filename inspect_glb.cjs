const fs = require('fs');
const buffer = fs.readFileSync('/app/applet/public/models/avatar/goat_base_human_v1.glb');
const magic = buffer.toString('utf8', 0, 4);
if (magic !== 'glTF') {
  console.log('Not a glTF file');
  process.exit(1);
}
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);
const chunk0Length = buffer.readUInt32LE(12);
const chunk0Type = buffer.toString('utf8', 16, 20);
if (chunk0Type !== 'JSON') {
  console.log('Chunk 0 is not JSON');
  process.exit(1);
}
const jsonBuffer = buffer.slice(20, 20 + chunk0Length);
const jsonStr = jsonBuffer.toString('utf8');
const gltf = JSON.parse(jsonStr);

console.log('--- GLB Inspection ---');
console.log('Meshes:', gltf.meshes ? gltf.meshes.length : 0);
if (gltf.meshes) {
  console.log('Mesh names:', gltf.meshes.map(m => m.name).join(', '));
}
console.log('Materials:', gltf.materials ? gltf.materials.length : 0);
if (gltf.materials) {
  console.log('Material names:', gltf.materials.map(m => m.name).join(', '));
}

let skinnedMeshes = 0;
if (gltf.nodes) {
  for (const node of gltf.nodes) {
    if (node.mesh !== undefined && node.skin !== undefined) {
      skinnedMeshes++;
    }
  }
}
console.log('SkinnedMeshes:', skinnedMeshes);
console.log('Skeleton (Skins):', gltf.skins ? gltf.skins.length : 0);

if (gltf.skins) {
  for (const skin of gltf.skins) {
    console.log('Skin name:', skin.name || 'unnamed');
    if (skin.joints) {
      const jointNames = skin.joints.map(j => gltf.nodes[j].name || 'unnamed');
      console.log('Bones:', jointNames.join(', '));
    }
  }
}

console.log('Animations:', gltf.animations ? gltf.animations.length : 0);
if (gltf.animations) {
  console.log('Animation names:', gltf.animations.map(a => a.name).join(', '));
}

let triangles = 0;
if (gltf.meshes) {
  for (const mesh of gltf.meshes) {
    if (mesh.primitives) {
      for (const prim of mesh.primitives) {
        if (prim.indices !== undefined) {
          const accessor = gltf.accessors[prim.indices];
          triangles += accessor.count / 3;
        }
      }
    }
  }
}
console.log('Approximate Triangles:', triangles);

