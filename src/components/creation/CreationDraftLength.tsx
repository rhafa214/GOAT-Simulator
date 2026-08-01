import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Zap, Target } from 'lucide-react';

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl w-full flex flex-col items-center justify-center h-[85vh] p-4"
    >
      <div className="text-center mb-12">
        <h2 className="text-xl font-bold text-zinc-500 uppercase tracking-widest mb-2">Duração do Draft</h2>
        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase">
          Escolha o Modo de Criação
        </h1>
        <p className="text-zinc-400 font-bold mt-4 max-w-2xl mx-auto">
          Você pode escolher uma experiência rápida focada apenas nos atributos principais, ou mergulhar profundamente em cada detalhe do seu jogador.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Modo Rápido */}
        <button 
          onClick={() => setSelected('QUICK')}
          className={`flex-1 relative group bg-white/5 backdrop-blur-xl border-2 rounded-[2rem] p-8 text-left transition-all duration-300 overflow-hidden ${selected === 'QUICK' ? 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.3)] scale-105' : 'border-white/10 hover:border-yellow-500/50 hover:bg-white/10'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] group-hover:bg-yellow-500/20 transition-colors pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Zap className="text-yellow-500" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Rápido</h2>
            <div className="flex items-center gap-2 mb-6">
               <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">2-3 Minutos</span>
               <span className="bg-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">8 Atributos</span>
            </div>
            <p className="text-zinc-400 font-bold mb-8 flex-1 text-sm">
              Focado nos atributos essenciais. Os atributos secundários serão calculados de forma inteligente com base nas suas escolhas para garantir um jogador equilibrado.
            </p>
            <div className={`w-full py-4 rounded-xl text-center font-black uppercase tracking-widest text-sm transition-colors ${selected === 'QUICK' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>
              Selecionar
            </div>
          </div>
        </button>

        {/* Modo Completo */}
        <button 
          onClick={() => setSelected('COMPLETE')}
          className={`flex-1 relative group bg-white/5 backdrop-blur-xl border-2 rounded-[2rem] p-8 text-left transition-all duration-300 overflow-hidden ${selected === 'COMPLETE' ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-105' : 'border-white/10 hover:border-blue-500/50 hover:bg-white/10'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Target className="text-blue-500" size={32} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Completo</h2>
            <div className="flex items-center gap-2 mb-6">
               <span className="bg-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">8-10 Minutos</span>
               <span className="bg-white/10 text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">20 Atributos</span>
            </div>
            <p className="text-zinc-400 font-bold mb-8 flex-1 text-sm">
              Controle total sobre o desenvolvimento. Escolha cada detalhe dos atributos técnicos, físicos e mentais para moldar exatamente o jogador que deseja ser.
            </p>
            <div className={`w-full py-4 rounded-xl text-center font-black uppercase tracking-widest text-sm transition-colors ${selected === 'COMPLETE' ? 'bg-blue-500 text-white' : 'bg-white/10 text-white'}`}>
              Selecionar
            </div>
          </div>
        </button>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.5 }}
        disabled={!selected}
        onClick={handleNext}
        className="mt-12 bg-white text-black px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        Continuar
      </motion.button>
    </motion.div>
  );
}
