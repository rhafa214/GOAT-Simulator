const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');
const startIndex = content.indexOf('return (');
const endIndex = content.lastIndexOf(';');
const commentIndex = content.indexOf('// Ensure');
if (startIndex !== -1 && commentIndex !== -1) {
  content = content.substring(0, startIndex) + `return (
    <group ref={group} dispose={null} scale={[2.0, 2.0, 2.0]} position={[0, -1.5, 0]}>
      <primitive object={clone} />
    </group>
  );
}
` + content.substring(commentIndex);
  fs.writeFileSync(file, content);
  console.log('patched successfully');
} else {
  console.log('indices not found', startIndex, commentIndex);
}
