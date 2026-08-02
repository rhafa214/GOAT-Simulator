import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameEngine } from '../../engine/GameEngine';
import { usePlayer, useCareer, useOverall, useNextMatch } from '../../engine/selectors';
import { detectMatchContext } from './matchContextDetector';
import { MatchBroadcastBanner } from './MatchBroadcastBanner';
import { TacticalPitch } from './TacticalPitch';
import { MatchObjectivesCard } from './MatchObjectivesCard';
import { CompactMatchView } from './CompactMatchView';
import { GoatButton, GoatBadge } from '../ui/goat';
import { Play, ArrowLeft, Shield, Trophy } from 'lucide-react';

export default function MatchDayScreen() {
  const { state, dispatch } = useGameEngine();
  const player = usePlayer();
  const career = useCareer();
  const overall = useOverall();
  const nextMatch = useNextMatch();

  const [forceFullView, setForceFullView] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Detect context and importance
  const contextDetails = detectMatchContext(state);
  const showBroadcast = contextDetails.isImportant || forceFullView;

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' });
      } else if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        handleSimulateMatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleSimulateMatch = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Run simulation via advance week reducer, then set phase to POST_MATCH
    setTimeout(() => {
      dispatch({ type: 'ADVANCE_WEEK' });
      dispatch({ type: 'CHANGE_PHASE', payload: 'POST_MATCH' });
    }, 400);
  };

  if (!nextMatch || !career.currentClub) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 gap-4">
        <Trophy className="w-12 h-12 text-zinc-600 animate-pulse" />
        <p className="text-sm font-bold uppercase tracking-wider">Nenhuma partida agendada para esta semana.</p>
        <GoatButton variant="secondary" onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' })}>
          Voltar ao Hub
        </GoatButton>
      </div>
    );
  }

  const currentClubName = career.currentClub.name;
  const currentClubLogo = career.currentClub.logo;

  const homeTeam = nextMatch.isHome
    ? { name: currentClubName, logo: currentClubLogo, isUserTeam: true }
    : { name: nextMatch.opponent, logo: nextMatch.opponentLogo, isUserTeam: false };

  const awayTeam = nextMatch.isHome
    ? { name: nextMatch.opponent, logo: nextMatch.opponentLogo, isUserTeam: false }
    : { name: currentClubName, logo: currentClubLogo, isUserTeam: true };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      data-testid="match-day-screen"
      className="w-full max-w-7xl mx-auto p-4 md:p-6 pb-20 flex flex-col gap-6"
    >
      {/* Top Safe Return Bar */}
      <div className="flex items-center justify-between">
        <GoatButton
          data-testid="back-button"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' })}
          className="text-zinc-400 hover:text-white"
        >
          Voltar ao Hub (ESC)
        </GoatButton>

        <div className="flex items-center gap-2">
          <GoatBadge variant={contextDetails.isImportant ? 'gold' : 'neutral'} size="sm">
            Match Day • {nextMatch.competition}
          </GoatBadge>
        </div>
      </div>

      {!showBroadcast ? (
        /* Compact Version for Regular Matches */
        <CompactMatchView
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          competition={nextMatch.competition}
          stadiumName={contextDetails.stadiumName}
          onSimulate={handleSimulateMatch}
          onExpand={() => setForceFullView(true)}
        />
      ) : (
        /* Full Broadcast Presentation for Important Matches */
        <div className="flex flex-col gap-6 w-full">
          {/* TV Broadcast Banner */}
          <MatchBroadcastBanner
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            competition={nextMatch.competition}
            stadiumName={contextDetails.stadiumName}
            importanceLabel={contextDetails.importanceLabel}
            weatherCondition={contextDetails.weatherCondition}
            isImportant={contextDetails.isImportant}
          />

          {/* Grid Layout: Tactical Pitch & Objectives */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Tactical Pitch (5 Cols) */}
            <div className="lg:col-span-5 w-full">
              <TacticalPitch
                playerName={player.name}
                position={player.position || 'CM'}
                shirtNumber={career.shirtNumber || 10}
                overall={overall}
                clubName={currentClubName}
                player={player}
              />
            </div>

            {/* Objectives & Context (7 Cols) */}
            <div className="lg:col-span-7 w-full">
              <MatchObjectivesCard
                objectives={contextDetails.objectives}
                fitness={player.rpg.fitness}
                morale={player.rpg.morale}
                recentForm={contextDetails.recentForm}
                potentialRecords={contextDetails.potentialRecords}
                narrativeContext={contextDetails.narrativeContext}
              />
            </div>
          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="sticky bottom-4 z-40 bg-zinc-950/90 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-xs font-black uppercase text-zinc-100 tracking-wider block">
                  Pronto para Entrar em Campo
                </span>
                <span className="text-[11px] text-zinc-400">
                  Pressione ENTER ou ESPAÇO para simular a partida
                </span>
              </div>
            </div>

            <GoatButton
              data-testid="simulate-match-button"
              variant="primary"
              size="lg"
              glow
              disabled={isSimulating}
              leftIcon={<Play className="w-5 h-5 fill-current" />}
              onClick={handleSimulateMatch}
              className="w-full sm:w-auto"
            >
              {isSimulating ? 'Entrando em Campo...' : 'Simular Partida'}
            </GoatButton>
          </div>
        </div>
      )}
    </motion.div>
  );
}
