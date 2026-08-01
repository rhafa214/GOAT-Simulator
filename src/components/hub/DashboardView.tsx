import React, { useState } from 'react';
import { usePlayer, useCareer, useFinances, useOverall } from '../../engine/selectors';
import { useGameActions } from '../../engine/actions';
import { 
  Trophy, 
  Calendar, 
  Star, 
  TrendingUp, 
  CheckCircle,
  Play,
  ArrowRight,
  Shield,
  Goal,
  FastForward,
  ChevronDown
} from 'lucide-react';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationModal } from './SimulationModal';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress, Stat, SectionHeader, Panel, Tabs, TabsList, TabsTrigger, TabsContent } from '../ui';
import NewsFeed from './NewsFeed';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function DashboardView() {
  const player = usePlayer();
  const career = useCareer();
  const finances = useFinances();
  const overall = useOverall();
  const simulation = useSimulation();
  
  const [showSimMenu, setShowSimMenu] = useState(false);
  
  // Dummy data for the graph
  const evolutionData = [
    { name: 'Jan', ovr: overall - 5 },
    { name: 'Fev', ovr: overall - 4 },
    { name: 'Mar', ovr: overall - 4 },
    { name: 'Abr', ovr: overall - 2 },
    { name: 'Mai', ovr: overall },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-12">
      
      {/* LEFT COLUMN: IDENTITY & CONDITION */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        
        {/* Player Identity Card */}
        <Card variant="elevated" className="relative overflow-hidden bg-white/5">
          <CardContent className="p-0">
            <div className="relative h-48 bg-zinc-900 border-b border-white/10 flex items-center justify-center overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[60px]" />
              <PlayerPortrait player={player} className="w-full h-full scale-[1.5] translate-y-8 z-0" />
              
              {/* Overlay GER */}
              <div className="absolute top-4 right-4 z-20 flex flex-col items-center">
                <div className="text-3xl font-black text-white drop-shadow-md">{overall}</div>
                <div className="text-[10px] text-amber-500 font-bold tracking-widest uppercase">GER</div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight text-white">{player.name}</h2>
                <Badge variant="gold" className="ml-2">Titular</Badge>
              </div>
              
              <div className="text-sm font-medium text-white/60 flex items-center gap-2 mb-6">
                <span>{player.position}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{player.age} anos</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>BR</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {career.currentClub?.logo ? (
                      <img src={career.currentClub.logo} alt="Club" className="w-6 h-6 object-contain" />
                    ) : (
                      <Shield size={18} className="text-white/40" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Clube</div>
                    <div className="text-sm font-bold text-white line-clamp-1">{career.currentClub?.name || 'Agente Livre'}</div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Camisa</div>
                  <div className="text-sm font-bold text-white">{career.shirtNumber || 10}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Condition Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase tracking-widest text-white/60">Condição Atual</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-white/60 uppercase">Fitness</span>
                <span className="text-sm font-bold text-white">90%</span>
              </div>
              <Progress value={90} indicatorColor="bg-emerald-500" />
            </div>
            
            <div className="flex justify-between items-center py-3 border-t border-white/5">
              <span className="text-xs font-semibold text-white/60 uppercase">Moral</span>
              <Badge variant="success">Excelente</Badge>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-xs font-semibold text-white/60 uppercase">Forma</span>
              <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp size={14} /> Em Alta
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: ACTION & CONTEXT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* Next Match Card */}
        <Card variant="elevated" className="border-amber-500/20 bg-white/5 overflow-visible z-10">
          <CardContent className="p-6 md:p-8">
            <SectionHeader title="Próximo Desafio" description={career.nextMatch?.competition || "Amistoso"} />
            
            {career.nextMatch ? (
              <div className="flex flex-col">
                
                <div className="flex items-center justify-between mb-8">
                  {/* Home */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mb-4 border border-white/10 p-4">
                      {career.nextMatch.isHome ? (
                        career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-full h-full object-contain" /> : <Shield size={24} className="text-white/40" />
                      ) : (
                        career.nextMatch.opponentLogo ? <img src={career.nextMatch.opponentLogo} alt="Away" className="w-full h-full object-contain" /> : <Shield size={24} className="text-white/40" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider text-center">
                      {career.nextMatch.isHome ? career.currentClub?.name : career.nextMatch.opponent}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mx-4">
                    <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">VS</div>
                    <div className="text-sm font-bold text-white">FORA</div>
                  </div>
                  
                  {/* Away */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center mb-4 border border-white/10 p-4">
                      {!career.nextMatch.isHome ? (
                        career.currentClub?.logo ? <img src={career.currentClub.logo} alt="Home" className="w-full h-full object-contain" /> : <Shield size={24} className="text-white/40" />
                      ) : (
                        career.nextMatch.opponentLogo ? <img src={career.nextMatch.opponentLogo} alt="Away" className="w-full h-full object-contain" /> : <Shield size={24} className="text-white/40" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider text-center">
                      {!career.nextMatch.isHome ? career.currentClub?.name : career.nextMatch.opponent}
                    </div>
                  </div>
                </div>

                {/* Simulation Controls */}
                <div className="w-full relative mt-4 z-20">
                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="flex-1 font-bold text-sm tracking-wider uppercase"
                      onClick={() => simulation.startSimulation({ mode: 'NEXT_MATCH' })}
                    >
                      Jogar Partida
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setShowSimMenu(!showSimMenu)}
                      className="px-4"
                    >
                      <FastForward size={20} />
                    </Button>
                  </div>

                  {showSimMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-md shadow-2xl flex flex-col py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-black/20">Simular até</div>
                      <button onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'ONE_MONTH' }) }} className="text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">1 Mês</button>
                      <button onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'THREE_MONTHS' }) }} className="text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">3 Meses</button>
                      <button onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'SIX_MONTHS' }) }} className="text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">6 Meses</button>
                      <button onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'TRANSFER_WINDOW' }) }} className="text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">Fim da Janela</button>
                      <button onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'END_OF_SEASON' }) }} className="text-left px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors">Final da Temporada</button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Calendar className="w-12 h-12 text-white/20 mb-4" />
                <h4 className="text-lg font-semibold text-white">Semana Livre</h4>
                <p className="text-sm text-white/60 mt-1 max-w-sm">Nenhum jogo agendado. Aproveite para treinar ou recuperar seu condicionamento.</p>
                <div className="mt-8 w-full flex gap-2">
                  <Button variant="primary" size="lg" className="flex-1 font-bold text-sm tracking-wider uppercase" onClick={() => simulation.startSimulation({ mode: 'NEXT_MATCH' })}>
                    Avançar Semana
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Secondary Info (Tabs) */}
        <Card className="flex-1">
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs defaultValue="news" className="w-full h-full flex flex-col">
              <div className="px-6 pt-6 pb-2 border-b border-white/5">
                <TabsList>
                  <TabsTrigger value="news">Notícias</TabsTrigger>
                  <TabsTrigger value="stats">Desempenho</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="news" className="p-6 flex-1 m-0 h-[300px]">
                <NewsFeed />
              </TabsContent>
              
              <TabsContent value="stats" className="p-6 m-0 h-[300px]">
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-emerald-500/10">
                      <span className="text-lg font-black text-emerald-400">{overall}</span>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-bold flex items-center gap-1"><TrendingUp size={14} /> +5 GER</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Desde o início da temporada</div>
                    </div>
                  </div>
                  
                  <div className="w-full flex-1 min-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolutionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          itemStyle={{ color: '#34d399' }}
                        />
                        <Line type="monotone" dataKey="ovr" stroke="#34d399" strokeWidth={2} dot={{ r: 4, fill: '#000', stroke: '#34d399', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>
      
      <SimulationModal 
        isOpen={simulation.isSimulating || simulation.result !== null}
        isSimulating={simulation.isSimulating}
        progress={simulation.progress}
        result={simulation.result}
        targetMode={simulation.targetMode}
        interimState={simulation.interimState}
        onCancel={simulation.cancelSimulation}
        onApply={simulation.applyResult}
      />
    </div>
  );
}
