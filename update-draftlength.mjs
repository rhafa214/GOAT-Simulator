import fs from 'fs';

const path = 'src/components/creation/CreationDraftLength.tsx';
let content = `import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { Zap, Target } from 'lucide-react';
import { StudioLayout } from './StudioLayout';

export default function CreationDraftLength() {
  const { dispatch } = useGameEngine();
  const [selected, setSelected] = useState<'QUICK' | 'COMPLETE' | null>(null);

  const handleNext = () => {
    if (selected) {
      dispatch({ type: 'SET_DRAFT_LENGTH', payload: selected });
      dispatch({ type: 'INIT_DRAFT', payload: { mode: selected } });
      dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_ATTRIBUTES' });
    }
  };

  const footer = (
    <div className="flex gap-4">
      <button 
        onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_APPEARANCE' })}
        className="flex-1 bg-zinc-900 border border-white/10 text-white font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest"
      >
        Voltar
      </button>
      <button 
        onClick={handleNext}
        disabled={!selected}
        className="flex-[2] bg-yellow-500 text-yellow-950 font-black text-sm py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
      >
        Iniciar
      </button>
    </div>
  );

  return (
    <StudioLayout 
      title="Modo de Criação" 
      subtitle="Escolha a profundidade do seu desenvolvimento inicial."
      footer={footer}
    >
      <div className="space-y-4">
        {/* Modo Rápido */}
        <button 
          aria-pressed={selected === 'QUICK'}
          onClick={() => setSelected('QUICK')}
          className={\`w-full relative group bg-white/5 border-2 rounded-[1.5rem] p-6 text-left transition-all duration-300 overflow-hidden \${selected === 'QUICK' ? 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.15)] bg-yellow-500/10' : 'border-white/10 hover:border-yellow-500/50 hover:bg-white/10'}\`}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-yellow-500" size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Rápido</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-widest">2-3 Min</span>
                    <span className="text-white/30">•</span>
                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">8 Atributos</span>
                 </div>
               </div>
            </div>
            <p className="text-zinc-400 font-medium text-sm">
              Focado nos atributos essenciais. Os secundários serão calculados de forma inteligente para garantir equilíbrio.
            </p>
          </div>
        </button>

        {/* Modo Completo */}
        <button 
          aria-pressed={selected === 'COMPLETE'}
          onClick={() => setSelected('COMPLETE')}
          className={\`w-full relative group bg-white/5 border-2 rounded-[1.5rem] p-6 text-left transition-all duration-300 overflow-hidden \${selected === 'COMPLETE' ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-blue-500/10' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/10'}\`}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="text-blue-500" size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Completo</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">8-10 Min</span>
                    <span className="text-white/30">•</span>
                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">20 Atributos</span>
                 </div>
               </div>
            </div>
            <p className="text-zinc-400 font-medium text-sm">
              Controle total. Escolha cada detalhe dos atributos técnicos, físicos e mentais para moldar seu jogador.
            </p>
          </div>
        </button>
      </div>
    </StudioLayout>
  );
}
`;

fs.writeFileSync(path, content);
