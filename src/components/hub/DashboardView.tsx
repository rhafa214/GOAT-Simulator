import React, { useState } from 'react';
import { 
  usePlayer, 
  useCareer, 
  useOverall, 
  useNextMatch, 
  useSeasonStats, 
  useGameState 
} from '../../engine/selectors';
import { useGameEngine } from '../../engine/GameEngine';
import { useSimulation } from '../../hooks/useSimulation';
import { SimulationModal } from './SimulationModal';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import {
  GoatCard,
  GoatButton,
  GoatBadge,
  GoatStatHeader,
  GOAT_TOKENS
} from '../ui/goat';
import { 
  Trophy, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Play, 
  Shield, 
  FastForward, 
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Award,
  Activity,
  Sparkles,
  ArrowRight,
  User,
  Heart,
  ChevronDown
} from 'lucide-react';
import NewsFeed from './NewsFeed';
import PlayerEvolutionChart from './PlayerEvolutionChart';

export default function DashboardView() {
  const { dispatch } = useGameEngine();
  const state = useGameState();
  const player = usePlayer();
  const career = useCareer();
  const overall = useOverall();
  const nextMatch = useNextMatch();
  const seasonStats = useSeasonStats();
  const simulation = useSimulation();

  const [showSimMenu, setShowSimMenu] = useState(false);

  // Derive special states without changing game logic
  const isInjured = player.rpg?.fitness < 40 || Boolean(state.narrative.flags?.injured);
  const pendingProposals = career.transferState?.activeProposals.filter(p => p.status === 'presented') || [];
  const hasPendingProposal = pendingProposals.length > 0;
  
  const isTransferWindowOpen = 
    (career.week >= 1 && career.week <= 8) || 
    (career.week >= 24 && career.week <= 31) || 
    Boolean(career.transferState?.isListed);

  const isFinalMatch = Boolean(nextMatch?.competition?.toLowerCase().includes('final'));
  const hasAward = (career.awards?.ballonDor || 0) > 0 || Boolean(state.narrative.flags?.award_pending);
  const isOffSeason = !nextMatch || career.week > 48;
  const isNearRetirement = player.age >= 35 || Boolean(state.narrative.flags?.near_retirement);

  // Graph data calculation
  const evolutionData = [
    { name: 'S1', ovr: Math.max(50, overall - 4) },
    { name: 'S2', ovr: Math.max(50, overall - 3) },
    { name: 'S3', ovr: Math.max(50, overall - 2) },
    { name: 'S4', ovr: Math.max(50, overall - 1) },
    { name: 'Atual', ovr: overall },
  ];

  const fitnessVal = player.rpg?.fitness ?? 90;
  const moraleVal = player.rpg?.morale ?? 80;

  const getMoraleLabel = (val: number) => {
    if (val >= 80) return { label: 'Excelente', variant: 'victory' as const };
    if (val >= 60) return { label: 'Boa', variant: 'gold' as const };
    if (val >= 40) return { label: 'Regular', variant: 'neutral' as const };
    return { label: 'Baixa', variant: 'defeat' as const };
  };

  const moraleInfo = getMoraleLabel(moraleVal);

  return (
    <div className="flex flex-col gap-6 pb-12 w-full max-w-7xl mx-auto">
      
      {/* SECTION 1: URGENT ALERTS & SPECIAL STATES */}
      {(isInjured || hasPendingProposal || isFinalMatch || hasAward || isOffSeason || isNearRetirement) && (
        <div className="flex flex-col gap-3">
          {/* Injured Alert */}
          {isInjured && (
            <GoatCard variant="defeat" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <Activity className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-rose-200">Atleta Lesionado</h3>
                  <p className="text-xs text-rose-300/80">Condição física abaixo de 40%. Foque em fisioterapia e descanso para evitar agravamento.</p>
                </div>
              </div>
              <GoatButton
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' })}
                className="shrink-0 border-rose-500/40 text-rose-200 hover:bg-rose-950/60"
              >
                Tratamento Médico
              </GoatButton>
            </GoatCard>
          )}

          {/* Transfer Proposal Alert */}
          {hasPendingProposal && (
            <GoatCard variant="gold" glow className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-amber-300">
                    Proposta de Transferência! ({pendingProposals.length})
                  </h3>
                  <p className="text-xs text-amber-200/80">
                    {pendingProposals[0].clubName} ofereceu contrato de €{pendingProposals[0].offerSalary.toLocaleString()}/sem.
                  </p>
                </div>
              </div>
              <GoatButton
                variant="primary"
                size="sm"
                onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'TRANSFERS' })}
                className="shrink-0"
              >
                Analisar Oferta
              </GoatButton>
            </GoatCard>
          )}

          {/* Trophy Final Match Alert */}
          {isFinalMatch && (
            <GoatCard variant="gold" glow obliqueHeader headerTitle="GRANDE FINAL" className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-amber-400 animate-bounce" />
                  <div>
                    <h3 className="text-base font-black uppercase text-amber-300">Decisão de Título no Próximo Jogo</h3>
                    <p className="text-xs text-zinc-300">A hora da glória chegou. O resultado desta partida definirá seu legado na competição.</p>
                  </div>
                </div>
                <GoatButton
                  variant="primary"
                  size="md"
                  glow
                  leftIcon={<Play className="h-4 w-4 fill-current" />}
                  onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'MATCH' })}
                >
                  Entrar em Campo
                </GoatButton>
              </div>
            </GoatCard>
          )}

          {/* Off-Season Alert */}
          {isOffSeason && !isFinalMatch && (
            <GoatCard variant="mineral" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-indigo-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold uppercase text-zinc-100">Período de Pré-Temporada / Férias</h3>
                  <p className="text-xs text-zinc-400">Sem partidas agendadas nesta semana. Avance o calendário para preparar a equipe.</p>
                </div>
              </div>
              <GoatButton
                variant="secondary"
                size="sm"
                onClick={() => simulation.startSimulation({ mode: 'NEXT_MATCH' })}
              >
                Avançar Calendário
              </GoatButton>
            </GoatCard>
          )}

          {/* Retirement Alert */}
          {isNearRetirement && (
            <GoatCard variant="mineral" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-amber-500/30">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold uppercase text-amber-300">Reta Final da Carreira ({player.age} Anos)</h3>
                  <p className="text-xs text-zinc-400">Seu atleta está atingindo a fase veterana. Planeje a despedida perfeita ou continue até o topo.</p>
                </div>
              </div>
              <GoatButton
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'RETIREMENT' })}
                className="text-rose-400 hover:bg-rose-950/40"
              >
                Encerrar Carreira
              </GoatButton>
            </GoatCard>
          )}
        </div>
      )}

      {/* SECTION 2: HERO PLAYER SPOTLIGHT & NEXT MATCH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PLAYER IDENTITY CARD (5 Cols on LG) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GoatCard variant="gold" glow className="relative overflow-hidden">
            <div className="p-6 flex flex-col gap-6">
              
              {/* Header: Player Title & Overall Badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GoatBadge variant="gold" size="sm">
                      {player.position || 'ST'}
                    </GoatBadge>
                    <span className="text-xs font-bold text-zinc-400">#{career.shirtNumber || 10}</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase text-zinc-100 tracking-wide line-clamp-1">
                    {player.name}
                  </h2>
                  <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" />
                    {career.currentClub?.name || 'Sem Clube'}
                  </p>
                </div>

                <GoatStatHeader
                  label="Overall"
                  value={overall}
                  subValue="GER"
                  size="lg"
                  highlight
                />
              </div>

              {/* 3D Silhouette / Player Portrait Display */}
              <div className="relative h-48 w-full rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 flex items-center justify-center overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                <PlayerPortrait player={player} className="h-full w-full object-contain scale-110 translate-y-4" />
                
                {/* Position & Age Floating Badges */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <GoatBadge variant="neutral" size="sm">
                    {player.age} Anos
                  </GoatBadge>
                  {isTransferWindowOpen && (
                    <GoatBadge variant="victory" size="sm">
                      Janela Aberta
                    </GoatBadge>
                  )}
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Liga / Divisão</span>
                  <span className="text-xs font-bold text-zinc-200 line-clamp-1">
                    {career.currentClub?.league || 'Série A'}
                  </span>
                </div>
                <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block">Salário Semanal</span>
                  <span className="text-xs font-bold text-emerald-400">
                    €{(state.finances?.weeklyWage || career.currentClub?.baseSalary || 5000).toLocaleString()}
                  </span>
                </div>
              </div>

            </div>
          </GoatCard>

          {/* PHYSICAL CONDITION & MORALE CARD */}
          <GoatCard variant="mineral" className="p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" />
              Condição Física & Moral
            </h3>

            <div className="space-y-4">
              {/* Fitness Bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs font-bold">
                  <span className="text-zinc-400">Forma Física (Fitness)</span>
                  <span className={fitnessVal < 50 ? 'text-rose-400' : 'text-emerald-400'}>{fitnessVal}%</span>
                </div>
                <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className={`h-full transition-all duration-300 ${fitnessVal < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${fitnessVal}%` }} 
                  />
                </div>
              </div>

              {/* Morale & Form Row */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block mb-1">Moral da Atleta</span>
                  <GoatBadge variant={moraleInfo.variant} size="sm">
                    {moraleInfo.label}
                  </GoatBadge>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-zinc-500 block mb-1">Fase no Clube</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Em Alta</span>
                  </div>
                </div>
              </div>
            </div>
          </GoatCard>
        </div>

        {/* NEXT MATCH & SIMULATION CONTROLS (7 Cols on LG) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* NEXT MATCH HERO CHALLENGE */}
          <GoatCard variant="gold" glow obliqueHeader headerTitle={nextMatch?.competition || "Próxima Partida"} className="p-6">
            {nextMatch ? (
              <div className="flex flex-col gap-6">
                
                {/* VS Display */}
                <div className="flex items-center justify-between gap-4 py-4 px-2 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  {/* Home Team */}
                  <div className="flex flex-col items-center flex-1 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center p-3 mb-2 shadow-md">
                      {nextMatch.isHome ? (
                        career.currentClub?.logo ? (
                          <img src={career.currentClub.logo} alt="Home" className="h-full w-full object-contain" />
                        ) : (
                          <Shield className="h-8 w-8 text-amber-400" />
                        )
                      ) : nextMatch.opponentLogo ? (
                        <img src={nextMatch.opponentLogo} alt="Away" className="h-full w-full object-contain" />
                      ) : (
                        <Shield className="h-8 w-8 text-zinc-500" />
                      )}
                    </div>
                    <span className="text-xs font-extrabold uppercase text-zinc-100 line-clamp-1">
                      {nextMatch.isHome ? career.currentClub?.name : nextMatch.opponent}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">MANDANTE</span>
                  </div>

                  {/* VS Divider */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-lg font-black italic text-amber-400">VS</span>
                    <GoatBadge variant="neutral" size="sm">
                      Semana {career.week}
                    </GoatBadge>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center flex-1 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center p-3 mb-2 shadow-md">
                      {!nextMatch.isHome ? (
                        career.currentClub?.logo ? (
                          <img src={career.currentClub.logo} alt="Home" className="h-full w-full object-contain" />
                        ) : (
                          <Shield className="h-8 w-8 text-amber-400" />
                        )
                      ) : nextMatch.opponentLogo ? (
                        <img src={nextMatch.opponentLogo} alt="Away" className="h-full w-full object-contain" />
                      ) : (
                        <Shield className="h-8 w-8 text-zinc-500" />
                      )}
                    </div>
                    <span className="text-xs font-extrabold uppercase text-zinc-100 line-clamp-1">
                      {!nextMatch.isHome ? career.currentClub?.name : nextMatch.opponent}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold">VISITANTE</span>
                  </div>
                </div>

                {/* Primary Simulation Controls */}
                <div className="relative z-20 flex flex-col sm:flex-row items-center gap-3">
                  <GoatButton
                    variant="primary"
                    size="lg"
                    glow
                    fullWidth
                    leftIcon={<Play className="h-5 w-5 fill-current" />}
                    onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'MATCH' })}
                    className="flex-1"
                  >
                    Jogar Partida
                  </GoatButton>

                  <div className="relative w-full sm:w-auto">
                    <GoatButton
                      variant="secondary"
                      size="lg"
                      onClick={() => setShowSimMenu(!showSimMenu)}
                      rightIcon={<ChevronDown className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      <FastForward className="h-5 w-5 text-amber-400" />
                      <span className="sm:hidden ml-2">Simulação Rápida</span>
                    </GoatButton>

                    {showSimMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col py-2 overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-1.5 text-[10px] font-black uppercase text-amber-400 tracking-wider bg-zinc-950/60 border-b border-zinc-800">
                          Avançar Tempo Até
                        </div>
                        <button
                          onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'ONE_MONTH' }); }}
                          className="text-left px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          1 Mês (4 Semanas)
                        </button>
                        <button
                          onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'THREE_MONTHS' }); }}
                          className="text-left px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          3 Meses
                        </button>
                        <button
                          onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'TRANSFER_WINDOW' }); }}
                          className="text-left px-4 py-2.5 text-xs font-bold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                          Fim da Janela
                        </button>
                        <button
                          onClick={() => { setShowSimMenu(false); simulation.startSimulation({ mode: 'END_OF_SEASON' }); }}
                          className="text-left px-4 py-2.5 text-xs font-bold text-amber-400 hover:bg-zinc-800 transition-colors"
                        >
                          Final da Temporada
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center">
                <Calendar className="h-12 w-12 text-zinc-600 mb-3" />
                <h4 className="text-base font-extrabold uppercase text-zinc-200">Semana sem Jogos Agendados</h4>
                <p className="text-xs text-zinc-400 max-w-sm mt-1">
                  Aproveite o tempo livre para treinar atributos ou recuperar o condicionamento do seu atleta.
                </p>
                <div className="mt-6 w-full max-w-xs">
                  <GoatButton
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => simulation.startSimulation({ mode: 'NEXT_MATCH' })}
                  >
                    Avançar Calendário
                  </GoatButton>
                </div>
              </div>
            )}
          </GoatCard>

          {/* SEASON STATS & GOAT LEGACY METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Season Stats Card */}
            <GoatCard variant="mineral" className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-amber-400" />
                  Estatísticas da Temporada
                </h3>

                <div className="grid grid-cols-2 gap-3 my-2">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
                    <span className="text-2xl font-black text-amber-400 block">
                      {seasonStats?.goals ?? 0}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Gols</span>
                  </div>

                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 text-center">
                    <span className="text-2xl font-black text-emerald-400 block">
                      {seasonStats?.assists ?? 0}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Assistências</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-semibold text-zinc-400">
                <span>Jogos: <strong className="text-zinc-200">{seasonStats?.matchesPlayed ?? 0}</strong></span>
                <span>Nota Média: <strong className="text-amber-400">{seasonStats?.avgRating ? seasonStats.avgRating.toFixed(1) : '7.0'}</strong></span>
              </div>
            </GoatCard>

            {/* GOAT Legacy Progress Card */}
            <GoatCard variant="gold" className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Caminhada Rumo ao GOAT
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold">Bolas de Ouro</span>
                    <span className="font-extrabold text-amber-400">{career.awards?.ballonDor || 0} ★</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold">Chuteiras de Ouro</span>
                    <span className="font-extrabold text-amber-400">{career.awards?.goldenBoot || 0} 👟</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold">Melhor da Partida</span>
                    <span className="font-extrabold text-amber-400">{career.awards?.motm || 0} 🏆</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-300/80">
                <span>Reputação Global</span>
                <span className="uppercase tracking-widest text-amber-400">Nível Lenda</span>
              </div>
            </GoatCard>

          </div>

          {/* EVOLUTION & NEWS FEED TABS CARD */}
          <GoatCard variant="mineral" className="p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Evolução & Bastidores
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-300">Curva de Geral (Evolução)</span>
                  <span className="text-xs font-extrabold text-emerald-400">+5 OVR</span>
                </div>
                <PlayerEvolutionChart evolutionData={evolutionData} />
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <NewsFeed />
              </div>
            </div>
          </GoatCard>

        </div>

      </div>

      {/* SIMULATION MODAL */}
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
