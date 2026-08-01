import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { cn } from '../../utils/cn';

export interface IconButtonProps extends Omit<ButtonProps, 'size'> {
  icon: React.ReactNode;
  'aria-label': string; // Enforce accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn('shrink-0', className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
