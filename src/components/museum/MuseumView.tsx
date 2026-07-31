import React from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { motion } from 'motion/react';
import { Trophy, Calendar, Star, Medal, ArrowRightLeft, Shirt, Target, Activity, Shield, Camera, Film, Users, BookOpen, Quote, Home, ArrowRight } from 'lucide-react';
import { PlayerAvatar } from '../ui/PlayerAvatar';

export default function MuseumView() {
  const { state, dispatch } = useGameEngine();
  const { player, career } = state;
  const { history, currentSeasonStats, awards, matches } = career;

  const [activeExhibit, setActiveExhibit] = React.useState('timeline'); // timeline, gallery, documentary, comparison

  const allStats = [...history, currentSeasonStats];
  const totalMatches = allStats.reduce((sum, s) => sum + s.matchesPlayed, 0);
  const totalGoals = allStats.reduce((sum, s) => sum + s.goals, 0);
  const totalAssists = allStats.reduce((sum, s) => sum + s.assists, 0);
  const allTrophies = allStats.flatMap(s => s.trophies);
  const uniqueClubs = Array.from(new Set(allStats.map(s => s.clubName).filter(Boolean)));
  const uniqueNumbers = Array.from(new Set(allStats.map(s => s.shirtNumber).filter(Boolean)));

  const legends = [
     { name: 'Pelé', goals: 762, matches: 831, gpg: 0.92, wc: 3, bd: 7 },
     { name: 'Messi', goals: 821, matches: 1045, gpg: 0.79, wc: 1, bd: 8 },
     { name: 'Cristiano', goals: 865, matches: 1200, gpg: 0.72, wc: 0, bd: 5 },
     { name: 'Maradona', goals: 345, matches: 678, gpg: 0.51, wc: 1, bd: 0 },
     { name: 'Ronaldo', goals: 414, matches: 616, gpg: 0.67, wc: 2, bd: 2 },
     { name: 'Zidane', goals: 156, matches: 795, gpg: 0.20, wc: 1, bd: 1 },
     { name: player.name || 'Você', goals: totalGoals, matches: totalMatches, gpg: totalMatches > 0 ? (totalGoals/totalMatches) : 0, wc: allTrophies.filter(t => t.includes('Copa do Mundo')).length, bd: awards.ballonDor }
  ].sort((a, b) => b.goals - a.goals);

  return (
    <motion.div 
      initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[100rem] h-[calc(100vh-100px)] flex flex-col bg-black/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] relative"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />
      <div className="absolute -top-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full bg-yellow-500/10 blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Header */}
      <header className="p-8 md:p-12 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center relative z-10 gap-8">
         <div className="flex items-center gap-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(234,179,8,0.3)] bg-gradient-to-br from-yellow-500 to-yellow-900 relative">
               <div className="absolute inset-0 bg-black/40 mix-blend-overlay" />
               <PlayerAvatar player={player} className="w-full h-full scale-[1.3] mt-6 relative z-10 drop-shadow-2xl" />
            </div>
            <div>
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
               >
                  <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 uppercase tracking-tighter drop-shadow-2xl">{player.name || 'Lenda'}</h1>
                  <h2 className="text-white/70 font-bold uppercase tracking-[0.3em] text-sm md:text-base flex items-center gap-3 mt-2">
                     <Star size={16} className="fill-yellow-500 text-yellow-500 animate-pulse" /> Hall da Fama
                  </h2>
               </motion.div>
            </div>
         </div>
         <div className="flex flex-wrap justify-center gap-3">
            <ExhibitButton icon={<Calendar />} label="Linha do Tempo" active={activeExhibit === 'timeline'} onClick={() => setActiveExhibit('timeline')} />
            <ExhibitButton icon={<Camera />} label="Galeria" active={activeExhibit === 'gallery'} onClick={() => setActiveExhibit('gallery')} />
            <ExhibitButton icon={<Film />} label="Documentário" active={activeExhibit === 'documentary'} onClick={() => setActiveExhibit('documentary')} />
            <ExhibitButton icon={<Users />} label="Olimpo" active={activeExhibit === 'comparison'} onClick={() => setActiveExhibit('comparison')} />
         </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-8 md:p-12 relative z-10">
         <motion.div 
            key={activeExhibit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
         >
         {activeExhibit === 'timeline' && (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="text-center mb-12">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">A Jornada do Herói</h3>
                  <p className="text-zinc-400">Uma carreira construída com suor, talento e glória.</p>
               </div>

               <div className="relative border-l-2 border-white/10 pl-8 space-y-12 ml-4">
                  {[...allStats].map((s, idx) => (
                     <div key={idx} className="relative">
                        <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-black border-2 border-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                           <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-all shadow-xl group">
                           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                              <div>
                                 <h4 className="text-3xl font-black text-white/90 mb-1">{s.year}</h4>
                                 <div className="text-yellow-500/90 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                    <Shirt size={14} /> {s.clubName || 'Sem Clube'} (Camisa {s.shirtNumber})
                                 </div>
                              </div>
                              <div className="flex gap-6 bg-black/30 p-4 rounded-2xl border border-white/5 w-full md:w-auto justify-around">
                                 <div className="text-center">
                                    <div className="text-xl font-black text-white/90">{s.matchesPlayed}</div>
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Jogos</div>
                                 </div>
                                 <div className="w-[1px] bg-white/10" />
                                 <div className="text-center">
                                    <div className="text-xl font-black text-yellow-500">{s.goals}</div>
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Gols</div>
                                 </div>
                                 <div className="w-[1px] bg-white/10" />
                                 <div className="text-center">
                                    <div className="text-xl font-black text-zinc-300">{s.assists}</div>
                                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Assist.</div>
                                 </div>
                              </div>
                           </div>
                           
                           {s.trophies.length > 0 && (
                              <div className="mt-4 pt-6 border-t border-white/10">
                                 <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-3">Títulos Conquistados</div>
                                 <div className="flex flex-wrap gap-2">
                                    {s.trophies.map((t, i) => (
                                       <span key={i} className="bg-yellow-500/10 text-yellow-500/90 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                                          <Trophy size={12} /> {t}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {activeExhibit === 'gallery' && (
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Galeria & Relíquias</h3>
                  <p className="text-zinc-400">Momentos imortalizados na história.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white/5 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 transform md:rotate-2 hover:rotate-0 hover:scale-105 transition-all shadow-2xl">
                     <div className="w-full h-72 bg-black/50 rounded-2xl overflow-hidden relative sepia-[.4] contrast-125 grayscale-[.2]">
                        <PlayerAvatar player={player} className="w-full h-full scale-[2] mt-12" />
                     </div>
                     <div className="p-6 text-center">
                        <div className="font-serif italic text-3xl text-white/90">O Início de Tudo</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Ano 1 - A Estreia</div>
                     </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 transform md:-rotate-2 hover:rotate-0 hover:scale-105 transition-all shadow-2xl">
                     <div className="w-full h-72 bg-black/50 rounded-2xl overflow-hidden relative brightness-110 contrast-150 saturate-150">
                        <PlayerAvatar player={player} className="w-full h-full scale-[1.5] mt-4" />
                     </div>
                     <div className="p-6 text-center">
                        <div className="font-serif italic text-3xl text-white/90">Auge da Forma</div>
                        <div className="text-[10px] text-yellow-500/90 font-bold uppercase tracking-widest mt-2">O Primeiro Título</div>
                     </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 transform md:rotate-2 hover:rotate-0 hover:scale-105 transition-all shadow-2xl">
                     <div className="w-full h-72 bg-black/50 rounded-2xl overflow-hidden relative grayscale contrast-125">
                        <PlayerAvatar player={player} className="w-full h-full scale-[1.8] mt-8" />
                     </div>
                     <div className="p-6 text-center">
                        <div className="font-serif italic text-3xl text-white/90">O Adeus</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">A Última Partida</div>
                     </div>
                  </div>
               </div>

               <div className="mt-20">
                  <h4 className="text-xl font-black text-white/90 uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-4">
                     <div className="h-[1px] w-12 bg-white/20" />
                     Camisas Utilizadas
                     <div className="h-[1px] w-12 bg-white/20" />
                  </h4>
                  <div className="flex flex-wrap justify-center gap-6">
                     {uniqueNumbers.map(n => (
                        <div key={n} className="w-28 h-32 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center transform hover:-translate-y-4 transition-transform group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 z-10">Manto</div>
                           <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 z-10 drop-shadow-lg">{n}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {activeExhibit === 'documentary' && (
            <div className="max-w-3xl mx-auto space-y-8 text-center bg-black/40 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[100px] pointer-events-none" />
               
               <Film size={48} className="mx-auto text-yellow-500/80 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
               <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-12 leading-tight">
                  "{player.name}:<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700">O Peso da Lenda</span>"
               </h3>
               
               <div className="prose prose-invert prose-zinc mx-auto text-left text-lg md:text-xl leading-relaxed text-zinc-300">
                  <p className="font-serif">
                     Tudo começou quando um jovem talento chamado <strong className="text-white">{player.name}</strong> deu seus primeiros passos no futebol profissional. 
                     Com uma habilidade natural incrível (Nota técnica: {player.rpg.fitness}), ele rapidamente chamou a atenção do mundo.
                  </p>
                  <p className="font-serif">
                     Ao longo de sua carreira, {player.name} vestiu a camisa de <strong className="text-white">{uniqueClubs.length} clubes</strong>, espalhando magia pelos campos. 
                     Foram <strong className="text-yellow-500/90">{totalMatches} partidas</strong> oficiais, onde a torcida pôde testemunhar o nascimento de um mito.
                  </p>
                  <blockquote className="border-l-4 border-yellow-500 pl-8 italic text-2xl text-white/90 my-12 py-4 bg-white/5 rounded-r-3xl backdrop-blur-xl">
                     "Eu nunca vi ninguém jogar como ele. Era como se a bola estivesse colada ao pé dele." <br/>
                     <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest not-italic mt-4 block">— Ex-treinador de {player.name}</span>
                  </blockquote>
                  <p className="font-serif">
                     Os números não mentem: <strong className="text-yellow-500/90">{totalGoals} gols</strong> e <strong className="text-white">{totalAssists} assistências</strong>. 
                     Mas mais do que os números, foram os <strong className="text-white">{allTrophies.length} títulos</strong> que o colocaram no panteão dos deuses do futebol. 
                     Seus prêmios individuais, incluindo <strong className="text-yellow-500/90">{awards.ballonDor} Bolas de Ouro</strong>, coroaram uma trajetória perfeita.
                  </p>
                  <p className="font-serif text-white/60">
                     Hoje, ao pendurar as chuteiras, o futebol chora. Mas o legado de {player.name} é eterno. 
                     Ele não foi apenas um jogador. Ele foi a própria poesia em movimento.
                  </p>
               </div>
               
               <div className="pt-12 border-t border-white/10 mt-16 flex items-center justify-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-black font-black text-xs">F</div>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Uma produção exclusiva GOAT Simulator Originals</p>
               </div>
            </div>
         )}

         {activeExhibit === 'comparison' && (
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12">
                  <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">Sala dos Deuses</h3>
                  <p className="text-zinc-400">Onde você se senta na mesa das maiores lendas de todos os tempos.</p>
               </div>

               <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-[10px] text-zinc-400 uppercase tracking-widest">
                           <th className="py-5 px-6 font-bold">Lenda</th>
                           <th className="py-5 px-6 font-bold">Gols</th>
                           <th className="py-5 px-6 font-bold">Jogos</th>
                           <th className="py-5 px-6 font-bold">Média (G/J)</th>
                           <th className="py-5 px-6 font-bold">Bolas de Ouro</th>
                           <th className="py-5 px-6 font-bold">Copas do Mundo</th>
                        </tr>
                     </thead>
                     <tbody>
                        {legends.map((l, idx) => {
                           const isPlayer = l.name === player.name || l.name === 'Você';
                           return (
                              <tr key={idx} className={`border-b border-white/5 transition-colors ${isPlayer ? 'bg-yellow-500/10' : 'hover:bg-white/5'}`}>
                                 <td className="py-5 px-6">
                                    <div className="flex items-center gap-4">
                                       <span className={`text-sm font-black uppercase tracking-widest ${isPlayer ? 'text-yellow-500' : 'text-white/90'}`}>
                                          {idx + 1}. {l.name}
                                       </span>
                                       {isPlayer && <Star size={16} className="fill-yellow-500 text-yellow-500" />}
                                    </div>
                                 </td>
                                 <td className="py-5 px-6 text-white/80 font-bold">{l.goals}</td>
                                 <td className="py-5 px-6 text-zinc-400 font-bold">{l.matches}</td>
                                 <td className="py-5 px-6 text-zinc-400 font-bold">{l.gpg.toFixed(2)}</td>
                                 <td className="py-5 px-6 text-yellow-500 font-black">{l.bd}</td>
                                 <td className="py-5 px-6 text-yellow-500 font-black">{l.wc}</td>
                              </tr>
                           )
                        })}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         </motion.div>
      </div>
    </motion.div>
  );
}

function ExhibitButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
   return (
      <button 
         onClick={onClick}
         className={`flex items-center gap-2 px-6 py-3 md:py-4 rounded-2xl font-bold transition-all text-xs uppercase tracking-widest ${
            active 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105' 
            : 'bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10'
         }`}
      >
         {icon}
         <span className="hidden md:inline">{label}</span>
      </button>
   )
}
