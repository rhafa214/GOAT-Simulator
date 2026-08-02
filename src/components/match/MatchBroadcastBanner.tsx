import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Shield, MapPin, Tv, Clock, Sparkles } from 'lucide-react';
import { GoatBadge } from '../ui/goat';

interface MatchBroadcastBannerProps {
  homeTeam: { name: string; logo?: string; isUserTeam: boolean };
  awayTeam: { name: string; logo?: string; isUserTeam: boolean };
  competition: string;
  stadiumName: string;
  importanceLabel: string;
  weatherCondition: string;
  isImportant: boolean;
}

export const MatchBroadcastBanner: React.FC<MatchBroadcastBannerProps> = ({
  homeTeam,
  awayTeam,
  competition,
  stadiumName,
  importanceLabel,
  weatherCondition,
  isImportant,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black shadow-2xl p-6 md:p-8">
      {/* Floodlight Beam Atmosphere Effects */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* TV Graphic Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-600/90 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse shadow-lg shadow-rose-900/50">
            <Tv className="w-3.5 h-3.5" /> GOAT SPORTS AO VIVO
          </div>
          <GoatBadge variant={isImportant ? 'gold' : 'neutral'} size="sm">
            {importanceLabel}
          </GoatBadge>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Trophy className="w-4 h-4" /> {competition}
          </span>
          <span className="hidden sm:flex items-center gap-1 text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {stadiumName}
          </span>
        </div>
      </div>

      {/* Main Scoreboard & Crests Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 my-2">
        {/* Home Team */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-5 flex items-center justify-start md:justify-end gap-4 text-left md:text-right"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">MANDANTE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1">
              {homeTeam.name}
            </h2>
            {homeTeam.isUserTeam && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                Seu Clube
              </span>
            )}
          </div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/80 border border-white/10 p-3 flex items-center justify-center shrink-0 shadow-2xl relative">
            {homeTeam.logo ? (
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-contain drop-shadow-md" referrerPolicy="no-referrer" />
            ) : (
              <Shield className="w-10 h-10 text-amber-400" />
            )}
          </div>
        </motion.div>

        {/* VS / Match Time Display */}
        <div className="md:col-span-2 flex flex-col items-center justify-center text-center my-2 md:my-0">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg backdrop-blur-md">
              <span className="text-xl font-black italic tracking-wider text-amber-400">VS</span>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-[11px] font-extrabold uppercase text-zinc-400 tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> 20:00 HR
          </div>
        </div>

        {/* Away Team */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-5 flex items-center justify-start gap-4 text-left"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900/80 border border-white/10 p-3 flex items-center justify-center shrink-0 shadow-2xl relative">
            {awayTeam.logo ? (
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-contain drop-shadow-md" referrerPolicy="no-referrer" />
            ) : (
              <Shield className="w-10 h-10 text-cyan-400" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">VISITANTE</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1">
              {awayTeam.name}
            </h2>
            {awayTeam.isUserTeam && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                Seu Clube
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sub-info bar */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-medium text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Clima: {weatherCondition}</span>
        </div>
        <div className="text-zinc-500 text-[11px]">
          Transmissão exclusiva GOAT TV • Iluminação Estilizada 4K
        </div>
      </div>
    </div>
  );
};
