import fs from 'fs';
let content = fs.readFileSync('src/components/menu/MainMenu.tsx', 'utf8');

content = content.replace(
  `import { GamePhase } from '../../types';`,
  `import { GamePhase } from '../../types';\nimport { BRANDING } from '../../core/constants/branding';`
);

content = content.replace(
  `<p>GOAT Simulator © 2026 — Todos os direitos reservados.</p>`,
  `<p>{BRANDING.name} © 2026 — Todos os direitos reservados.</p>`
);

content = content.replace(
  `<div className="flex items-center gap-6">\n              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-black font-black text-5xl shadow-[0_0_40px_rgba(234,179,8,0.3)]">\n                F\n              </div>\n              <div>\n                <h1 className="text-6xl font-black tracking-tight text-white mb-2">\n                  GOAT Simulator\n                </h1>\n                <p className="text-xl text-zinc-400 font-bold uppercase tracking-[0.2em]">\n                  O Fenômeno\n                </p>\n              </div>\n            </div>`,
  `<div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-black font-black text-5xl shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                F
              </div>
              <div>
                <h1 className="text-6xl font-black tracking-tight text-white mb-2">
                  {BRANDING.name}
                </h1>
                <p className="text-xl text-zinc-400 font-bold uppercase tracking-[0.2em]">
                  {BRANDING.slogan}
                </p>
              </div>
            </div>`
);

fs.writeFileSync('src/components/menu/MainMenu.tsx', content);
console.log('patched mainmenu');
