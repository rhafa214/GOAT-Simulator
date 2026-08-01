import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, description, action, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6', className)}
        {...props}
      >
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
          {description && <p className="text-sm text-white/60">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
