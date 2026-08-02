import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title = 'Something went wrong', message = 'An unexpected error occurred.', onRetry, className, ...props }, ref) => {
    return (
      <div 
        ref={ref}
        role="alert"
        className={cn('flex flex-col items-center justify-center p-8 text-center border border-rose-500/20 rounded-2xl bg-rose-500/5', className)}
        {...props}
      >
        <AlertCircle className="w-10 h-10 text-rose-500 mb-4" />
        <h3 className="text-lg font-semibold text-rose-100">{title}</h3>
        <p className="mt-2 text-sm text-rose-200/70 max-w-sm">{message}</p>
        {onRetry && (
          <Button variant="danger" className="mt-6" onClick={onRetry}>
            Try Again
          </Button>
        )}
      </div>
    );
  }
);
ErrorState.displayName = 'ErrorState';
