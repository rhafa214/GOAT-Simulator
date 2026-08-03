import fs from 'fs';

const path = 'src/components/creation/CreationPersonality.tsx';
let content = fs.readFileSync(path, 'utf8');

const returnIndex = content.indexOf('return (', 100);
const beforeReturn = content.substring(0, returnIndex);

const newReturn = `  const footer = (
    <div className="flex gap-4">
      <button 
        onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_ATTRIBUTES' })} // actually previous is attributes or draft length depending on mode, but let's just leave it or use back
        className="flex-1 bg-zinc-900 border border-white/10 text-white font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest"
      >
        Voltar
      </button>
      <button 
        onClick={handleNext}
        disabled={!personality}
        className="flex-[2] bg-yellow-500 text-yellow-950 font-black text-sm py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
      >
        Avançar
      </button>
    </div>
  );

  return (
    <StudioLayout 
      title="Sua Personalidade" 
      subtitle="Defina o traço marcante que vai guiar sua carreira fora e dentro de campo."
      footer={footer}
    >
      <div className="grid grid-cols-1 gap-4">
        {TRAITS.map(trait => (
          <button
            key={trait.id}
            aria-pressed={personality === trait.id}
            onClick={() => setPersonality(trait.id)}
            className={\`w-full p-5 rounded-2xl border-2 text-left transition-all \${
              personality === trait.id 
                ? 'border-yellow-500 bg-yellow-500/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]' 
                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }\`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{trait.icon}</span>
              <span className={\`font-black text-lg \${personality === trait.id ? 'text-yellow-400' : 'text-white'}\`}>{trait.label}</span>
            </div>
            <div className="text-sm text-zinc-400 font-semibold mb-3">{trait.desc}</div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-black/40 inline-block px-2 py-1 rounded-md">
              {trait.impacts}
            </div>
          </button>
        ))}
      </div>
    </StudioLayout>
  );
}
`;

let newContent = beforeReturn.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { StudioLayout } from './StudioLayout';");

fs.writeFileSync(path, newContent + newReturn);
