import fs from 'fs';
let content = fs.readFileSync('src/components/menu/MainMenu.tsx', 'utf8');

content = content.replace(
  `O Fenômeno — Construa seu Legado Imortal`,
  `{BRANDING.slogan} — Construa seu Legado Imortal`
);

fs.writeFileSync('src/components/menu/MainMenu.tsx', content);
console.log('patched slogan');
