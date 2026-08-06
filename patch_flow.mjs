import fs from 'fs';
let content = fs.readFileSync('src/components/FlowController.tsx', 'utf8');

content = content.replace(
  `import React, { Suspense, lazy } from 'react';`,
  `import React, { Suspense, lazy, useMemo } from 'react';\nimport { usePageTitle } from '../hooks/usePageTitle';\nimport { BRANDING } from '../core/constants/branding';`
);

content = content.replace(
  `export default function FlowController() {
  const phase = useGamePhase();
  const player = usePlayer();`,
  `export default function FlowController() {
  const phase = useGamePhase();
  const player = usePlayer();

  const pageTitle = useMemo(() => {
    switch(phase) {
      case 'MAIN_MENU': return 'Início';
      case 'CREATION_BASIC_INFO':
      case 'CREATION_POSITION':
      case 'CREATION_APPEARANCE':
      case 'CREATION_DRAFT_LENGTH':
      case 'CREATION_ATTRIBUTES':
      case 'CREATION_PERSONALITY':
      case 'DRAFT_CLUB':
        return 'Criação';
      case 'HUB': return 'Central';
      case 'EVENT': return 'Evento';
      case 'MATCH': return 'Dia de Jogo';
      case 'POST_MATCH': return 'Pós-Jogo';
      case 'RETIREMENT': return 'Aposentadoria';
      case 'TRANSFERS': return 'Mercado';
      default: return '';
    }
  }, [phase]);

  usePageTitle(pageTitle);`
);

content = content.replace(
  `<h1 className="text-xl font-bold tracking-tight text-white/90">GOAT Simulator</h1>`,
  `<h1 className="text-xl font-bold tracking-tight text-white/90">{BRANDING.name}</h1>`
);

content = content.replace(
  `<p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">O Fenômeno</p>`,
  `<p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{BRANDING.slogan}</p>`
);

fs.writeFileSync('src/components/FlowController.tsx', content);
console.log('patched flow');
