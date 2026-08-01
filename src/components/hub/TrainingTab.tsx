import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion, AnimatePresence } from 'motion/react';
import { Goal, Zap, Shield, Activity, Target, Dumbbell, HeartPulse, Users, Coffee, Crosshair } from 'lucide-react';
import { TrainingSessionType } from '../../types';
import { XP_PER_ATTRIBUTE_POINT } from '../../core/domain/progressionEngine';

const SESSIONS: { id: TrainingSessionType, label: string, desc: string, icon: any, color: string }[] = [
  { id: 'FINISHING', label: 'Finalização', desc: 'Foco: Chute, Cabeceio', icon: Goal, color: 'text-yellow-500' },
  { id: 'CREATION', label: 'Criação', desc: 'Foco: Passe, Visão', icon: Target, color: 'text-blue-500' },
  { id: 'DRIBBLING', label: 'Drible', desc: 'Foco: Drible, Controle', icon: Zap, color: 'text-purple-500' },
  { id: 'PHYSICAL', label: 'Físico', desc: 'Foco: Físico, Estamina', icon: Dumbbell, color: 'text-orange-500' },
  { id: 'DEFENDING', label: 'Defesa', desc: 'Foco: Defesa, Cabeceio', icon: Shield, color: 'text-green-500' },
  { id: 'SET_PIECES', label: 'Bolas Paradas', desc: 'Foco: Faltas, Pênaltis', icon: Crosshair, color: 'text-indigo-500' },
  { id: 'CHEMISTRY', label: 'Entrosamento', desc: 'Foco: Relações, Passe', icon: Users, color: 'text-pink-500' },
  { id: 'POSITIONAL', label: 'Treino da Posição', desc: 'Foco: Atributos principais', icon: Activity, color: 'text-emerald-500' },
  { id: 'RECOVERY', label: 'Recuperação', desc: 'Recupera energia (Baixa)', icon: HeartPulse, color: 'text-red-400' },
  { id: 'REST', label: 'Descanso Total', desc: 'Recupera energia (Alta)', icon: Coffee, color: 'text-zinc-400' },
];

const INTENSITIES = [
  { id: 'LOW', label: 'Leve', desc: 'Menor risco' },
  { id: 'MEDIUM', label: 'Média', desc: 'Padrão' },
  { id: 'HIGH', label: 'Intensa', desc: 'Maior ganho e risco' },
];

export default function TrainingTab() {
  const { state, dispatch } = useGameEngine();
  const { fitness } = state.player.rpg;
  
  const currentPlan = state.player.trainingPlan || { focus: 'GENERAL' as TrainingSessionType, intensity: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' };
  const [selectedFocus, setSelectedFocus] = useState<TrainingSessionType>(currentPlan.focus);
  const [selectedIntensity, setSelectedIntensity] = useState<'LOW'|'MEDIUM'|'HIGH'>(currentPlan.intensity);

  useEffect(() => {
    dispatch({
      type: 'SET_TRAINING_PLAN',
      payload: { focus: selectedFocus, intensity: selectedIntensity }
    });
  }, [selectedFocus, selectedIntensity, dispatch]);

  const devPoints = state.player.progression?.developmentPoints || {};
  const topStats = Object.entries(devPoints)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
             <h2 className="text-xl font-black uppercase tracking-widest text-white">Planejamento Semanal</h2>
             <p className="text-sm text-zinc-400 font-medium mt-1">
               Defina o foco dos treinos para a próxima semana.
             </p>
          </div>
          
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
            <Activity size={16} className={fitness > 40 ? 'text-green-500' : 'text-red-500'} />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Energia Atual: <span className={fitness > 40 ? 'text-white' : 'text-red-500'}>{Math.round(fitness)}%</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Foco do Treino</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {SESSIONS.map(session => {
                 const Icon = session.icon;
                 const isActive = selectedFocus === session.id;
                 return (
                   <button
                     key={session.id}
                     onClick={() => setSelectedFocus(session.id)}
                     className={`flex flex-col gap-3 p-4 rounded-[1.5rem] border transition-all text-left ${
                       isActive ? 'bg-white/10 border-white/30 scale-[1.02]' : 'bg-black/20 border-white/5 hover:bg-white/5'
                     }`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 ${session.color}`}>
                       <Icon size={20} />
                     </div>
                     <div>
                       <div className="font-bold text-white text-xs uppercase tracking-widest">{session.label}</div>
                       <div className="text-[10px] text-zinc-400 mt-1">{session.desc}</div>
                     </div>
                   </button>
                 )
               })}
            </div>
            
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 pt-4">Intensidade da Carga</h3>
            <div className="grid grid-cols-3 gap-3">
              {INTENSITIES.map(intensity => {
                const isActive = selectedIntensity === intensity.id;
                const isDisabled = selectedFocus === 'REST' || selectedFocus === 'RECOVERY';
                return (
                  <button
                    key={intensity.id}
                    onClick={() => setSelectedIntensity(intensity.id as any)}
                    disabled={isDisabled}
                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-[1rem] border transition-all ${
                      isDisabled ? 'opacity-30 cursor-not-allowed bg-black/20 border-white/5' :
                      isActive ? 'bg-white/10 border-white/30' : 'bg-black/20 border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <div className="font-bold text-white text-xs uppercase tracking-widest">{intensity.label}</div>
                    <div className="text-[10px] text-zinc-400">{intensity.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="bg-black/40 rounded-[1.5rem] border border-white/5 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Progresso Acumulado</h3>
                
                {topStats.length === 0 ? (
                  <div className="text-xs text-zinc-500 italic">Sem progresso registrado ainda. Avance uma semana para começar a treinar.</div>
                ) : (
                  <div className="space-y-4">
                    {topStats.map(([stat, xp]) => {
                       const percentage = Math.min(100, ((xp as number) / XP_PER_ATTRIBUTE_POINT) * 100);
                       return (
                         <div key={stat} className="space-y-2">
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                             <span className="text-white">{stat}</span>
                             <span className="text-zinc-500">{Math.round(percentage)}%</span>
                           </div>
                           <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${percentage}%` }}
                               className="h-full bg-blue-500"
                             />
                           </div>
                         </div>
                       )
                    })}
                  </div>
                )}
             </div>
             
             <div className="bg-black/40 rounded-[1.5rem] border border-white/5 p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Análise do Treino</h3>
                <div className="space-y-3 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Consumo de Energia Estimado</span>
                    <span className="text-white font-bold">
                       {selectedFocus === 'REST' ? '-30%' : selectedFocus === 'RECOVERY' ? '-15%' : 
                        selectedIntensity === 'LOW' ? '10%' : selectedIntensity === 'MEDIUM' ? '20%' : '35%'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risco de Lesão</span>
                    <span className="text-white font-bold">
                       {selectedFocus === 'REST' || selectedFocus === 'RECOVERY' ? 'Nenhum' : 
                        selectedIntensity === 'LOW' ? 'Baixo' : selectedIntensity === 'MEDIUM' ? 'Médio' : 'Alto'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Foco Principal</span>
                    <span className="text-white font-bold uppercase">
                       {SESSIONS.find(s => s.id === selectedFocus)?.label || 'Geral'}
                    </span>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
