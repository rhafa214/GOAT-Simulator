import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'outline' | 'gold';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white/10 text-white',
      success: 'bg-emerald-500/20 text-emerald-400',
      danger: 'bg-rose-500/20 text-rose-400',
      warning: 'bg-amber-500/20 text-amber-400',
      gold: 'bg-amber-500 text-black font-semibold',
      outline: 'border border-white/20 text-white/60',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
