import React from 'react';
import { Trophy, Shield, Play, ChevronDown, MapPin, Calendar } from 'lucide-react';
import { GoatButton, GoatCard, GoatBadge } from '../ui/goat';

interface CompactMatchViewProps {
  homeTeam: { name: string; logo?: string; isUserTeam: boolean };
  awayTeam: { name: string; logo?: string; isUserTeam: boolean };
  competition: string;
  stadiumName: string;
  onSimulate: () => void;
  onExpand: () => void;
}

export const CompactMatchView: React.FC<CompactMatchViewProps> = ({
  homeTeam,
  awayTeam,
  competition,
  stadiumName,
  onSimulate,
  onExpand,
}) => {
  return (
    <GoatCard variant="mineral" className="p-6 md:p-8 w-full max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Trophy className="w-4 h-4" />
          <span>{competition}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          <span>{stadiumName}</span>
        </div>
      </div>

      {/* Teams Display */}
      <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-4 my-4">
        {/* Home */}
        <div className="sm:col-span-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0">
            {homeTeam.logo ? (
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <Shield className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white line-clamp-1">{homeTeam.name}</h3>
            {homeTeam.isUserTeam && <GoatBadge variant="gold" size="sm">Seu Clube</GoatBadge>}
          </div>
        </div>

        {/* VS */}
        <div className="sm:col-span-3 text-center my-2 sm:my-0">
          <span className="text-lg font-black italic text-zinc-500">VS</span>
        </div>

        {/* Away */}
        <div className="sm:col-span-4 flex items-center justify-start sm:justify-end gap-3 text-left sm:text-right">
          <div className="order-2 sm:order-1">
            <h3 className="text-base font-extrabold text-white line-clamp-1">{awayTeam.name}</h3>
            {awayTeam.isUserTeam && <GoatBadge variant="gold" size="sm">Seu Clube</GoatBadge>}
          </div>
          <div className="order-1 sm:order-2 w-12 h-12 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0">
            {awayTeam.logo ? (
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              <Shield className="w-6 h-6 text-cyan-400" />
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <GoatButton
          variant="ghost"
          size="sm"
          rightIcon={<ChevronDown className="w-4 h-4" />}
          onClick={onExpand}
          className="text-zinc-400 hover:text-white"
        >
          Ver Apresentação Completa
        </GoatButton>

        <GoatButton
          variant="primary"
          size="lg"
          glow
          leftIcon={<Play className="w-5 h-5 fill-current" />}
          onClick={onSimulate}
          className="w-full sm:w-auto"
        >
          Simular Partida
        </GoatButton>
      </div>
    </GoatCard>
  );
};
