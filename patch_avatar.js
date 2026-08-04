const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<group ref=\{group\} dispose=\{null\} scale=\{\[1\.8, 1\.8, 1\.8\]\} position=\{\[0, 0, 0\]\}>[\s\S]*?<\/group>\s*<\/group>/g, 
  "<group ref={group} dispose={null} scale={[1.0, 1.0, 1.0]} position={[0, -0.9, 0]}>\n      <primitive object={clone} />\n    </group>"
);
fs.writeFileSync(file, content);
console.log('patched AvatarGLTFModel');
