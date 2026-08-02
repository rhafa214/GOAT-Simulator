import React from 'react';

export interface GoatStatHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const GoatStatHeader: React.FC<GoatStatHeaderProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
  size = 'md',
  highlight = false,
  icon,
  className = '',
  ...props
}) => {
  const valueSizeClasses = {
    sm: 'text-2xl sm:text-3xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-7xl'
  }[size];

  const trendColor = {
    up: 'text-emerald-400',
    down: 'text-rose-400',
    neutral: 'text-zinc-400'
  }[trend || 'neutral'];

  const trendIcon = {
    up: '▲',
    down: '▼',
    neutral: '●'
  }[trend || 'neutral'];

  return (
    <div className={`flex flex-col gap-1 ${className}`} {...props}>
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
        {icon && <span className="text-amber-400">{icon}</span>}
        <span>{label}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={`font-goat-display font-black tracking-wide leading-none ${valueSizeClasses} ${
            highlight ? 'text-amber-400 goat-gold-text-glow' : 'text-zinc-100'
          }`}
        >
          {value}
        </span>

        {subValue && (
          <span className="text-xs font-semibold text-zinc-400 sm:text-sm">{subValue}</span>
        )}

        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${trendColor}`}>
            <span>{trendIcon}</span>
            {trendValue && <span>{trendValue}</span>}
          </span>
        )}
      </div>
    </div>
  );
};
