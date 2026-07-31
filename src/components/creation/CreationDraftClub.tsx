import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Club } from '../../types';
import { MOCK_STARTER_CLUBS } from '../../data/database';

export default function CreationDraftClub() {
  const { dispatch } = useGameEngine();
  const [drafting, setDrafting] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleDraft = () => {
    setDrafting(true);
    setTimeout(() => {
      const club = MOCK_STARTER_CLUBS[Math.floor(Math.random() * MOCK_STARTER_CLUBS.length)];
      setSelectedClub(club);
      setDrafting(false);
    }, 2000);
  };

  const handleStartCareer = () => {
    if (selectedClub) {
      dispatch({ type: 'SETUP_CAREER', payload: { club: selectedClub } });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl w-full text-center"
    >
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
    </motion.div>
  );
}
