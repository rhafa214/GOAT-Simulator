import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Goal, Zap, Shield, Activity, Target } from 'lucide-react';

export default function TrainingTab() {
  const { state, dispatch } = useGameEngine();
  const { fitness } = state.player.rpg;
  
  const handleTrain = (type: 'SHO' | 'PAS' | 'DRI' | 'DEF') => {
     if (fitness < 20) return;
     dispatch({ type: 'TRAIN_ATTRIBUTE', payload: type });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px]" />
         
         <div className="flex justify-between items-center mb-8 relative z-10">
            <h2 className="text-xl font-black uppercase tracking-widest text-white">Centro de Treinamento</h2>
            
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
               <Activity size={16} className={fitness > 40 ? 'text-green-500' : 'text-red-500'} />
               <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Energia: <span className={fitness > 40 ? 'text-white' : 'text-red-500'}>{fitness}%</span>
               </span>
            </div>
         </div>
         
         <p className="text-sm text-zinc-400 font-medium mb-8 relative z-10">
            Foque seu treinamento em fundamentos específicos. Cada sessão consome <span className="text-white font-bold">20% de energia</span>. Jogadores mais jovens (Sub-23) evoluem mais rápido.
         </p>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <TrainingCard 
               title="Finalização"
               desc="Melhora Chute e Cabeceio"
               icon={<Goal size={24} />}
               color="text-yellow-500"
               bg="bg-yellow-500/20"
               border="border-yellow-500/20"
               canTrain={fitness >= 20}
               onClick={() => handleTrain('SHO')}
            />
            
            <TrainingCard 
               title="Criação"
               desc="Melhora Passe e Visão"
               icon={<Target size={24} />}
               color="text-blue-500"
               bg="bg-blue-500/20"
               border="border-blue-500/20"
               canTrain={fitness >= 20}
               onClick={() => handleTrain('PAS')}
            />
            
            <TrainingCard 
               title="Controle"
               desc="Melhora Drible e Ritmo"
               icon={<Zap size={24} />}
               color="text-purple-500"
               bg="bg-purple-500/20"
               border="border-purple-500/20"
               canTrain={fitness >= 20}
               onClick={() => handleTrain('DRI')}
            />
            
            <TrainingCard 
               title="Defensivo"
               desc="Melhora Defesa e Físico"
               icon={<Shield size={24} />}
               color="text-green-500"
               bg="bg-green-500/20"
               border="border-green-500/20"
               canTrain={fitness >= 20}
               onClick={() => handleTrain('DEF')}
            />
         </div>
      </div>
    </div>
  );
}

function TrainingCard({ title, desc, icon, color, bg, border, canTrain, onClick }: any) {
   return (
      <button 
         onClick={onClick}
         disabled={!canTrain}
         className={`group relative overflow-hidden bg-black/40 backdrop-blur-md border ${canTrain ? 'border-white/10 hover:border-white/30' : 'border-red-500/30 opacity-50 cursor-not-allowed'} rounded-[1.5rem] p-6 flex items-center justify-between transition-all`}
      >
         <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color} ${border} border`}>
               {icon}
            </div>
            <div className="text-left">
               <div className="font-black text-white tracking-wide uppercase text-sm">{title}</div>
               <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{desc}</div>
            </div>
         </div>
         
         <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">
               Treinar
            </div>
         </div>
      </button>
   )
}