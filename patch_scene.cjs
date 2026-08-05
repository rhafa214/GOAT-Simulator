const fs = require('fs');
const file = 'src/components/3d/AvatarScene.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<PerspectiveCamera makeDefault position=\{\[0, 0\.5, 6\]\} fov=\{35\} \/>/,
  '<PerspectiveCamera makeDefault position={[0, 0, 4.1]} fov={35} />'
);

content = content.replace(
  /target=\{\[0, 0\.2, 0\]\}/,
  'target={[0, -0.6, 0]}'
);

fs.writeFileSync(file, content, 'utf8');
console.log('patched scene');
