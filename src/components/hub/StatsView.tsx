import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { Trophy, Calendar, Star, Medal, ArrowRightLeft, Shirt, Target, Activity, Shield, Hash, Goal } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Stat, SectionHeader } from '../ui';

export default function StatsView() {
  const { state } = useGameEngine();
  const { career } = state;
  const { history, matches, currentSeasonStats, transfers, awards } = career;

  const allStats = [...history, currentSeasonStats];
  const totalMatches = allStats.reduce((sum, s) => sum + s.matchesPlayed, 0);
  const totalGoals = allStats.reduce((sum, s) => sum + s.goals, 0);
  const totalAssists = allStats.reduce((sum, s) => sum + s.assists, 0);
  const totalMinutes = allStats.reduce((sum, s) => sum + s.minutesPlayed, 0);
  
  const totalShots = allStats.reduce((sum, s) => sum + s.shots, 0);
  const totalPasses = allStats.reduce((sum, s) => sum + s.passes, 0);
  
  // Calculate average rating
  let totalRatingSum = 0;
  let ratingMatchCount = 0;
  allStats.forEach(s => {
     if (s.matchesPlayed > 0) {
        totalRatingSum += (s.avgRating * s.matchesPlayed);
        ratingMatchCount += s.matchesPlayed;
     }
  });
  const avgCareerRating = ratingMatchCount > 0 ? (totalRatingSum / ratingMatchCount).toFixed(2) : '0.00';
  const passAccuracy = totalPasses > 0 ? 
     (allStats.reduce((sum, s) => sum + s.passAccuracySum, 0) / ratingMatchCount).toFixed(1) : '0.0';

  const totalInjuries = allStats.reduce((sum, s) => sum + s.injuries, 0);
  const totalMotm = allStats.reduce((sum, s) => sum + s.motm, 0);
  const totalCaptaincies = allStats.reduce((sum, s) => sum + s.captaincies, 0);
  
  const allTrophies = allStats.flatMap(s => s.trophies);
  const uniqueClubs = Array.from(new Set(allStats.map(s => s.clubName).filter(Boolean)));
  const uniqueNumbers = Array.from(new Set(allStats.map(s => s.shirtNumber).filter(Boolean)));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-6 overflow-y-auto hide-scrollbar pr-2 pb-6">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatBox label="Jogos" value={totalMatches.toString()} icon={<Activity size={16}/>} />
         <StatBox label="Minutos" value={totalMinutes.toString()} icon={<Calendar size={16}/>} />
         <StatBox label="Gols" value={totalGoals.toString()} icon={<Goal size={16}/>} />
         <StatBox label="Assistências" value={totalAssists.toString()} icon={<Target size={16}/>} />
         
         <StatBox label="Finalizações" value={totalShots.toString()} icon={<Activity size={16}/>} />
         <StatBox label="Passes" value={totalPasses.toString()} icon={<ArrowRightLeft size={16}/>} />
         <StatBox label="Precisão Passes" value={`${passAccuracy}%`} icon={<Target size={16}/>} />
         <StatBox label="Nota Média" value={avgCareerRating} icon={<Star size={16}/>} />
         
         <StatBox label="Lesões" value={totalInjuries.toString()} icon={<Shield size={16}/>} color="text-rose-400" />
         <StatBox label="Homem do Jogo" value={totalMotm.toString()} icon={<Star size={16}/>} color="text-amber-400" />
         <StatBox label="Capitão" value={totalCaptaincies.toString()} icon={<Shield size={16}/>} color="text-orange-400" />
         <StatBox label="Clubes" value={uniqueClubs.length.toString()} icon={<Shirt size={16}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Awards & Trophies */}
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Medal size={16}/> Sala de Troféus</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-white/5 rounded-lg p-4 border border-white/5 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-1">{awards.ballonDor}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Bolas de Ouro</div>
                 </div>
                 <div className="bg-white/5 rounded-lg p-4 border border-white/5 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-amber-500 mb-1">{awards.goldenBoot}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Chuteiras de Ouro</div>
                 </div>
                 <div className="bg-white/5 rounded-lg p-4 border border-white/5 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">{awards.toty}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Seleção do Ano</div>
                 </div>
                 <div className="bg-white/5 rounded-lg p-4 border border-white/5 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{allTrophies.length}</div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Títulos Coletivos</div>
                 </div>
              </div>

              <div>
                 <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3">Camisas Utilizadas</div>
                 <div className="flex flex-wrap gap-2">
                    {uniqueNumbers.map(n => (
                       <div key={n} className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-sm text-white">{n}</div>
                    ))}
                 </div>
              </div>
            </CardContent>
         </Card>

         {/* Transfer History */}
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ArrowRightLeft size={16}/> Transferências</CardTitle>
            </CardHeader>
            <CardContent>
              {transfers.length === 0 ? (
                 <div className="flex-1 flex items-center justify-center text-white/40 text-sm font-bold bg-white/5 rounded-lg border border-white/5 p-8 uppercase tracking-widest text-center">
                    Nenhuma transferência registrada.
                 </div>
              ) : (
                 <div className="space-y-4">
                    {transfers.map((t, idx) => (
                       <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/5 flex justify-between items-center">
                          <div>
                             <div className="text-sm font-bold text-white flex items-center gap-3">
                                <span className="text-white/60 truncate max-w-[80px] md:max-w-[120px]">{t.fromClub || 'Base'}</span>
                                <ArrowRightLeft size={14} className="text-white/40" />
                                <span className="text-white truncate max-w-[80px] md:max-w-[120px]">{t.toClub}</span>
                             </div>
                             <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest mt-1">Ano {t.year} - Sem {t.week}</div>
                          </div>
                          <div className="text-right">
                             <div className="text-lg font-bold text-emerald-400">${(t.fee/1000000).toFixed(1)}M</div>
                             <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Salário: ${(t.salary/1000).toFixed(1)}k/sem</div>
                          </div>
                       </div>
                    ))}
                 </div>
              )}
            </CardContent>
         </Card>
      </div>

      {/* Season by Season History */}
      <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Calendar size={16}/> Histórico por Temporada</CardTitle>
         </CardHeader>
         <CardContent className="overflow-x-auto hide-scrollbar p-0 px-6 pb-6">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest">
                     <th className="pb-4 px-3 font-semibold">Ano</th>
                     <th className="pb-4 px-3 font-semibold">Clube</th>
                     <th className="pb-4 px-3 font-semibold">J</th>
                     <th className="pb-4 px-3 font-semibold">G</th>
                     <th className="pb-4 px-3 font-semibold">A</th>
                     <th className="pb-4 px-3 font-semibold">N.M.</th>
                     <th className="pb-4 px-3 font-semibold">Títulos</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {[...allStats].reverse().map((s, idx) => (
                     <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors font-medium">
                        <td className="py-4 px-3 text-white/60">{s.year}</td>
                        <td className="py-4 px-3 text-white truncate max-w-[120px]">{s.clubName || 'Sem Clube'}</td>
                        <td className="py-4 px-3 text-white/80">{s.matchesPlayed}</td>
                        <td className="py-4 px-3 text-white/80">{s.goals}</td>
                        <td className="py-4 px-3 text-white/80">{s.assists}</td>
                        <td className="py-4 px-3 text-white/80">{s.avgRating.toFixed(2)}</td>
                        <td className="py-4 px-3 text-amber-500/80 truncate max-w-[200px]">{s.trophies.join(', ') || '-'}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
      </Card>
      
      {/* All Matches Log */}
      <Card>
         <CardHeader>
           <CardTitle className="flex items-center gap-2"><Activity size={16}/> Registro de Partidas</CardTitle>
         </CardHeader>
         <CardContent>
           {matches.length === 0 ? (
              <div className="text-white/40 text-sm font-bold text-center py-8 uppercase tracking-widest">Nenhuma partida jogada ainda.</div>
           ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto hide-scrollbar pr-2">
                 {matches.map(m => (
                    <div key={m.id} className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-white/10 transition-colors">
                       <div className="flex-1 w-full flex items-center gap-6">
                          <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest min-w-[60px]">
                             {m.year} S{m.week}
                          </div>
                          <div className="flex-1 flex justify-between items-center max-w-[300px]">
                             <span className={`text-sm font-bold truncate w-28 text-right ${m.home ? 'text-white' : 'text-white/40'}`}>
                                {m.home ? 'Meu Clube' : m.opponent}
                             </span>
                             <span className="text-[10px] text-white/20 font-bold px-4 italic">VS</span>
                             <span className={`text-sm font-bold truncate w-28 text-left ${!m.home ? 'text-white' : 'text-white/40'}`}>
                                {!m.home ? 'Meu Clube' : m.opponent}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center gap-8 text-sm font-bold w-full md:w-auto justify-between md:justify-end bg-black/30 px-4 py-2 rounded-lg border border-white/5">
                          <div className="flex items-center gap-6 text-white/80">
                             <span className="flex items-center gap-2" title="Gols"><Goal size={14} className="text-white/40"/> {m.goals}</span>
                             <span className="flex items-center gap-2" title="Assistências"><Target size={14} className="text-white/40"/> {m.assists}</span>
                          </div>
                          <div className={`text-xl font-bold w-12 text-right ${m.rating >= 8 ? 'text-amber-500' : m.rating >= 6 ? 'text-white/80' : 'text-rose-500'}`}>
                             {m.rating.toFixed(1)}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           )}
         </CardContent>
      </Card>

    </motion.div>
  );
}

function StatBox({ label, value, icon, color = 'text-white' }: { label: string, value: string, icon: React.ReactNode, color?: string }) {
  return (
    <Card className="hover:bg-white/10 transition-colors">
      <CardContent className="p-4 md:p-5 flex flex-col justify-center h-full">
         <div className="text-white/40 mb-2">{icon}</div>
         <div className={`text-2xl font-bold ${color} truncate mb-1`}>{value}</div>
         <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">{label}</div>
      </CardContent>
    </Card>
  )
}
