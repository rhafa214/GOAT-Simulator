import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, withBorder = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-zinc-900/50 rounded-2xl shadow-inner',
          withBorder && 'border border-white/10',
          className
        )}
        {...props}
      />
    );
  }
);
Panel.displayName = 'Panel';
