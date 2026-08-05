const fs = require('fs');
const file = 'src/__tests__/avatar/AvatarGLTFModel.test.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip out our previous problematic mock completely and put a safer one
const safeMock = `vi.mock('@react-three/fiber', () => ({
  useFrame: () => {},
  useThree: () => ({ camera: { type: 'PerspectiveCamera', fov: 35, position: { set: vi.fn() }, updateProjectionMatrix: vi.fn() }, controls: {} }),
}));`;

content = content.replace(/let frameCallback.*\}\)\);/ms, safeMock);

fs.writeFileSync(file, content, 'utf8');
console.log('patched to safe mock');
