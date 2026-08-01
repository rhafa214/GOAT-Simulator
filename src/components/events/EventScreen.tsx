import { GAME_EVENTS } from '../../data/events';
import React, { useEffect, useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { AlertCircle, Camera, Stethoscope, PartyPopper, Dribbble, Loader2 } from 'lucide-react';
import { useAI } from '../../hooks/useAI';

export default function EventScreen() {
  const { state, dispatch } = useGameEngine();
  const eventId = state.narrative.activeEvents[0];
  const event = GAME_EVENTS.find(e => e.id === eventId);
  const { generate, loading } = useAI();
  const [aiText, setAiText] = useState('');

  useEffect(() => {
    if (event && !aiText && !loading) {
      const prompt = `Evento: ${event.title}\nDescrição Base: ${event.description}\nOpções que o jogador terá:\n${event.options.map(o => `- ${o.label}`).join('\n')}\nJogador: ${state.player.name} (${state.player.age} anos, ${state.player.position}, personalidade: ${state.player.personality})`;
      const systemInstruction = event.imageType === 'press' 
        ? "Você é um repórter agressivo buscando cliques. Descreva a situação atual do jogador de forma dramática. Mantenha em exatos 1 parágrafo curto (máximo de 3 linhas), direto ao ponto."
        : "Você é o narrador do jogador. Descreva a situação de forma curta e objetiva. Mantenha em exatos 1 parágrafo curto (máximo de 3 linhas), vá direto ao ponto.";
      
      generate(prompt, systemInstruction).then(res => setAiText(res));
    }
  }, [event, generate, aiText, loading, state.player]);

  if (!event) return null;

  const handleOption = (optionId: string) => {
    dispatch({ type: 'RESOLVE_EVENT', payload: { eventId: event.id, optionId } });
    setAiText(''); // Clear for next event
  };

  const getIcon = () => {
    switch (event.imageType) {
      case 'press': return <Camera className="w-16 h-16 text-blue-500" />;
      case 'injury': return <Stethoscope className="w-16 h-16 text-red-500" />;
      case 'party': return <PartyPopper className="w-16 h-16 text-purple-500" />;
      case 'training': return <Dribbble className="w-16 h-16 text-orange-500" />;
      default: return <AlertCircle className="w-16 h-16 text-yellow-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px]" />

      <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-24 h-24 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-zinc-800">
          {getIcon()}
        </div>
        
        <h2 className="text-4xl font-black mb-6">{event.title}</h2>
        
        <div className="w-full bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 mb-8 min-h-[120px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center text-zinc-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">A IA está escrevendo a narrativa...</p>
            </div>
          ) : (
            <p className="text-lg text-zinc-300 leading-relaxed text-left w-full">
              {aiText || event.description}
            </p>
          )}
        </div>

        <div className="w-full space-y-4">
          {event.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOption(opt.id)}
              className="w-full p-6 bg-zinc-950 border border-zinc-800 hover:border-yellow-500 rounded-2xl text-left transition-all hover:bg-yellow-500/5 group flex flex-col gap-2"
            >
              <div className="font-bold text-xl group-hover:text-yellow-500 transition-colors">
                {opt.label}
              </div>
              {opt.description && (
                <div className="text-sm text-zinc-500">
                  {opt.description}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
