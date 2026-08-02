import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Calendar, Star, Medal, ArrowRightLeft, Shirt, Target, Activity, Shield, BookOpen, Clock, Zap, Home } from 'lucide-react';
import { useMuseumData } from './../../hooks/useMuseumData';
import { PlayerPortrait } from '../ui/PlayerPortrait';

export function EmptyState({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] max-w-2xl mx-auto shadow-2xl">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-500">
        <Icon />
      </div>
      <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-zinc-400 font-serif text-lg">{description}</p>
    </div>
  );
}

export function TimelineSection() {
  const { legacyState, career } = useMuseumData();
  const { events } = legacyState;
  
  if (events.length === 0 && career.history.length === 0) {
    return <EmptyState icon={Calendar} title="Página em Branco" description="A história ainda está sendo escrita. Conquiste títulos e prêmios para preencher sua linha do tempo." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="relative border-l-2 border-white/10 pl-8 space-y-8 ml-4">
        {events.map((e, idx) => (
          <div key={idx} className="relative group">
             <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
             </div>
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all shadow-xl">
                <div className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-1">{e.year} - {e.category.replace('_', ' ')}</div>
                <h4 className="text-xl font-black text-white mb-2">{e.name}</h4>
                <p className="text-zinc-400 text-sm">{e.description}</p>
                <div className="mt-3 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">+{e.points} GOAT Pts</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeasonsSection() {
  const { career, uniqueClubs } = useMuseumData();
  const { history } = career;
  const [filterClub, setFilterClub] = useState('');
  
  const filtered = history.filter(h => !filterClub || h.clubName === filterClub);

  if (history.length === 0) {
    return <EmptyState icon={Calendar} title="Nenhuma Temporada" description="Complete sua primeira temporada para ver os registros." />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex gap-4 mb-6">
         <select className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none font-bold text-sm uppercase tracking-widest" value={filterClub} onChange={e => setFilterClub(e.target.value)}>
           <option value="">Todos os Clubes</option>
           {uniqueClubs.map(c => <option key={c} value={c}>{c}</option>)}
         </select>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
           <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] text-zinc-400 uppercase tracking-widest">
                 <th className="py-4 px-6 font-bold">Ano</th>
                 <th className="py-4 px-6 font-bold">Clube</th>
                 <th className="py-4 px-6 font-bold">Jogos</th>
                 <th className="py-4 px-6 font-bold">Gols</th>
                 <th className="py-4 px-6 font-bold">Assist.</th>
                 <th className="py-4 px-6 font-bold">Média</th>
              </tr>
           </thead>
           <tbody>
              {filtered.map((s, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                   <td className="py-4 px-6 text-white font-bold">{s.year}</td>
                   <td className="py-4 px-6 text-zinc-300 font-bold">{s.clubName}</td>
                   <td className="py-4 px-6 text-zinc-400">{s.matchesPlayed}</td>
                   <td className="py-4 px-6 text-yellow-500 font-black">{s.goals}</td>
                   <td className="py-4 px-6 text-zinc-300">{s.assists}</td>
                   <td className="py-4 px-6 text-zinc-400">{s.avgRating.toFixed(2)}</td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}

export function LegacySection() {
  const { legacyState } = useMuseumData();
  const { score, hallOfFameLevel } = legacyState;

  return (
    <div className="max-w-4xl mx-auto space-y-12 text-center pb-12">
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-12 rounded-[3rem] border border-yellow-500/30 shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/20 blur-[100px]" />
        <Star size={48} className="mx-auto text-yellow-500 mb-6 drop-shadow-lg" />
        <h3 className="text-sm text-yellow-500 uppercase tracking-[0.3em] font-bold mb-2">GOAT Score Total</h3>
        <div className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tighter drop-shadow-2xl">
          {score.totalGoatScore.toLocaleString()}
        </div>
        <div className="mt-6 text-xl text-white/80 font-serif italic">Nível na História: <strong className="text-white uppercase not-italic ml-2">{hallOfFameLevel.replace('_', ' ')}</strong></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatCard label="Ídolo do Clube" value={score.clubLegend} icon={Home} color="text-blue-400" />
         <StatCard label="Herói Nacional" value={score.nationalHero} icon={Shield} color="text-green-400" />
         <StatCard label="Ícone Global" value={score.globalIcon} icon={Star} color="text-yellow-400" />
         <StatCard label="Dominador de Era" value={score.eraDominator} icon={Zap} color="text-purple-400" />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:scale-105 transition-transform shadow-xl">
      <Icon />
      <div className="text-2xl font-black text-white">{value.toLocaleString()}</div>
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">{label}</div>
    </div>
  );
}

export function TrophiesSection() {
  const { allTrophies } = useMuseumData();
  
  if (allTrophies.length === 0) {
    return <EmptyState icon={Trophy} title="Nenhum Troféu" description="A galeria de troféus está vazia." />;
  }

  return (
    <div className="max-w-6xl mx-auto">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allTrophies.map((t, idx) => (
             <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trophy size={48} className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                <div className="text-sm font-black text-white uppercase tracking-widest mb-1">{t.name}</div>
                <div className="text-xs text-zinc-400 font-bold">{t.year} • {t.clubName}</div>
             </div>
          ))}
       </div>
    </div>
  );
}

export function AwardsSection() {
  const { allAwards } = useMuseumData();
  
  if (allAwards.length === 0) {
    return <EmptyState icon={Medal} title="Nenhum Prêmio" description="Os prêmios individuais chegarão com o tempo." />;
  }

  return (
    <div className="max-w-6xl mx-auto">
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allAwards.map((a, idx) => (
             <div key={idx} className="bg-white/5 backdrop-blur-xl border border-yellow-500/20 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Medal size={48} className="mx-auto text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                <div className="text-sm font-black text-white uppercase tracking-widest mb-1">{a.name}</div>
                <div className="text-xs text-zinc-400 font-bold">{a.year} • {a.clubName}</div>
             </div>
          ))}
       </div>
    </div>
  );
}

export function RecordsSection() {
  const { legacyState } = useMuseumData();
  const { records, milestones } = legacyState;

  if (records.length === 0 && milestones.length === 0) {
    return <EmptyState icon={Target} title="Sem Recordes" description="Quebre marcas históricas para aparecer aqui." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {records.length > 0 && (
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3"><Target className="text-yellow-500" /> Recordes Quebrados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {records.map((r, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white/90 text-sm">
                   {r}
                </div>
             ))}
          </div>
        </div>
      )}
      {milestones.length > 0 && (
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-3"><Activity className="text-green-500" /> Marcas Históricas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {milestones.map((m, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 font-bold text-white/90 text-sm">
                   {m}
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TransfersSection() {
  const { career } = useMuseumData();
  const { transfers } = career;

  if (transfers.length === 0) {
    return <EmptyState icon={ArrowRightLeft} title="Nenhuma Transferência" description="Você ainda não mudou de clube." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
         {transfers.map((t, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between shadow-xl">
               <div className="flex items-center gap-4 w-1/3">
                  <span className="font-bold text-white/90 truncate">{t.fromClub}</span>
               </div>
               <div className="flex flex-col items-center justify-center w-1/3">
                  <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Ano {t.year} (Semana {t.week})</div>
                  <ArrowRightLeft className="text-yellow-500" size={20} />
                  <div className="text-xs font-black text-yellow-500 mt-1">${(t.fee / 1000000).toFixed(1)}M</div>
               </div>
               <div className="flex items-center justify-end gap-4 w-1/3">
                  <span className="font-bold text-white/90 truncate">{t.toClub}</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

export function StatsSection() {
  const { legacyState } = useMuseumData();
  const { summary } = legacyState;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 pb-12">
      <StatCard label="Gols na Carreira" value={summary.totalGoals} icon={Target} color="text-yellow-500" />
      <StatCard label="Assistências" value={summary.totalAssists} icon={Activity} color="text-blue-500" />
      <StatCard label="Jogos Disputados" value={summary.totalMatches} icon={Shirt} color="text-green-500" />
      <StatCard label="Troféus" value={summary.totalTrophies} icon={Trophy} color="text-orange-500" />
      <StatCard label="Bolas de Ouro" value={summary.ballonDors} icon={Medal} color="text-yellow-400" />
      <StatCard label="Anos Ativo" value={summary.yearsActive} icon={Calendar} color="text-purple-500" />
    </div>
  );
}

export function ShirtsSection() {
  const { uniqueShirts } = useMuseumData();

  if (uniqueShirts.length === 0) {
    return <EmptyState icon={Shirt} title="Nenhuma Camisa" description="Jogue partidas oficiais para registrar suas camisas." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-center gap-6">
         {uniqueShirts.map(n => (
            <div key={n} className="w-28 h-32 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center transform hover:-translate-y-4 transition-transform group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 z-10">Manto</div>
               <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 z-10 drop-shadow-lg">{n}</div>
            </div>
         ))}
      </div>
    </div>
  );
}

export function HistoricMatchesSection() {
  const { historicMatches } = useMuseumData();

  if (historicMatches.length === 0) {
    return <EmptyState icon={Star} title="Sem Partidas Históricas" description="Faça atuações memoráveis (Nota 9+) para registrá-las." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {historicMatches.slice(0, 20).map((m, idx) => (
        <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
           <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Ano {m.year} • {m.competition}</div>
              <div className="text-lg font-black text-white">{m.home ? 'Casa' : 'Fora'} vs {m.opponent}</div>
           </div>
           <div className="flex gap-6 items-center">
              <div className="text-center">
                 <div className="text-2xl font-black text-yellow-500">{m.goals}</div>
                 <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Gols</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-black text-zinc-300">{m.assists}</div>
                 <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Assist.</div>
              </div>
              <div className="text-center">
                 <div className="text-2xl font-black text-green-400">{m.rating.toFixed(1)}</div>
                 <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nota</div>
              </div>
              {m.motm && (
                 <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30">MOTM</div>
              )}
           </div>
        </div>
      ))}
    </div>
  );
}

export function ClubsSection() {
  const { career } = useMuseumData();
  const { history } = career;

  const clubStats = new Map<string, { matches: number, goals: number, assists: number, years: number }>();
  history.forEach(h => {
    if (!h.clubName) return;
    const current = clubStats.get(h.clubName) || { matches: 0, goals: 0, assists: 0, years: 0 };
    current.matches += h.matchesPlayed;
    current.goals += h.goals;
    current.assists += h.assists;
    current.years += 1;
    clubStats.set(h.clubName, current);
  });

  const clubs = Array.from(clubStats.entries()).map(([name, stats]) => ({ name, ...stats }));

  if (clubs.length === 0) {
    return <EmptyState icon={Shield} title="Sem Clubes" description="Você ainda não jogou por nenhum clube oficial." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {clubs.map((c, idx) => (
        <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center justify-between shadow-xl">
           <div>
              <h4 className="text-2xl font-black text-white">{c.name}</h4>
              <div className="text-sm text-zinc-400 font-bold mt-1">{c.years} {c.years === 1 ? 'temporada' : 'temporadas'}</div>
           </div>
           <div className="flex gap-8">
              <div className="text-center">
                 <div className="text-3xl font-black text-white">{c.matches}</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Jogos</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-black text-yellow-500">{c.goals}</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Gols</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-black text-blue-400">{c.assists}</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Assist.</div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
