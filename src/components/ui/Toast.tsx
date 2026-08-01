import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = 'default', title, description, onClose, className, ...props }, ref) => {
    const icons = {
      default: null,
      success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      error: <XCircle className="w-5 h-5 text-rose-500" />,
      warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      info: <Info className="w-5 h-5 text-blue-500" />,
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'pointer-events-auto flex w-full max-w-md rounded-lg bg-zinc-950 border border-white/10 p-4 shadow-xl',
          className
        )}
        {...props}
      >
        <div className="flex gap-3 w-full">
          {icons[variant] && <div className="shrink-0 mt-0.5">{icons[variant]}</div>}
          <div className="flex flex-col gap-1 flex-1">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            {description && <p className="text-sm text-white/60">{description}</p>}
          </div>
          {onClose && (
            <IconButton
              icon={<X className="w-4 h-4" />}
              aria-label="Close"
              variant="ghost"
              className="shrink-0 -mt-1 -mr-1 h-6 w-6 text-white/60 hover:text-white"
              onClick={onClose}
            />
          )}
        </div>
      </div>
    );
  }
);
Toast.displayName = 'Toast';
