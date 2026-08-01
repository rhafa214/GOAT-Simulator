import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Stat = forwardRef<HTMLDivElement, StatProps>(
  ({ className, label, value, trend, trendValue, size = 'md', ...props }, ref) => {
    const valueSizes = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-4xl',
    };

    const trendColors = {
      up: 'text-emerald-400',
      down: 'text-rose-400',
      neutral: 'text-white/60',
    };

    return (
      <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props}>
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">{label}</span>
        <div className="flex items-baseline gap-2">
          <span className={cn('font-bold text-white', valueSizes[size])}>{value}</span>
          {trend && trendValue && (
            <span className={cn('text-xs font-medium', trendColors[trend])}>
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{trendValue}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Stat.displayName = 'Stat';
