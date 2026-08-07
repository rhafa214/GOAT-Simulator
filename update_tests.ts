import fs from 'fs';

let content = fs.readFileSync('src/__tests__/goatDna.test.ts', 'utf-8');

// Replace all generateInitialPlayerStats calls to include the third parameter
content = content.replace(/generateInitialPlayerStats\(\s*position,\s*i,\s*draftResult\.potential,\s*state\.acquiredDNA\s*\)/g,
  "generateInitialPlayerStats(position, i, draftResult.current, draftResult.potential, state.acquiredDNA)");

content = content.replace(/generateInitialPlayerStats\('ST',\s*42,\s*draftResult1\.potential,\s*state\.acquiredDNA\)/g,
  "generateInitialPlayerStats('ST', 42, draftResult1.current, draftResult1.potential, state.acquiredDNA)");

content = content.replace(/generateInitialPlayerStats\('CB',\s*1,\s*\{\},\s*\[\]\)/g,
  "generateInitialPlayerStats('CB', 1, {}, {}, [])");

content = content.replace(/generateInitialPlayerStats\('CB',\s*1,\s*highDraft,\s*\[([^\]]+)\]\)/g,
  "generateInitialPlayerStats('CB', 1, {}, highDraft, [$1])");

fs.writeFileSync('src/__tests__/goatDna.test.ts', content);
console.log('tests updated');
