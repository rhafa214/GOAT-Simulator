import React from 'react';
import { GOAT_TOKENS } from './tokens';

export interface GoatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

export const GoatButton: React.FC<GoatButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  glow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold font-goat-body transition-all duration-200 select-none rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';

  const sizeClasses = {
    sm: 'h-9 px-3 text-xs gap-1.5 min-h-[36px]',
    md: 'h-11 px-5 text-sm gap-2 min-h-[44px]', // 44px min touch target
    lg: 'h-14 px-7 text-base gap-2.5 min-h-[52px]'
  }[size];

  const variantClasses = {
    primary:
      'bg-amber-500 text-black hover:bg-amber-400 active:bg-amber-600 font-extrabold tracking-wide uppercase shadow-lg shadow-amber-500/20',
    secondary:
      'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700/80',
    outline:
      'bg-transparent border-2 border-amber-500/80 text-amber-400 hover:bg-amber-500/10 active:bg-amber-500/20 font-bold',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 font-bold shadow-lg shadow-rose-600/20',
    ghost:
      'bg-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white active:bg-zinc-800'
  }[variant];

  const glowClass = glow && variant === 'primary' ? 'goat-gold-glow' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${glowClass} ${widthClass} ${GOAT_TOKENS.focusState} ${GOAT_TOKENS.motion.reducedMotionClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
