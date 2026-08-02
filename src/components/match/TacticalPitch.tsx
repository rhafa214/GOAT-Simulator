import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Zap } from 'lucide-react';
import { GoatBadge } from '../ui/goat';
import { PlayerPortrait } from '../ui/PlayerPortrait';

interface TacticalPitchProps {
  playerName: string;
  position: string;
  shirtNumber: number;
  overall: number;
  clubName: string;
  player: any;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  playerName,
  position,
  shirtNumber,
  overall,
  clubName,
  player,
}) => {
  // Compute coordinates for pitch positioning
  const getPitchPositionClass = (pos: string) => {
    switch (pos) {
      case 'ST': return 'top-[22%] left-1/2 -translate-x-1/2';
      case 'LW': return 'top-[26%] left-[22%]';
      case 'RW': return 'top-[26%] right-[22%]';
      case 'CAM': return 'top-[42%] left-1/2 -translate-x-1/2';
      case 'CM': return 'top-[52%] left-1/2 -translate-x-1/2';
      case 'CDM': return 'top-[64%] left-1/2 -translate-x-1/2';
      case 'LB': return 'top-[72%] left-[18%]';
      case 'CB': return 'top-[76%] left-1/2 -translate-x-1/2';
      case 'RB': return 'top-[72%] right-[18%]';
      case 'GK': return 'top-[88%] left-1/2 -translate-x-1/2';
      default: return 'top-[50%] left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className="relative w-full rounded-3xl border border-emerald-500/30 bg-zinc-950 p-6 overflow-hidden flex flex-col items-center shadow-2xl">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-black uppercase text-zinc-200 tracking-wider">Escalação & Posição Tática</h3>
        </div>
        <GoatBadge variant="gold" size="sm">
          {position || 'CM'}
        </GoatBadge>
      </div>

      {/* Styled Football Pitch Canvas */}
      <div className="relative w-full h-[320px] sm:h-[360px] rounded-2xl bg-gradient-to-b from-emerald-950 via-emerald-900/80 to-zinc-950 border border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center">
        
        {/* Pitch Lines (Vector lines) */}
        <div className="absolute inset-2 border border-emerald-400/20 rounded-xl pointer-events-none" />
        {/* Center Line & Circle */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-emerald-400/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-emerald-400/20 pointer-events-none" />
        {/* Penalty Boxes */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-44 h-20 border-b border-x border-emerald-400/20 rounded-b-lg pointer-events-none" />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-20 border-t border-x border-emerald-400/20 rounded-t-lg pointer-events-none" />

        {/* Stadium Floodlights Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-48 bg-amber-400/10 blur-[80px] pointer-events-none" />

        {/* Position Marker & Player Card Spotlight */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className={`absolute ${getPitchPositionClass(position)} z-20 flex flex-col items-center group`}
        >
          {/* Pulsing Target Glow */}
          <div className="absolute -inset-4 rounded-full bg-amber-500/20 animate-ping opacity-75" />
          <div className="relative flex flex-col items-center">
            
            {/* Player Avatar Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.6)] border-2 border-white">
              <div className="w-full h-full rounded-full bg-zinc-950 overflow-hidden flex items-center justify-center relative">
                <PlayerPortrait player={player} className="w-full h-full object-contain scale-125 translate-y-1" />
              </div>
            </div>

            {/* Position & Shirt Tag */}
            <div className="-mt-2 bg-black/90 border border-amber-500/60 px-2.5 py-0.5 rounded-full text-center shadow-xl backdrop-blur-md">
              <span className="text-[11px] font-black text-amber-400 tracking-wider">
                {position || 'ST'} #{shirtNumber || 10}
              </span>
            </div>

            <span className="text-xs font-black text-white uppercase tracking-wide mt-1 drop-shadow-md bg-black/60 px-2 py-0.5 rounded-md">
              {playerName}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Player Status Footer Bar */}
      <div className="w-full mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-zinc-400 font-semibold text-[11px]">Overall Atleta</span>
          <span className="font-black text-amber-400 text-sm">{overall} GER</span>
        </div>
        <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-zinc-400 font-semibold text-[11px]">Clube Atual</span>
          <span className="font-extrabold text-white text-xs truncate max-w-[100px]">{clubName}</span>
        </div>
      </div>
    </div>
  );
};
