import fs from 'fs';
let content = fs.readFileSync('src/components/menu/MainMenu.tsx', 'utf8');

content = content.replace(
  `import React, { useState, useEffect, useRef } from 'react';`,
  `import React, { useState, useEffect, useRef } from 'react';\nimport { BRANDING } from '../../core/constants/branding';`
);

fs.writeFileSync('src/components/menu/MainMenu.tsx', content);
console.log('patched mainmenu import');
