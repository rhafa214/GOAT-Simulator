const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');

const importStatement = `import { useProceduralIdle } from "./anim/useProceduralIdle";`;
if (!content.includes('useProceduralIdle')) {
  content = content.replace('import { useValidatedGLBUrl }', importStatement + '\nimport { useValidatedGLBUrl }');
}

const propDecl = `  clubColor?: string;
  quality?: "low" | "high";
  idleEnabled?: boolean;`;
content = content.replace(/  clubColor\?: string;\s*quality\?: "low" \| "high";/, propDecl);

const argsDecl = `  clubColor,
  quality = "low",
  idleEnabled = true,
}: AvatarGLTFModelProps) {`;
content = content.replace(/  clubColor,\s*quality = "low",\s*}: AvatarGLTFModelProps\) {/, argsDecl);

const idleHookCall = `  // Hook up animations
  useAvatarAnimation(animations, group, pose);
  
  // Hook up procedural idle animation
  useProceduralIdle({ scene: clone, idleEnabled: idleEnabled && pose === "idle" });`;
content = content.replace(/  \/\/ Hook up animations\s*useAvatarAnimation\(animations, group, pose\);/, idleHookCall);

fs.writeFileSync(file, content, 'utf8');
console.log('patched model');
