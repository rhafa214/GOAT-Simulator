import React, { createContext, useContext, useState, forwardRef, KeyboardEvent, useRef } from 'react';
import { cn } from '../../utils/cn';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
    const [baseId] = useState(() => `tabs-${Math.random().toString(36).substring(2, 9)}`);
    
    const currentValue = value !== undefined ? value : uncontrolledValue;

    const handleChange = (newValue: string) => {
      setUncontrolledValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onChange: handleChange, baseId }}>
        <div ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export const TabsList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onKeyDown, ...props }, ref) => {
    
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(e);
      
      const target = e.target as HTMLElement;
      if (target.getAttribute('role') !== 'tab') return;
      
      const list = target.closest('[role="tablist"]');
      if (!list) return;
      
      const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
      const index = tabs.indexOf(target);
      
      if (index === -1) return;
      
      let nextIndex = index;
      
      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        e.preventDefault();
      } else if (e.key === 'Home') {
        nextIndex = 0;
        e.preventDefault();
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
        e.preventDefault();
      }
      
      if (nextIndex !== index) {
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn('inline-flex h-10 items-center justify-center rounded-md bg-white/5 p-1 text-white/60', className)}
        {...props}
      />
    );
  }
);
TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within Tabs');

    const isSelected = context.value === value;
    const triggerId = `${context.baseId}-trigger-${value}`;
    const panelId = `${context.baseId}-panel-${value}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => context.onChange(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected ? 'bg-white text-black shadow-sm' : 'hover:bg-white/10 hover:text-white',
          className
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within Tabs');

    const isSelected = context.value === value;
    const triggerId = `${context.baseId}-trigger-${value}`;
    const panelId = `${context.baseId}-panel-${value}`;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={cn('mt-2 ring-offset-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2', className)}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';
