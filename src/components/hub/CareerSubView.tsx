import React from 'react';
import { useCareer, usePlayer, useFinances } from '../../engine/selectors';
import { GoatCard, GoatBadge, GoatButton } from '../ui/goat';
import { Briefcase, Award, Shield, DollarSign, Calendar, TrendingUp, UserCheck, Star } from 'lucide-react';

export default function CareerSubView() {
  const career = useCareer();
  const player = usePlayer();
  const finances = useFinances();

  const contract = (career.contract || {
    weeklySalary: career.currentClub?.baseSalary || 10000,
    yearsRemaining: 3,
    releaseClause: (career.currentClub?.baseSalary || 10000) * 50,
    role: 'Titular Incontestável'
  }) as any;

  const agentSkill = career.agent?.negotiationSkill || 65;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Briefcase className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Gestão Profissional</span>
            <h2 className="text-2xl font-black uppercase text-zinc-100">Contrato & Agente</h2>
            <p className="text-xs text-zinc-400">Acompanhe seu vínculo atual, valor de mercado e reputação no meio do futebol.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GoatBadge variant="gold" size="lg">
            Temp. {career.season || 1} • Ano {career.year || 2026}
          </GoatBadge>
        </div>
      </div>

      {/* CONTRACT & AGENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CONTRACT DETAILS CARD (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <GoatCard variant="gold" glow className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Contrato Profissional Vigente
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 block">Clube Empregador</span>
                  <span className="text-base font-black text-zinc-100">{career.currentClub?.name || 'Sem Clube'}</span>
                </div>
                <GoatBadge variant="neutral" size="sm">
                  {career.currentClub?.league || 'Divisão Principal'}
                </GoatBadge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Salário Semanal</span>
                  <span className="text-xl font-black text-emerald-400">
                    €{(contract.weeklySalary || 10000).toLocaleString()}
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Duração Restante</span>
                  <span className="text-xl font-black text-zinc-100">
                    {contract.yearsRemaining} Anos
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Multa Rescisória</span>
                  <span className="text-base font-black text-amber-400">
                    €{(contract.releaseClause || 5000000).toLocaleString()}
                  </span>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Papel na Equipe</span>
                  <span className="text-base font-bold text-zinc-200">
                    {contract.role || 'Titular'}
                  </span>
                </div>
              </div>
            </div>
          </GoatCard>

          {/* FINANCIAL SUMMARY */}
          <GoatCard variant="mineral" className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              Patrimônio & Finanças
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Saldo em Conta</span>
                <span className="text-2xl font-black text-emerald-400">
                  €{(finances?.balance || 50000).toLocaleString()}
                </span>
              </div>

              <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-500 uppercase block">Patrocínios Ativos</span>
                <span className="text-2xl font-black text-amber-400">
                  {finances?.sponsors?.length || 1} Marca(s)
                </span>
              </div>
            </div>
          </GoatCard>
        </div>

        {/* AGENT & REPUTATION (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GoatCard variant="mineral" className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-amber-400" />
              Empresário / Agente Esportivo
            </h3>

            <div className="space-y-4">
              <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400">
                  AG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Jorge Mendes Jr.</h4>
                  <p className="text-xs text-zinc-400">Agente Licenciado FIFA</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-zinc-400">Poder de Negociação</span>
                  <span className="text-amber-400">{agentSkill}/100</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-amber-500" style={{ width: `${agentSkill}%` }} />
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                Seu agente busca constantemente as melhores propostas no mercado e negocia aumentos salariais durante as janelas de transferência.
              </p>
            </div>
          </GoatCard>

          {/* CAREER MILESTONES SUMMARY */}
          <GoatCard variant="gold" className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Histórico de Conquistas
            </h3>

            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-300">Clubes Defendidos</span>
                <span className="font-bold text-amber-400">{career.history?.length ? career.history.length + 1 : 1}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                <span className="text-zinc-300">Temporadas Concluídas</span>
                <span className="font-bold text-amber-400">{(career.season || 1) - 1}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-300">Títulos Conquistados</span>
                <span className="font-bold text-amber-400">{career.awards?.toty || 0}</span>
              </div>
            </div>
          </GoatCard>
        </div>

      </div>

    </div>
  );
}
