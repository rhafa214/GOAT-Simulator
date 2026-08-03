import fs from 'fs';

const path = 'src/components/creation/CreationBasicInfo.tsx';
let content = `import React, { useState } from 'react';
import { usePlayer } from '../../engine/selectors';
import { useGameActions } from '../../engine/actions';
import { StudioLayout } from './StudioLayout';

export default function CreationBasicInfo() {
  const player = usePlayer();
  const actions = useGameActions();
  
  const [name, setName] = useState(player.name || '');
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

  const footer = (
    <button 
      onClick={handleNext}
      disabled={!name.trim()}
      className="w-full bg-yellow-500 text-yellow-950 font-black text-lg py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
    >
      Avançar
    </button>
  );

  return (
    <StudioLayout 
      title="Quem é você?" 
      subtitle="O primeiro passo de uma lenda começa com o nome."
      footer={footer}
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 shadow-inner">
        <div className="space-y-3">
          <label htmlFor="playerNameInput" className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] block">Nome do Jogador</label>
          <input 
            id="playerNameInput"
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            maxLength={18}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-bold outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-white/20"
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="playerNationalitySelect" className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] block">Nacionalidade</label>
          <select 
            id="playerNationalitySelect"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-bold outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all appearance-none cursor-pointer"
          >
            {NATIONS.map(n => (
              <option key={n.code} value={n.code} className="bg-zinc-900">{n.name}</option>
            ))}
          </select>
        </div>
      </div>
    </StudioLayout>
  );
}
`;

fs.writeFileSync(path, content);
