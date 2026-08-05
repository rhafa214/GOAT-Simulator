const fs = require('fs');
const file = 'src/components/3d/anim/useProceduralIdle.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /if \(typeof window !== 'undefined'\) {/,
  "if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {"
);

fs.writeFileSync(file, content, 'utf8');
console.log('patched');
