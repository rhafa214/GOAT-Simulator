import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Position } from '../../types';

export default function CreationPosition() {
  const { state, dispatch } = useGameEngine();
  const [position, setPosition] = useState<Position | ''>(state.player.position || '');

  const POSITIONS: { id: Position; label: string; desc: string }[] = [
    { id: 'ST', label: 'Atacante (ST)', desc: 'Foco finalização.' },
    { id: 'LW', label: 'Ponta (LW)', desc: 'Velocidade e drible.' },
    { id: 'CAM', label: 'Meia Atacante (CAM)', desc: 'Visão e criação.' },
    { id: 'CM', label: 'Meia Central (CM)', desc: 'Equilíbrio total.' },
    { id: 'CB', label: 'Zagueiro (CB)', desc: 'Força e desarme.' }
  ];

  const handleNext = () => {
    if (!position) return;
    dispatch({ type: 'INITIALIZE_PLAYER', payload: { position } });
    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_APPEARANCE' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2">Sua Posição</h2>
        <p className="text-zinc-400">Isso definirá seu foco e peso inicial dos atributos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {POSITIONS.map(pos => (
          <button
            key={pos.id}
            onClick={() => setPosition(pos.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              position === pos.id 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
            }`}
          >
            <div className="font-bold text-lg text-white mb-1">{pos.label}</div>
            <div className="text-sm text-zinc-400">{pos.desc}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-4 gap-4">
        <button 
          onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_BASIC_INFO' })}
          className="flex-1 bg-zinc-800 text-zinc-300 font-bold text-lg py-4 rounded-xl hover:bg-zinc-700 transition-colors"
        >
          Voltar
        </button>
        <button 
          onClick={handleNext}
          disabled={!position}
          className="flex-1 bg-yellow-500 text-yellow-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Avançar
        </button>
      </div>
    </motion.div>
  );
}
