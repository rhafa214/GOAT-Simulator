import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { StudioLayout } from './StudioLayout';
import { PersonalityTrait } from '../../types';

export default function CreationPersonality() {
  const { state, dispatch } = useGameEngine();
  const [personality, setPersonality] = useState<PersonalityTrait | ''>(state.player.personality || '');

  const TRAITS: { id: PersonalityTrait; label: string; desc: string; icon: string; impacts: string }[] = [
    { id: 'HUMBLE', label: 'Humilde', desc: 'Foco no trabalho duro. Ganha o respeito do treinador e elenco mais facilmente.', icon: '🙏', impacts: 'Treinador ++ | Elenco ++ | Imprensa =' },
    { id: 'ARROGANT', label: 'Marrento', desc: 'Autoestima inabalável. Atrai a mídia, mas pode rachar o vestiário.', icon: '👑', impacts: 'Imprensa ++ | Fama ++ | Elenco --' },
    { id: 'LEADER', label: 'Líder', desc: 'Exemplo em campo. Essencial para unir o time em momentos difíceis.', icon: '🤝', impacts: 'Elenco ++ | Torcida + | Treinador +' },
    { id: 'MERCENARY', label: 'Mercenário', desc: 'Foco financeiro. Consegue melhores contratos e patrocínios.', icon: '💰', impacts: 'Finanças ++ | Torcida -- | Diretoria -' },
    { id: 'HOMEBODY', label: 'Caseiro', desc: 'Recuperação física acelerada e evita escândalos. Porém, atrai menos mídia.', icon: '🏠', impacts: 'Físico ++ | Fama -- | Treinador +' },
    { id: 'PARTY_ANIMAL', label: 'Baladeiro', desc: 'Rei das festas. Muitos patrocínios de lifestyle, mas o físico sofre.', icon: '🕺', impacts: 'Fama ++ | Físico -- | Treinador --' },
    { id: 'PROFESSIONAL', label: 'Profissional', desc: 'Evolução constante nos treinos. Nunca reclama de estar no banco.', icon: '🎯', impacts: 'Atributos ++ | Treinador ++ | Fama =' },
    { id: 'TEMPERAMENTAL', label: 'Temperamental', desc: 'Pode brilhar ou ser expulso. Torcida adora, treinadores odeiam.', icon: '🌋', impacts: 'Torcida ++ | Cartões ++ | Treinador --' },
    { id: 'CHARISMATIC', label: 'Carismático', desc: 'O queridinho da torcida e da imprensa. Patrocínios vêm fácil.', icon: '✨', impacts: 'Torcida ++ | Imprensa ++ | Finanças +' },
    { id: 'INTROVERTED', label: 'Introvertido', desc: 'Silencioso, focado no próprio desempenho. Pouco apelo de marketing.', icon: '😶', impacts: 'Atributos + | Imprensa -- | Finanças -' },
  ];

  const handleNext = () => {
    if (!personality) return;
    dispatch({ type: 'INITIALIZE_PLAYER', payload: { personality } });
    dispatch({ type: 'CHANGE_PHASE', payload: 'DRAFT_CLUB' });
  };

    const footer = (
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
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
              personality === trait.id 
                ? 'border-yellow-500 bg-yellow-500/10 shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]' 
                : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{trait.icon}</span>
              <span className={`font-black text-lg ${personality === trait.id ? 'text-yellow-400' : 'text-white'}`}>{trait.label}</span>
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
