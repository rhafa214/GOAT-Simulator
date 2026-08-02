import React from 'react';
import { Target, Heart, Award, Flame, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { MatchObjectives } from './matchContextDetector';
import { GoatBadge, GoatCard } from '../ui/goat';

interface MatchObjectivesCardProps {
  objectives: MatchObjectives[];
  fitness: number;
  morale: number;
  recentForm: ('V' | 'E' | 'D')[];
  potentialRecords: string[];
  narrativeContext: string;
}

export const MatchObjectivesCard: React.FC<MatchObjectivesCardProps> = ({
  objectives,
  fitness,
  morale,
  recentForm,
  potentialRecords,
  narrativeContext,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Narrative Context Card */}
      <GoatCard variant="gold" className="p-5 border-amber-500/40 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Contexto do Confronto
            </h4>
            <p className="text-xs text-zinc-200 font-medium leading-relaxed">
              {narrativeContext}
            </p>
          </div>
        </div>
      </GoatCard>

      {/* Fitness & Morale Status */}
      <div className="grid grid-cols-2 gap-3">
        {/* Fitness Bar */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase text-zinc-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Preparo Físico
            </span>
            <span className="font-black text-white">{fitness}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full transition-all duration-500 ${
                fitness >= 80 ? 'bg-emerald-500' : fitness >= 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${fitness}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-zinc-500">
            {fitness >= 80 ? '100% Pronto para 90min' : 'Atenção com a fadiga'}
          </span>
        </div>

        {/* Morale Bar */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase text-zinc-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Moral do Atleta
            </span>
            <span className="font-black text-amber-400">{morale}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${morale}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-zinc-500">
            {morale >= 75 ? 'Confiança Elevada' : 'Foco em Recuperação'}
          </span>
        </div>
      </div>

      {/* Match Objectives List */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              Objetivos do Treinador
            </h4>
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Metas do Jogo</span>
        </div>

        <div className="space-y-3">
          {objectives.map(obj => (
            <div
              key={obj.id}
              className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white">{obj.title}</h5>
                  <p className="text-[11px] text-zinc-400">{obj.description}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  +{obj.rewardFame} Fama
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Records & Recent Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Recent Form */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-zinc-400 block mb-2">
            Forma Recente (Últimos 5 Jogos)
          </span>
          <div className="flex items-center gap-1.5">
            {recentForm.map((result, idx) => (
              <span
                key={idx}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border ${
                  result === 'V'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : result === 'E'
                    ? 'bg-zinc-700/30 border-zinc-500/30 text-zinc-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                }`}
              >
                {result}
              </span>
            ))}
          </div>
        </div>

        {/* Potential Records Badge */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1 mb-1">
            <Award className="w-3.5 h-3.5" /> Recordes em Potencial
          </span>
          <p className="text-xs text-zinc-300 font-semibold line-clamp-2">
            {potentialRecords.length > 0
              ? potentialRecords[0]
              : 'Disputa padrão valendo 3 pontos na tabela.'}
          </p>
        </div>
      </div>
    </div>
  );
};
