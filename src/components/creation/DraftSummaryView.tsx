import React from 'react';
import { PlayerDNA, TechnicalStat } from '../../types';
import { Trophy, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface DraftSummaryViewProps {
  estimatedOvr: number;
  position: string;
  acquiredDNA: PlayerDNA[];
  stats: Partial<Record<TechnicalStat, number>>;
  onFinish: () => void;
}

export const DraftSummaryView: React.FC<DraftSummaryViewProps> = ({
  estimatedOvr,
  position,
  acquiredDNA,
  stats,
  onFinish
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center text-center animate-fadeIn">
      {/* Top Trophy Badge */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black shadow-[0_0_50px_rgba(234,179,8,0.4)] mb-6">
        <Trophy size={40} className="stroke-[2.5]" />
      </div>

      <span className="text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
        Draft Concluído com Sucesso
      </span>
      <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
        Apresentação do Atleta
      </h1>
      <p className="text-zinc-400 font-bold text-sm max-w-xl mb-8">
        Sua combinação de habilidades e DNA de mestres foi consolidada. Seu jogador possui atributos únicos prontos para entrar em campo.
      </p>

      {/* Main Stats Grid Card */}
      <div className="w-full bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Rating Column */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 pb-6 md:pb-0 md:pr-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-4xl shadow-xl mb-3">
            {estimatedOvr}
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
            Overall Inicial
          </span>
          <span className="text-sm font-extrabold text-amber-400 mt-1">
            {position || 'Atacante (ST)'}
          </span>
        </div>

        {/* DNA Column */}
        <div className="border-b md:border-b-0 md:border-r border-zinc-800 pb-6 md:pb-0 md:pr-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-1.5">
            <Sparkles size={14} className="text-purple-400" />
            <span>DNA de Ídolo ({acquiredDNA.length})</span>
          </h4>
          {acquiredDNA.length === 0 ? (
            <p className="text-xs text-zinc-500 font-bold">Sem DNA especial acumulado.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {acquiredDNA.map((dna, i) => (
                <div key={i} className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2">
                  <Zap size={13} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="font-black leading-tight">{dna.name}</div>
                    <div className="text-[10px] text-purple-300/80 font-normal">{dna.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Stats Column */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 mb-3 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Atributos Base</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(stats).slice(0, 8).map(([k, v]) => (
              <div key={k} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl flex justify-between items-center">
                <span className="font-black text-zinc-400">{k}</span>
                <span className="font-black text-amber-400">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finish & Advance Button */}
      <button
        onClick={onFinish}
        className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
      >
        <span>Avançar para Escolha de Clube</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
};
