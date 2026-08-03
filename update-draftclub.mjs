import fs from 'fs';

const path = 'src/components/creation/CreationDraftClub.tsx';
let content = fs.readFileSync(path, 'utf8');

const returnIndex = content.indexOf('return (', 100);
const beforeReturn = content.substring(0, returnIndex);

const newReturn = `  const footer = selectedClub ? (
    <button 
      onClick={handleStartCareer}
      className="w-full bg-yellow-500 text-yellow-950 font-black text-sm py-4 rounded-xl hover:bg-yellow-400 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
    >
      Assinar Contrato
    </button>
  ) : (
    <div className="flex gap-4">
      <button 
        onClick={() => setShowExitConfirm(true)}
        className="flex-1 bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm py-4 rounded-xl hover:bg-red-500/20 transition-colors uppercase tracking-widest"
      >
        Cancelar
      </button>
      <button 
        onClick={handleDraft}
        disabled={drafting}
        className="flex-[2] bg-white text-black font-black text-sm py-4 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {drafting ? 'Sorteando...' : 'Sortear Clube'}
      </button>
    </div>
  );

  return (
    <StudioLayout 
      title="Draft de Clube" 
      subtitle="Sorteie o seu primeiro clube profissional para iniciar a carreira."
      footer={footer}
    >
      {showExitConfirm && (
        <div className="mb-6 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <ShieldAlert className="text-red-500 w-12 h-12 mb-3" />
          <h3 className="text-lg font-black text-white mb-2">Abandonar Criação?</h3>
          <p className="text-xs text-red-200 mb-6">Todo o seu progresso de criação de jogador será perdido. Tem certeza?</p>
          <div className="flex gap-3 w-full">
            <button 
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-zinc-800"
            >
              Continuar Criando
            </button>
            <button 
              onClick={handleConfirmExit}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-red-500"
            >
              Sim, Sair
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
        {drafting ? (
          <div className="text-center animate-pulse space-y-6">
            <div className="w-24 h-24 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto" />
            <div className="text-sm font-black text-yellow-500 uppercase tracking-[0.3em]">Buscando Propostas...</div>
          </div>
        ) : selectedClub ? (
          <div className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div 
              className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
              style={{ backgroundColor: selectedClub.primaryColor }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div 
                className="w-28 h-28 rounded-3xl flex items-center justify-center text-4xl shadow-2xl mb-6 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500"
                style={{ backgroundColor: selectedClub.primaryColor, color: selectedClub.secondaryColor || '#fff' }}
              >
                {selectedClub.logo}
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{selectedClub.name}</h2>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">
                <span>{selectedClub.league}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>Nível {selectedClub.reputation}/100</span>
              </div>
              <p className="text-sm text-zinc-300 bg-black/40 p-4 rounded-xl border border-white/5 italic">
                "{selectedClub.description}"
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 opacity-50">
              <span className="text-4xl">?</span>
            </div>
            <p className="text-zinc-400 text-sm font-semibold max-w-[250px] mx-auto">
              Clique em Sortear Clube para descobrir onde sua jornada começará.
            </p>
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
`;

let newContent = beforeReturn.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\nimport { StudioLayout } from './StudioLayout';");

fs.writeFileSync(path, newContent + newReturn);
