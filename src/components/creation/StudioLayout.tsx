import React from 'react';
import { PlayerPortrait } from '../ui/PlayerPortrait';
import { useGameEngine } from '../../engine/GameEngine';
import { PhysicalAppearance } from '../../types';
import { motion } from 'motion/react';

interface StudioLayoutProps {
  children: React.ReactNode;
  customAppearance?: PhysicalAppearance;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export function StudioLayout({ children, customAppearance, title, subtitle, footer }: StudioLayoutProps) {
  const { state } = useGameEngine();
  const playerState = customAppearance ? { ...state.player, appearance: customAppearance } : state.player;
  const clubColor = state.career?.currentClub ? state.career.currentClub.primaryColor : '#111111';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full min-h-[85vh] flex flex-col lg:flex-row rounded-[2rem] overflow-hidden bg-black border border-white/5 shadow-2xl relative"
    >
       {/* Background */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-[#050505] z-0" />
       
       {/* Avatar Area (65%) */}
       <div className="w-full lg:w-[65%] h-[50vh] lg:h-auto relative z-10 flex flex-col">
          <PlayerPortrait player={playerState} clubColorOverride={clubColor} className="w-full h-full object-cover" />
       </div>
       
       {/* Form Area (35%) */}
       <div className="w-full lg:w-[35%] h-auto lg:h-auto bg-zinc-950/80 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-10 relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-8 border-b border-white/10 bg-gradient-to-b from-zinc-900/40 to-transparent">
             <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 tracking-tight drop-shadow-sm">{title}</h2>
             {subtitle && <p className="text-zinc-400 text-sm font-semibold">{subtitle}</p>}
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
             {children}
          </div>
          {footer && (
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
              {footer}
            </div>
          )}
       </div>
    </motion.div>
  );
}
