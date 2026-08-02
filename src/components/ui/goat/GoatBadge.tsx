import React from 'react';

export interface GoatBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'victory' | 'defeat' | 'draw' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  oblique?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const GoatBadge: React.FC<GoatBadgeProps> = ({
  variant = 'gold',
  size = 'md',
  oblique = false,
  glow = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-bold gap-1',
    md: 'text-xs px-2.5 py-1 font-extrabold gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold gap-2'
  }[size];

  const variantClasses = {
    gold: 'bg-amber-500/20 text-amber-300 border border-amber-500/50',
    victory: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50',
    defeat: 'bg-rose-500/20 text-rose-300 border border-rose-500/50',
    draw: 'bg-sky-500/20 text-sky-300 border border-sky-500/50',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/50',
    info: 'bg-sky-500/20 text-sky-300 border border-sky-500/50',
    neutral: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/80'
  }[variant];

  const obliqueClass = oblique ? '-skew-x-12 inline-block' : '';
  const obliqueTextClass = oblique ? 'skew-x-12 inline-block' : '';
  const glowClass = glow || variant === 'gold' ? 'goat-gold-text-glow' : '';

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider rounded-lg ${sizeClasses} ${variantClasses} ${obliqueClass} ${className}`}
      {...props}
    >
      <span className={`inline-flex items-center ${obliqueTextClass} ${glowClass}`}>
        {icon && <span className="mr-1 inline-flex shrink-0">{icon}</span>}
        {children}
      </span>
    </span>
  );
};
