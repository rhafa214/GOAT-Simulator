import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Play, Goal, ArrowUpRight, ActivitySquare } from 'lucide-react';
import { PlayerAvatar } from '../ui/PlayerAvatar';

export default function PostMatchScreen() {
  const { state, dispatch } = useGameEngine();
  const lastMatch = state.career.matches[0];
  const { player, career } = state;

  if (!lastMatch) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-[0.2em] mb-2 z-10 flex items-center gap-2">
        <Trophy size={16} /> Relatório da Partida
      </h2>
      <div className="flex items-center justify-center gap-6 mb-12 z-10 w-full px-4">
        <div className="flex flex-col items-center gap-4 w-2/5">
          {lastMatch.home ? (
            career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          ) : (
            lastMatch.opponentLogo ? <img src={lastMatch.opponentLogo} alt="Home" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          )}
          <h3 className="text-2xl md:text-4xl font-black drop-shadow-lg text-center leading-tight">
            {lastMatch.home ? career.currentClub?.name : lastMatch.opponent} 
          </h3>
        </div>
        
        <div className="text-zinc-600 font-serif italic text-2xl md:text-4xl w-1/5 text-center">vs</div> 
        
        <div className="flex flex-col items-center gap-4 w-2/5">
          {!lastMatch.home ? (
            career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Away" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          ) : (
            lastMatch.opponentLogo ? <img src={lastMatch.opponentLogo} alt="Away" className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" /> : null
          )}
          <h3 className="text-2xl md:text-4xl font-black drop-shadow-lg text-center leading-tight">
            {!lastMatch.home ? career.currentClub?.name : lastMatch.opponent}
          </h3>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-12">
         {/* Rating */}
         <div className="bg-black/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner">
            <div className={`text-6xl font-black mb-2 drop-shadow-md ${lastMatch.rating >= 8 ? 'text-yellow-500' : lastMatch.rating >= 6 ? 'text-zinc-300' : 'text-red-500'}`}>
               {lastMatch.rating.toFixed(1)}
            </div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nota da Partida</div>
         </div>

         {/* Goals/Assists */}
         <div className="bg-black/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
            <div className="flex w-full justify-around mb-2">
               <div className="text-center">
                  <div className="text-5xl font-black text-white">{lastMatch.goals}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gols</div>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-center">
                  <div className="text-5xl font-black text-white">{lastMatch.assists}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Assist.</div>
               </div>
            </div>
         </div>

         {/* MOTM / Events */}
         <div className="bg-black/50 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner">
            {lastMatch.motm ? (
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-3">
                     <Star size={32} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-sm font-bold text-yellow-500 uppercase tracking-widest text-center">Homem<br/>do Jogo</div>
               </div>
            ) : lastMatch.injured ? (
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                     <ActivitySquare size={32} className="text-red-500" />
                  </div>
                  <div className="text-sm font-bold text-red-500 uppercase tracking-widest text-center">Lesionado</div>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-3">
                     <Play size={24} className="text-zinc-500" />
                  </div>
                  <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">{lastMatch.minutesPlayed}'<br/>Jogados</div>
               </div>
            )}
         </div>
      </div>

      <button 
        onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' })}
        className="w-full md:w-auto px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-3 relative z-10"
      >
        Continuar Carreira <ArrowRight size={20} />
      </button>
    </motion.div>
  );
}