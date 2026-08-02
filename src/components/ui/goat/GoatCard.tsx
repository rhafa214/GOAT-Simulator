import React from 'react';
import { GoatVariant, GOAT_TOKENS } from './tokens';

export interface GoatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gold' | 'victory' | 'defeat' | 'draw' | 'mineral';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
  glow?: boolean;
  obliqueHeader?: boolean;
  headerTitle?: React.ReactNode;
  headerBadge?: React.ReactNode;
  children: React.ReactNode;
}

export const GoatCard: React.FC<GoatCardProps> = ({
  variant = 'default',
  padding = 'md',
  interactive = false,
  glow = false,
  obliqueHeader = false,
  headerTitle,
  headerBadge,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const isInteractive = interactive || onClick !== undefined;
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  }[padding];

  const variantClasses = {
    default: 'bg-zinc-950/80 border-zinc-800/80 text-zinc-100',
    mineral: 'bg-zinc-900/90 border-zinc-700/80 text-zinc-100',
    gold: 'bg-gradient-to-b from-amber-950/40 to-zinc-950/90 border-amber-500/50 text-amber-100',
    victory: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100',
    defeat: 'bg-rose-950/30 border-rose-500/40 text-rose-100',
    draw: 'bg-sky-950/30 border-sky-500/40 text-sky-100'
  }[variant];

  const glowClass = glow || variant === 'gold' ? 'goat-gold-glow' : '';
  const interactiveClasses = isInteractive
    ? `cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/80 hover:bg-zinc-900/90 active:translate-y-0 ${GOAT_TOKENS.focusState}`
    : '';

  return (
    <div
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
              }
            }
          : undefined
      }
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-colors ${paddingClasses} ${variantClasses} ${glowClass} ${interactiveClasses} ${GOAT_TOKENS.motion.reducedMotionClass} ${className}`}
      {...props}
    >

      {/* Decorative Oblique Header Bar if specified */}
      {obliqueHeader && (
        <div className="mb-4 flex items-center justify-between border-b border-zinc-800/80 pb-3">
          {headerTitle && (
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 -skew-x-12 rounded-sm bg-amber-500" />
              <h3 className="font-goat-display text-lg uppercase tracking-wider text-zinc-100 sm:text-xl">
                {headerTitle}
              </h3>
            </div>
          )}
          {headerBadge && <div>{headerBadge}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
