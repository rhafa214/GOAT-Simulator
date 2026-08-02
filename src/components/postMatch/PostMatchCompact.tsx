import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Activity, Smile, Zap, Play, AlertCircle, ShieldAlert } from 'lucide-react';
import { MatchStats, GameState } from '../../types';
import { GeneratedMatchStory } from './postMatchStoryEngine';
import { GoatBadge, GoatButton } from '../ui/goat';

interface PostMatchCompactProps {
  match: MatchStats;
  story: GeneratedMatchStory;
  state: GameState;
  onContinue: () => void;
}

export function PostMatchCompact({ match, story, state, onContinue }: PostMatchCompactProps) {
  const { career } = state;
  const club = career.currentClub;
  const nextMatch = career.nextMatch;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-3xl mx-auto bg-zinc-950/95 backdrop-blur-2xl border border-zinc-800/90 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Level Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <GoatBadge variant="neutral" size="sm">
            Nível 1 • Resumo Compacto
          </GoatBadge>
          <span className="text-xs text-zinc-400 font-medium">
            {match.competition} • Semana {match.week}
          </span>
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${story.resultColor}`}>
          {story.resultLabel}
        </span>
      </div>

      {/* Scoreboard */}
      <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 shadow-inner">
        {/* User Team */}
        <div className="flex items-center gap-4 flex-1">
          {club?.logo ? (
            <img src={club.logo} alt={club.name} className="w-14 h-14 object-contain drop-shadow" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-xl">
              {club?.name?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <h3 className="text-lg font-black text-white leading-snug">{club?.name || 'Seu Clube'}</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Mandante</span>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 px-6 py-2 bg-black/60 border border-zinc-800 rounded-xl">
          <span className="text-3xl md:text-4xl font-black text-white">{story.homeScore}</span>
          <span className="text-zinc-600 font-bold text-lg">x</span>
          <span className="text-3xl md:text-4xl font-black text-white">{story.awayScore}</span>
        </div>

        {/* Opponent Team */}
        <div className="flex items-center gap-4 flex-1 justify-end text-right">
          <div>
            <h3 className="text-lg font-black text-white leading-snug">{match.opponent}</h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Visitante</span>
          </div>
          {match.opponentLogo ? (
            <img src={match.opponentLogo} alt={match.opponent} className="w-14 h-14 object-contain drop-shadow" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-zinc-300 text-xl">
              {match.opponent.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Primary Player Performance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Rating */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400" /> Nota
          </div>
          <div className={`text-3xl font-black ${match.rating >= 8 ? 'text-amber-400' : match.rating >= 6.5 ? 'text-zinc-100' : 'text-rose-400'}`}>
            {match.rating.toFixed(1)}
          </div>
        </div>

        {/* Minutes & Goals */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Play className="w-3.5 h-3.5 text-blue-400" /> Minutos / Gols
          </div>
          <div className="text-xl font-black text-white">
            {match.minutesPlayed}' <span className="text-amber-400">({match.goals}G, {match.assists}A)</span>
          </div>
        </div>

        {/* Cards */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Cartões
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
              🟨 {match.yellowCards || 0}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
              🟥 {match.redCards || 0}
            </span>
          </div>
        </div>

        {/* RPG Shift */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> Evolução
          </div>
          <div className="text-sm font-black text-emerald-400">
            +{story.evolution.xpGained} XP
          </div>
          <div className="text-[10px] text-zinc-400 font-medium">
            Moral {story.evolution.moraleChange >= 0 ? `+${story.evolution.moraleChange}` : story.evolution.moraleChange}%
          </div>
        </div>
      </div>

      {/* Next Match Commitment */}
      {nextMatch && (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">Próximo Compromisso</span>
              <span className="text-xs font-bold text-zinc-200">
                vs {nextMatch.opponent} ({nextMatch.isHome ? 'Casa' : 'Fora'}) • {nextMatch.competition}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-end pt-2">
        <GoatButton
          data-testid="continue-career-button"
          variant="primary"
          size="lg"
          glow
          rightIcon={<ArrowRight className="w-5 h-5" />}
          onClick={onContinue}
          className="w-full sm:w-auto px-8"
        >
          Continuar Carreira
        </GoatButton>
      </div>
    </motion.div>
  );
}
