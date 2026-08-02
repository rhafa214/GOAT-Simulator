import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorColor?: string;
  showLabel?: boolean;
  'aria-label'?: string;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorColor = 'bg-amber-500', showLabel = false, 'aria-label': ariaLabel = 'Progresso', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div 
        className={cn("flex flex-col gap-1.5 w-full", className)} 
        {...props} 
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel}
      >
        {showLabel && (
          <div className="flex justify-between text-xs text-white/60">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={cn("h-full w-full flex-1 transition-all duration-500 ease-out", indicatorColor)}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';
