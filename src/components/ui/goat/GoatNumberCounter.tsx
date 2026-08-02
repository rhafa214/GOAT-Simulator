import React, { useEffect, useState } from 'react';

export interface GoatNumberCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  formatCurrency?: boolean;
  decimals?: number;
  highlightOnIncrease?: boolean;
}

export const GoatNumberCounter: React.FC<GoatNumberCounterProps> = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  formatCurrency = false,
  decimals = 0,
  highlightOnIncrease = true,
  className = '',
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [isIncreased, setIsIncreased] = useState<boolean>(false);

  useEffect(() => {
    // Check if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || duration <= 0) {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const endValue = value;

    if (endValue > startValue && highlightOnIncrease) {
      setIsIncreased(true);
      const timer = setTimeout(() => setIsIncreased(false), 1000);
      return () => clearTimeout(timer);
    }

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out quad formula
      const easedProgress = progress * (2 - progress);
      const current = startValue + (endValue - startValue) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  const formattedNumber = () => {
    if (formatCurrency) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: decimals
      }).format(displayValue);
    }
    return displayValue.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <span
      className={`font-goat-display font-extrabold transition-colors duration-300 ${
        isIncreased ? 'text-emerald-400 goat-gold-text-glow' : ''
      } ${className}`}
      {...props}
    >
      {prefix}
      {formattedNumber()}
      {suffix}
    </span>
  );
};
