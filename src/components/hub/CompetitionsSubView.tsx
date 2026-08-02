import React from 'react';
import { useCurrentClub } from '../../engine/selectors';
import { GoatCard, GoatBadge } from '../ui/goat';
import { Trophy, Shield, Flame, Award } from 'lucide-react';

export default function CompetitionsSubView() {
  const currentClub = useCurrentClub();

  const mockStandings = [
    { pos: 1, club: 'Santos FC', pts: 42, p: 18, w: 13, d: 3, l: 2, gf: 38, ga: 14, gd: 24, isUser: true },
    { pos: 2, club: 'Palmeiras', pts: 40, p: 18, w: 12, d: 4, l: 2, gf: 32, ga: 12, gd: 20, isUser: false },
    { pos: 3, club: 'Flamengo', pts: 38, p: 18, w: 11, d: 5, l: 2, gf: 35, ga: 16, gd: 19, isUser: false },
    { pos: 4, club: 'Atlético Mineiro', pts: 34, p: 18, w: 10, d: 4, l: 4, gf: 29, ga: 18, gd: 11, isUser: false },
    { pos: 5, club: 'São Paulo', pts: 31, p: 18, w: 9, d: 4, l: 5, gf: 26, ga: 20, gd: 6, isUser: false },
    { pos: 6, club: 'Grêmio', pts: 29, p: 18, w: 8, d: 5, l: 5, gf: 24, ga: 21, gd: 3, isUser: false },
    { pos: 7, club: 'Fluminense', pts: 27, p: 18, w: 7, d: 6, l: 5, gf: 22, ga: 20, gd: 2, isUser: false },
    { pos: 8, club: 'Internacional', pts: 25, p: 18, w: 7, d: 4, l: 7, gf: 20, ga: 22, gd: -2, isUser: false },
  ];

  const mockTopScorers = [
    { rank: 1, player: 'Você (Neymar Jr)', club: 'Santos FC', goals: 18, matches: 16 },
    { rank: 2, player: 'Pedro', club: 'Flamengo', goals: 14, matches: 17 },
    { rank: 3, player: 'Endrick', club: 'Palmeiras', goals: 12, matches: 18 },
    { rank: 4, player: 'Hulk', club: 'Atlético Mineiro', goals: 11, matches: 17 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Tabela Mundial</span>
            <h2 className="text-2xl font-black uppercase text-zinc-100">Competições & Ligas</h2>
            <p className="text-xs text-zinc-400">Acompanhe a classificação oficial, briga pelo título e lista de artilheiros.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GoatBadge variant="gold" size="md">
            Brasileirão Série A • Rodada 18
          </GoatBadge>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEAGUE TABLE (8 COLS) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GoatCard variant="gold" glow className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Tabela de Classificação Geral
              </h3>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Zona de Libertadores (1º ao 4º)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 uppercase font-black text-[10px]">
                    <th className="py-2.5 px-2">#</th>
                    <th className="py-2.5 px-3">Clube</th>
                    <th className="py-2.5 px-2 text-center">PTS</th>
                    <th className="py-2.5 px-2 text-center">J</th>
                    <th className="py-2.5 px-2 text-center">V</th>
                    <th className="py-2.5 px-2 text-center">E</th>
                    <th className="py-2.5 px-2 text-center">D</th>
                    <th className="py-2.5 px-2 text-center">SG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {mockStandings.map((item) => (
                    <tr
                      key={item.pos}
                      className={`transition-colors ${
                        item.isUser
                          ? 'bg-amber-500/15 font-bold text-amber-300'
                          : 'hover:bg-zinc-900/60 text-zinc-200'
                      }`}
                    >
                      <td className="py-3 px-2 font-black">{item.pos}º</td>
                      <td className="py-3 px-3 font-extrabold flex items-center gap-2">
                        {item.isUser && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                        {item.club}
                      </td>
                      <td className="py-3 px-2 text-center font-black text-amber-400">{item.pts}</td>
                      <td className="py-3 px-2 text-center text-zinc-400">{item.p}</td>
                      <td className="py-3 px-2 text-center text-emerald-400">{item.w}</td>
                      <td className="py-3 px-2 text-center text-zinc-400">{item.d}</td>
                      <td className="py-3 px-2 text-center text-rose-400">{item.l}</td>
                      <td className="py-3 px-2 text-center font-bold text-zinc-300">+{item.gd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GoatCard>
        </div>

        {/* TOP SCORERS (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GoatCard variant="mineral" className="p-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-100 mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              Artilharia do Campeonato
            </h3>

            <div className="space-y-3">
              {mockTopScorers.map((s) => (
                <div key={s.rank} className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-amber-400 text-sm">{s.rank}º</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">{s.player}</h4>
                      <p className="text-[10px] text-zinc-500">{s.club}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-400">{s.goals}</span>
                    <span className="text-[9px] font-bold text-zinc-500 block uppercase">Gols</span>
                  </div>
                </div>
              ))}
            </div>
          </GoatCard>
        </div>

      </div>

    </div>
  );
}
