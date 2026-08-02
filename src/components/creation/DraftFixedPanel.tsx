import React from 'react';
import { PlayerDNA, TechnicalStat } from '../../types';
import { History, Sparkles, Trophy, Shield, Activity } from 'lucide-react';

interface DraftFixedPanelProps {
  currentRound: number;
  totalRounds: number;
  estimatedOvr: number;
  position: string;
  acquiredDNA: PlayerDNA[];
  stats: Partial<Record<TechnicalStat, number>>;
  onOpenReview: () => void;
}

export const DraftFixedPanel: React.FC<DraftFixedPanelProps> = ({
  currentRound,
  totalRounds,
  estimatedOvr,
  position,
  acquiredDNA,
  stats,
  onOpenReview
}) => {
  const progressPercent = Math.min(100, Math.round((currentRound / totalRounds) * 100));

  return (
    <aside
      aria-label="Painel de Status do Draft"
      className="w-full lg:w-80 shrink-0 bg-zinc-950/90 border-t lg:border-t-0 lg:border-l border-zinc-800 p-5 flex flex-col justify-between overflow-y-auto max-h-[90vh] rounded-2xl lg:rounded-none shadow-2xl backdrop-blur-xl"
    >
      <div className="space-y-6">
        {/* Round Progress Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-2">
            <span className="text-zinc-400">Progresso do Draft</span>
            <span className="text-amber-400">
              Rodada {currentRound} de {totalRounds}
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Estimated Overall & Position Badge */}
        <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-2xl shadow-lg shrink-0">
            {estimatedOvr}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
              OVR Estimado
            </span>
            <h4 className="text-base font-black text-white tracking-wide">
              {position || 'Atacante (ST)'}
            </h4>
            <span className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1 mt-0.5">
              <Trophy size={12} />
              <span>Qualidade de Elite</span>
            </span>
          </div>
        </div>

        {/* Acquired Player DNA Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-400" />
              <span>Player DNA ({acquiredDNA.length})</span>
            </h4>
          </div>

          {acquiredDNA.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-zinc-800 text-center text-xs font-bold text-zinc-500">
              Nenhum traço de DNA coletado ainda
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
              {acquiredDNA.map((dna, idx) => (
                <div
                  key={`${dna.id}-${idx}`}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles size={12} className="text-purple-400" />
                  <span>{dna.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Attributes Overview */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-1.5">
            <Activity size={14} className="text-amber-400" />
            <span>Atributos Selecionados</span>
          </h4>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {Object.entries(stats).map(([statKey, val]) => (
              <div
                key={statKey}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs"
              >
                <span className="font-black text-zinc-400 uppercase tracking-widest">
                  {statKey}
                </span>
                <span className="font-black text-amber-400 text-sm">{val}</span>
              </div>
            ))}
            {Object.keys(stats).length === 0 && (
              <div className="text-xs font-bold text-zinc-500 text-center py-2">
                Aguardando primeira escolha...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Completed Choices Button */}
      <div className="pt-4 border-t border-zinc-800/80 mt-4">
        <button
          onClick={onOpenReview}
          className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <History size={15} className="text-amber-400" />
          <span>Revisar Escolhas Concluídas (R)</span>
        </button>
      </div>
    </aside>
  );
};
