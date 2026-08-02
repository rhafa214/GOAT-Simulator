import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Club } from '../../types';
import { STARTER_CLUBS } from '../../data/database';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function CreationDraftClub() {
  const { dispatch } = useGameEngine();
  const [drafting, setDrafting] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleDraft = () => {
    setDrafting(true);
    setTimeout(() => {
      const club = STARTER_CLUBS[Math.floor(Math.random() * STARTER_CLUBS.length)];
      setSelectedClub(club);
      setDrafting(false);
    }, 2000);
  };

  const handleStartCareer = () => {
    if (selectedClub) {
      dispatch({ type: 'SETUP_CAREER', payload: { club: selectedClub } });
    }
  };

  const handleConfirmExit = () => {
    dispatch({ type: 'CHANGE_PHASE', payload: 'MAIN_MENU' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl w-full text-center relative"
    >
      {/* Top Back / Cancel Creation Button */}
      <div className="flex justify-start mb-6">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={16} /> Cancelar Criação
        </button>
      </div>

      <h2 className="text-4xl font-black mb-4">Sorteio de Clube</h2>
      <p className="text-zinc-400 mb-12 text-lg">
        Sua jornada começa agora. Todo grande jogador começou em algum lugar pequeno.
      </p>

      {!selectedClub && !drafting && (
        <button 
          onClick={handleDraft}
          className="bg-yellow-500 text-yellow-950 font-black text-2xl px-12 py-6 rounded-2xl hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(234,179,8,0.3)]"
        >
          Sortear Primeiro Clube
        </button>
      )}

      {drafting && (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-2xl font-bold text-yellow-500">Procurando propostas...</p>
        </div>
      )}

      {selectedClub && !drafting && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 border border-zinc-800 p-12 rounded-3xl backdrop-blur-md flex flex-col items-center"
        >
          <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-4">Contrato Assinado</div>
          
          {selectedClub.logo && (
             <img src={selectedClub.logo} alt={selectedClub.name} className="w-32 h-32 object-contain mb-6 drop-shadow-2xl" referrerPolicy="no-referrer" />
          )}

          <h3 className="text-5xl font-black mb-2">{selectedClub.name}</h3>
          <p className="text-xl text-zinc-400 mb-8">{selectedClub.league}</p>

          <button 
            onClick={handleStartCareer}
            className="w-full bg-yellow-500 text-yellow-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Iniciar Carreira
          </button>
        </motion.div>
      )}

      {/* CONFIRMATION MODAL */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl w-fit mx-auto">
              <ShieldAlert size={28} />
            </div>
            <h3 className="text-lg font-black uppercase text-zinc-100">Cancelar Criação?</h3>
            <p className="text-xs text-zinc-400">
              Todo o progresso de atributos, nome e personalidade deste jogador será descartado.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmExit}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition-colors"
              >
                Sim, Sair
              </button>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-extrabold text-xs rounded-xl transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
