import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
    >
      <div className="text-center mb-6 shrink-0">
        <h2 className="text-3xl font-black mb-2">Personalidade</h2>
        <p className="text-zinc-400">Suas escolhas moldam seu destino e a forma como o mundo do futebol reage a você.</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TRAITS.map(trait => (
            <button
              key={trait.id}
              onClick={() => setPersonality(trait.id)}
              className={`w-full p-4 rounded-xl border-2 text-left flex items-start gap-4 transition-all ${
                personality === trait.id 
                  ? 'border-yellow-500 bg-yellow-500/10' 
                  : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
              }`}
            >
              <div className="text-4xl mt-1">{trait.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-white mb-1">{trait.label}</div>
                <div className="text-sm text-zinc-400 mb-2 leading-snug">{trait.desc}</div>
                <div className="text-xs font-mono font-bold text-yellow-500/80 bg-black/40 px-2 py-1 rounded inline-block">
                  {trait.impacts}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4 shrink-0 mt-2">
        <button 
          onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_ATTRIBUTES' })}
          className="flex-1 bg-zinc-800 text-zinc-300 font-bold text-lg py-4 rounded-xl hover:bg-zinc-700 transition-colors"
        >
          Voltar
        </button>
        <button 
          onClick={handleNext}
          disabled={!personality}
          className="flex-1 bg-yellow-500 text-yellow-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Concluir Criação
        </button>
      </div>
    </motion.div>
  );
}
