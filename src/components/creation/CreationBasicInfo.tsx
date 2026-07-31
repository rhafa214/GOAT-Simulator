import React, { useState } from 'react';
import { usePlayer } from '../../engine/selectors';
import { useGameActions } from '../../engine/actions';
import { motion } from 'motion/react';

export default function CreationBasicInfo() {
  const player = usePlayer();
  const actions = useGameActions();
  const [name, setName] = useState(player.name);
  const [nationality, setNationality] = useState(player.nationality || 'BR');

  const NATIONS = [
    { code: 'BR', name: 'Brasil' },
    { code: 'AR', name: 'Argentina' },
    { code: 'FR', name: 'França' },
    { code: 'EN', name: 'Inglaterra' },
    { code: 'ES', name: 'Espanha' },
    { code: 'IT', name: 'Itália' },
    { code: 'PT', name: 'Portugal' },
    { code: 'DE', name: 'Alemanha' }
  ];

  const handleNext = () => {
    if (!name.trim()) return;
    actions.initializePlayer({ name, nationality });
    actions.advancePhase('CREATION_POSITION');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black mb-2">Quem é você?</h2>
        <p className="text-zinc-400">O primeiro passo de uma lenda começa com o nome.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs text-zinc-400 font-bold uppercase block mb-2">Nome do Jogador</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            maxLength={18}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-lg outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-zinc-400 font-bold uppercase block mb-2">Nacionalidade</label>
          <select 
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-4 text-lg outline-none focus:border-yellow-500 transition-colors appearance-none"
          >
            {NATIONS.map(n => (
              <option key={n.code} value={n.code}>{n.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleNext}
          disabled={!name.trim()}
          className="w-full bg-yellow-500 text-yellow-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          Avançar
        </button>
      </div>
    </motion.div>
  );
}
