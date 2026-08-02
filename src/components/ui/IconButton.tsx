import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = 'primary', size = 'md', isLoading, disabled, 'aria-label': ariaLabel, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none shrink-0';
    
    const variants = {
      primary: 'bg-amber-500 text-black hover:bg-amber-400 active:bg-amber-600',
      secondary: 'bg-white/10 text-white hover:bg-white/20 active:bg-white/5',
      outline: 'border border-white/10 bg-transparent hover:bg-white/5 text-white',
      ghost: 'bg-transparent hover:bg-white/5 text-white',
      danger: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20',
    };
    
    const sizes = {
      sm: 'h-8 w-8 rounded-sm',
      md: 'h-10 w-10 rounded-sm',
      lg: 'h-12 w-12 rounded-md',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
