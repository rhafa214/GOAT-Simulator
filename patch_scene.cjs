const fs = require('fs');
const file = 'src/components/3d/AvatarScene.tsx';
let content = fs.readFileSync(file, 'utf8');

const devImport = `import React, { Suspense, useState } from "react";`;
content = content.replace(/import React, { Suspense } from "react";/, devImport);

const devProps = `  const [devClubId, setDevClubId] = useState<string | undefined>(undefined);
  const [devKitType, setDevKitType] = useState<'home' | 'away'>('home');
  const isDev = import.meta.env.DEV;`;
  
content = content.replace(/  const \{ quality \} = useAvatarManager\(\);/, `  const { quality } = useAvatarManager();\n${devProps}`);

const newRenderer = `<AvatarRenderer 
            clubColor={clubColor} 
            pose={pose} 
            quality={quality} 
            clubId={isDev && devClubId ? devClubId : undefined}
            kitType={isDev && devClubId ? devKitType : undefined}
            season="2026"
          />`;
content = content.replace(/<AvatarRenderer clubColor=\{clubColor\} pose=\{pose\} quality=\{quality\} \/>/, newRenderer);

const devPanel = `{isDev && (
        <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur border border-zinc-800 p-4 rounded-xl text-white text-xs font-mono w-64">
          <div className="mb-2 text-zinc-400 font-bold tracking-wider uppercase border-b border-zinc-800 pb-2">Kit Pilot Dev Tools</div>
          <div className="space-y-2">
            <button 
              onClick={() => setDevClubId(undefined)}
              className={\`w-full text-left px-2 py-1 rounded \${!devClubId ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-800'}\`}
            >
              1. Default (No Kit)
            </button>
            <button 
              onClick={() => { setDevClubId('goat-fc'); setDevKitType('home'); }}
              className={\`w-full text-left px-2 py-1 rounded \${devClubId === 'goat-fc' && devKitType === 'home' ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-800'}\`}
            >
              2. GOAT FC - Home
            </button>
            <button 
              onClick={() => { setDevClubId('goat-fc'); setDevKitType('away'); }}
              className={\`w-full text-left px-2 py-1 rounded \${devClubId === 'goat-fc' && devKitType === 'away' ? 'bg-amber-500/20 text-amber-500' : 'hover:bg-zinc-800'}\`}
            >
              3. GOAT FC - Away
            </button>
          </div>
        </div>
      )}`;

content = content.replace(/<Canvas shadows dpr=\{dpr\}>/, `${devPanel}\n      <Canvas shadows dpr={dpr}>`);

fs.writeFileSync(file, content, 'utf8');
console.log('patched scene');
