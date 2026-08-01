import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse rounded-md bg-white/10', className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';
