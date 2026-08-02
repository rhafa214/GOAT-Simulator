import React from 'react';
import { useCurrentClub, useCareer } from '../../engine/selectors';
import { GoatCard, GoatBadge } from '../ui/goat';
import { Shield, Users, Trophy, Award, TrendingUp, MapPin, Building2 } from 'lucide-react';

export default function ClubSubView() {
  const club = useCurrentClub();
  const career = useCareer();

  const clubName = club?.name || 'Santos FC';
  const league = club?.league || 'Brasileirão Série A';
  const tier = club?.tier || 1;
  const reputation = club?.reputation || 82;

  // Mock squad list for the current club preview
  const mockSquad = [
    { name: 'Neymar Jr', pos: 'ST', ovr: 88, age: 24, status: 'Titular' },
    { name: 'Gabriel Barbosa', pos: 'ST', ovr: 82, age: 26, status: 'Titular' },
    { name: 'Lucas Lima', pos: 'CAM', ovr: 79, age: 28, status: 'Titular' },
    { name: 'Thiago Maia', pos: 'CDM', ovr: 78, age: 22, status: 'Titular' },
    { name: 'Zeca', pos: 'LB', ovr: 77, age: 23, status: 'Titular' },
    { name: 'Vanderlei', pos: 'GK', ovr: 80, age: 31, status: 'Titular' },
    { name: 'Alison', pos: 'CDM', ovr: 75, age: 24, status: 'Reserva' },
    { name: 'Arthur Gomes', pos: 'LW', ovr: 72, age: 19, status: 'Reserva' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* CLUB HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <GoatBadge variant="gold" size="sm">Tier {tier}</GoatBadge>
              <span className="text-xs font-bold text-zinc-400">{league}</span>
            </div>
            <h2 className="text-3xl font-black uppercase text-zinc-100 mt-1">{clubName}</h2>
            <p className="text-xs text-zinc-400">Reputação do Clube: <strong className="text-amber-400">{reputation}/100</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GoatBadge variant="victory" size="md">
            Confiança da Diretoria: 88%
          </GoatBadge>
        </div>
      </div>

      {/* SQUAD & CLUB METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SQUAD LIST (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GoatCard variant="mineral" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Elenco Principal do Clube
              </h3>
              <span className="text-xs font-bold text-zinc-400">{mockSquad.length} Jogadores Destacados</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px]">
                    <th className="py-3 px-3">Jogador</th>
                    <th className="py-3 px-3">Posição</th>
                    <th className="py-3 px-3">Overall</th>
                    <th className="py-3 px-3">Idade</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {mockSquad.map((p, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-zinc-100 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-amber-400">
                          {p.name.charAt(0)}
                        </div>
                        {p.name}
                      </td>
                      <td className="py-3 px-3 text-amber-400 font-bold">{p.pos}</td>
                      <td className="py-3 px-3 font-extrabold text-zinc-200">{p.ovr}</td>
                      <td className="py-3 px-3 text-zinc-400">{p.age} anos</td>
                      <td className="py-3 px-3">
                        <GoatBadge variant={p.status === 'Titular' ? 'victory' : 'neutral'} size="sm">
                          {p.status}
                        </GoatBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GoatCard>
        </div>

        {/* CLUB DETAILS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GoatCard variant="gold" glow className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Estrutura do Clube
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-black uppercase text-zinc-500 block">Estádio Principal</span>
                <span className="text-sm font-bold text-zinc-100">Vila Belmiro</span>
              </div>

              <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-black uppercase text-zinc-500 block">Capacidade</span>
                <span className="text-sm font-bold text-zinc-100">16.000 Espectadores</span>
              </div>

              <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800">
                <span className="text-[10px] font-black uppercase text-zinc-500 block">Orçamento para Transferências</span>
                <span className="text-sm font-black text-emerald-400">€25.000.000</span>
              </div>
            </div>
          </GoatCard>
        </div>

      </div>

    </div>
  );
}
