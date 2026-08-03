const fs = require('fs');
const buffer = fs.readFileSync('/app/applet/public/models/avatar/goat_base_human_v1.glb');
const chunk0Length = buffer.readUInt32LE(12);
const jsonBuffer = buffer.slice(20, 20 + chunk0Length);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));

if (gltf.meshes) {
  for (const mesh of gltf.meshes) {
    if (mesh.primitives) {
      for (const prim of mesh.primitives) {
        if (prim.attributes.POSITION !== undefined) {
          const accessor = gltf.accessors[prim.attributes.POSITION];
          console.log('POSITION accessor min:', accessor.min);
          console.log('POSITION accessor max:', accessor.max);
        }
      }
    }
  }
}
