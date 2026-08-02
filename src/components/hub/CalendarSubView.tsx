import React from 'react';
import { useCareer, useNextMatch } from '../../engine/selectors';
import { GoatCard, GoatBadge, GoatButton } from '../ui/goat';
import { Calendar, Shield, Play, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';

export default function CalendarSubView() {
  const career = useCareer();
  const nextMatch = useNextMatch();
  const simulation = useSimulation();

  const currentWeek = career.week || 1;
  const totalWeeks = 52;

  // Generate 8 sample schedule weeks around current week
  const scheduleWeeks = Array.from({ length: 8 }, (_, i) => {
    const weekNum = currentWeek + i;
    const isCurrent = i === 0;
    const isPast = i < 0;

    return {
      week: weekNum,
      isCurrent,
      isPast,
      competition: weekNum % 4 === 0 ? 'Copa do Brasil' : 'Brasileirão Série A',
      opponent: `Adversário Sem. ${weekNum}`,
      isHome: weekNum % 2 === 0
    };
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Calendar className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Cronograma da Temporada</span>
            <h2 className="text-2xl font-black uppercase text-zinc-100">Calendário de Partidas</h2>
            <p className="text-xs text-zinc-400">Planeje seus jogos, descansos e janelas de transferência semana a semana.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GoatButton
            variant="primary"
            size="md"
            leftIcon={<Play className="h-4 w-4 fill-current" />}
            onClick={() => simulation.startSimulation({ mode: 'NEXT_MATCH' })}
          >
            Avançar Próxima Semana
          </GoatButton>
        </div>
      </div>

      {/* TIMELINE LIST */}
      <GoatCard variant="mineral" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Semanas da Temporada ({currentWeek} de {totalWeeks})
          </h3>
          <GoatBadge variant="gold" size="sm">Semana Atual: {currentWeek}</GoatBadge>
        </div>

        <div className="space-y-3">
          {scheduleWeeks.map((item) => (
            <div
              key={item.week}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                item.isCurrent
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                  : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-xs ${
                  item.isCurrent ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  Sem. {item.week}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-amber-400">{item.competition}</span>
                    <span className="text-[10px] text-zinc-500 font-bold">• {item.isHome ? 'MANDANTE' : 'VISITANTE'}</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100">
                    {item.isCurrent && nextMatch ? nextMatch.opponent : item.opponent}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.isCurrent ? (
                  <GoatBadge variant="gold" size="sm">
                    Próximo Desafio
                  </GoatBadge>
                ) : (
                  <span className="text-xs text-zinc-500 font-semibold">Agendado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </GoatCard>

    </div>
  );
}
