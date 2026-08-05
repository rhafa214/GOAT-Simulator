const fs = require('fs');
const file = 'src/__tests__/avatar/AvatarGLTFModel.test.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /let frameCallback = null;\nvi.mock\('@react-three\/fiber', \(\) => \(\{\n  useFrame: \(cb\) => \{ frameCallback = cb; \},\n  useThree: \(\) => \(\{ camera: \{\}, controls: \{\} \}\),\n\}\)\);/,
  "let frameCallback = null;\nvi.mock('@react-three/fiber', () => ({\n  useFrame: (cb) => { frameCallback = cb; },\n  useThree: () => ({ camera: {}, controls: {} }),\n}));"
);

// If the tests are crashing on state.clock.getElapsedTime(), it means our mock useFrame in AvatarGLTFModel.test.tsx
// is either being called immediately, or when called it receives no state. Let's fix the mock.

const mockReplacement = `let frameCallback: any = null;
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => { 
    frameCallback = cb; 
    // Do not call cb() immediately, tests will call it if needed with mock state
  },
  useThree: () => ({ camera: { type: 'PerspectiveCamera', fov: 35, position: { set: vi.fn() }, updateProjectionMatrix: vi.fn() }, controls: {} }),
}));`;

content = content.replace(/let frameCallback.*\}\)\);/s, mockReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log('patched tests');
