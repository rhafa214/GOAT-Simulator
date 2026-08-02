import React, { useState, useRef, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = 'top', delay = 300, className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [tooltipId] = useState(() => `tooltip-${Math.random().toString(36).substring(2, 9)}`);

    const handleMouseEnter = () => {
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(false);
    };

    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
      <div 
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-describedby={isVisible ? tooltipId : undefined}
        {...props}
      >
        {children}
        {isVisible && (
          <div 
            id={tooltipId}
            role="tooltip"
            className={cn(
              'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-zinc-900 border border-white/10 rounded-sm shadow-xl whitespace-nowrap motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95',
              positionClasses[position],
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';
