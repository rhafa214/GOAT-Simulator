import React from 'react';
import { motion } from 'motion/react';
import { DraftOption } from '../../types';
import { Check, Sparkles, HelpCircle, User } from 'lucide-react';

interface DraftCardProps {
  option: DraftOption;
  categoryName: string;
  cardNumber: number;
  isInspected: boolean;
  isConfirmed: boolean;
  visibilityMode: 'OPEN' | 'BLIND';
  isRevealed: boolean;
  animationSpeed: 'normal' | 'fast' | 'instant';
  onInspect: () => void;
  onConfirm: () => void;
}

export const DraftCard: React.FC<DraftCardProps> = ({
  option,
  categoryName,
  cardNumber,
  isInspected,
  isConfirmed,
  visibilityMode,
  isRevealed,
  animationSpeed,
  onInspect,
  onConfirm
}) => {
  const showValue = visibilityMode === 'OPEN' || isRevealed || isConfirmed;

  // Determine motion durations based on speed settings
  const transitionDuration =
    animationSpeed === 'instant' ? 0 : animationSpeed === 'fast' ? 0.15 : 0.35;

  return (
    <motion.div
      initial={{ opacity: 0, y: animationSpeed === 'instant' ? 0 : 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: isInspected ? 1.05 : 1 }}
      transition={{ duration: transitionDuration }}
      onClick={onInspect}
      tabIndex={0}
      role="button"
      aria-label={`Carta ${cardNumber}: ${option.name}, ${option.positionOrEra}, ${option.nationality}. ${showValue ? `${categoryName}: ${option.attributeValue}` : 'Atributo oculto'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isInspected) {
            onConfirm();
          } else {
            onInspect();
          }
        }
      }}
      className={`relative w-64 md:w-56 shrink-0 aspect-[2/3] rounded-2xl p-4 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
        isInspected
          ? 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-black border-2 border-amber-400 shadow-[0_0_35px_rgba(234,179,8,0.4)] z-20 scale-105'
          : 'bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80 z-10'
      } ${isConfirmed ? 'ring-4 ring-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.5)]' : ''}`}
    >
      {/* Keyboard Shortcut Badge */}
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 border border-zinc-700 text-[11px] font-black text-amber-400 tracking-wider">
        [{cardNumber}]
      </div>

      {/* DNA Indicator Badge */}
      {option.dna && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300">
          <Sparkles size={11} className="text-purple-400 animate-pulse" />
          <span>DNA</span>
        </div>
      )}

      {/* Card Header Info */}
      <div className="mt-7 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block mb-0.5">
          {option.nationality} • {option.positionOrEra}
        </span>
        <h3 className="text-lg font-black text-white tracking-tight leading-tight line-clamp-1">
          {option.name}
        </h3>
      </div>

      {/* Portrait Placeholder / Icon */}
      <div className="my-2 flex justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border-2 border-zinc-600 flex items-center justify-center relative overflow-hidden shadow-inner">
          {option.photoUrl ? (
            <img
              src={option.photoUrl}
              alt={option.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-zinc-400" />
          )}
        </div>
      </div>

      {/* Attribute Value Box */}
      <div className={`p-3 rounded-xl border text-center transition-all ${
        showValue
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-500'
      }`}>
        <span className="text-[10px] font-black uppercase tracking-widest block text-zinc-400 mb-0.5">
          {categoryName}
        </span>
        <div className="text-3xl font-black tracking-tight flex items-center justify-center gap-1">
          {showValue ? (
            <span>{option.attributeValue}</span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-400 animate-pulse">
              <HelpCircle size={20} />
              <span>???</span>
            </span>
          )}
        </div>
      </div>

      {/* Confirm Button inside inspected card */}
      <div className="mt-2">
        {isInspected ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Check size={14} className="stroke-[3]" />
            <span>Confirmar Escolha</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect();
            }}
            className="w-full py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-[11px] uppercase tracking-wider rounded-xl transition-colors"
          >
            Inspecionar
          </button>
        )}
      </div>
    </motion.div>
  );
};
