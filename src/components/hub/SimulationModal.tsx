import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SimulationResult, SimulationMode } from '../../core/domain/simulationEngine';
import { Calendar, AlertTriangle, CheckCircle, Clock, FastForward, Activity, X } from 'lucide-react';
import { GameState } from '../../types';

interface SimulationModalProps {
  isOpen: boolean;
  isSimulating: boolean;
  progress: number;
  result: SimulationResult | null;
  targetMode: string;
  interimState: GameState | null;
  onCancel: () => void;
  onApply: () => void;
}

const stopReasonLabels: Record<string, { title: string; type: 'success' | 'warning' | 'error' | 'info'; icon: any }> = {
  REACHED_TARGET: { title: 'Simulação Concluída', type: 'success', icon: CheckCircle },
  FINAL_MATCH: { title: 'Final de Campeonato!', type: 'warning', icon: TrophyIcon },
  HIGH_IMPORTANCE_MATCH: { title: 'Partida Importante!', type: 'warning', icon: AlertTriangle },
  TRANSFER_OFFER: { title: 'Proposta de Transferência!', type: 'info', icon: FastForward },
  URGENT_EVENT: { title: 'Evento Urgente!', type: 'info', icon: AlertTriangle },
  SEVERE_INJURY: { title: 'Lesão Grave!', type: 'error', icon: Activity },
  NATIONAL_CALL_UP: { title: 'Convocação para a Seleção!', type: 'success', icon: CheckCircle },
  IMPORTANT_AWARD: { title: 'Premiação Importante!', type: 'success', icon: CheckCircle },
  RELEVANT_RECORD: { title: 'Recorde Quebrado!', type: 'success', icon: CheckCircle },
  END_OF_SEASON: { title: 'Fim de Temporada!', type: 'info', icon: Calendar },
  CANCELLED: { title: 'Simulação Cancelada', type: 'info', icon: X },
  MAX_ITERATIONS_REACHED: { title: 'Limite de Simulação Atingido', type: 'warning', icon: Clock }
};

function TrophyIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/>
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z"/>
    </svg>
  );
}

export function SimulationModal({
  isOpen,
  isSimulating,
  progress,
  result,
  targetMode,
  interimState,
  onCancel,
  onApply
}: SimulationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#1A1C23] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        >
          {isSimulating ? (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Simulando...</h3>
              <p className="text-sm text-zinc-400 mb-8">
                Avançando no tempo ({targetMode.replace('_', ' ').toLowerCase()})
              </p>
              
              {interimState && (
                <div className="text-xs text-zinc-500 mb-4 uppercase tracking-wider font-bold">
                  Semana {interimState.career.week} - {interimState.career.year}
                </div>
              )}

              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden mb-8 border border-white/5">
                <motion.div 
                  className="h-full bg-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <button
                onClick={onCancel}
                className="px-6 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium transition-colors text-sm"
              >
                Cancelar Simulação
              </button>
            </div>
          ) : result ? (
            <div className="p-8 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                {(() => {
                  const Info = stopReasonLabels[result.stopReason] || stopReasonLabels.URGENT_EVENT;
                  const Icon = Info.icon;
                  const colors = {
                    success: 'text-green-400 bg-green-400/20',
                    warning: 'text-yellow-400 bg-yellow-400/20',
                    error: 'text-red-400 bg-red-400/20',
                    info: 'text-indigo-400 bg-indigo-400/20'
                  };
                  return (
                    <>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${colors[Info.type]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{Info.title}</h3>
                        <p className="text-xs text-zinc-400">
                          Parada na Semana {result.finalState.career.week}, {result.finalState.career.year}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mb-1">SEMANAS</div>
                  <div className="text-xl font-bold text-white">{result.summary.weeksSimulated}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mb-1">JOGOS</div>
                  <div className="text-xl font-bold text-white">{result.summary.matchesPlayed}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mb-1">GOLS</div>
                  <div className="text-xl font-bold text-green-400">{result.summary.goalsScored}</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] text-zinc-500 font-bold tracking-wider mb-1">EVENTOS</div>
                  <div className="text-xl font-bold text-yellow-400">{result.summary.eventsTriggered}</div>
                </div>
              </div>

              <button
                onClick={onApply}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
              >
                Continuar
              </button>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
