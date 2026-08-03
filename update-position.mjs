import fs from 'fs';

const path = 'src/components/creation/CreationPosition.tsx';
let content = `import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { Position } from '../../types';
import { StudioLayout } from './StudioLayout';

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

  const footer = (
    <div className="flex gap-4">
      <button 
        onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_BASIC_INFO' })}
        className="flex-1 bg-zinc-900 border border-white/10 text-white font-bold text-sm py-4 rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest"
      >
        Voltar
      </button>
      <button 
        onClick={handleNext}
        disabled={!position}
        className="flex-[2] bg-yellow-500 text-yellow-950 font-black text-sm py-4 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[0_0_25px_rgba(234,179,8,0.4)]"
      >
        Avançar
      </button>
    </div>
  );

  return (
    <StudioLayout 
      title="Sua Posição" 
      subtitle="Isso definirá seu foco e peso inicial dos atributos."
      footer={footer}
    >
      <div className="space-y-3">
        {POSITIONS.map(pos => (
          <button
            key={pos.id}
            aria-pressed={position === pos.id}
            onClick={() => setPosition(pos.id)}
            className={\`w-full p-5 rounded-2xl border-2 text-left transition-all \${
              position === pos.id 
                ? 'border-yellow-500 bg-yellow-500/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]' 
                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }\`}
          >
            <div className={\`font-black text-lg mb-1 \${position === pos.id ? 'text-yellow-400' : 'text-white'}\`}>{pos.label}</div>
            <div className="text-sm text-zinc-400 font-semibold">{pos.desc}</div>
          </button>
        ))}
      </div>
    </StudioLayout>
  );
}
`;

fs.writeFileSync(path, content);
