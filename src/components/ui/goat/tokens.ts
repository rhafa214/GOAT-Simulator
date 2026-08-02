/**
 * GOAT Visual Design System Tokens
 * Pitch Black & GOAT Gold Broadcast Theme
 */

export const GOAT_TOKENS = {
  colors: {
    background: {
      pitch: '#000000',
      stadium: '#09090B',
      surface: '#121215',
      surfaceElevated: '#18181B',
      surfaceHover: '#27272A'
    },
    brand: {
      gold: '#F59E0B',
      goldHover: '#D97706',
      goldLight: '#FCD34D',
      goldDark: '#B45309',
      goldGlow: 'rgba(245, 158, 11, 0.25)'
    },
    state: {
      victory: '#10B981',
      victoryBg: 'rgba(16, 185, 129, 0.1)',
      defeat: '#EF4444',
      defeatBg: 'rgba(239, 68, 68, 0.1)',
      draw: '#38BDF8',
      drawBg: 'rgba(56, 189, 248, 0.1)',
      injury: '#F43F5E',
      warning: '#F59E0B',
      info: '#0EA5E9'
    },
    neutral: {
      white: '#FAFAFA',
      gray100: '#F4F4F5',
      gray300: '#D4D4D8',
      gray400: '#A1A1AA',
      gray500: '#71717A',
      gray700: '#3F3F46',
      gray800: '#27272A',
      gray900: '#18181B'
    }
  },
  typography: {
    display: "'Bebas Neue', 'Oswald', 'Impact', 'Arial Narrow', sans-serif",
    body: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem'  // 60px
    }
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    '2xl': '2rem',  // 32px
    '3xl': '3rem'   // 48px
  },
  radius: {
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem',// 24px
    full: '9999px'
  },
  shadows: {
    card: '0 10px 30px -10px rgba(0, 0, 0, 0.8)',
    goldGlow: '0 0 20px rgba(245, 158, 11, 0.25)',
    goldText: '0 0 12px rgba(245, 158, 11, 0.4)',
    elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.9), 0 8px 10px -6px rgba(0, 0, 0, 0.9)'
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '250ms',
    durationSlow: '400ms',
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    reducedMotionClass: 'motion-reduce:transition-none motion-reduce:transform-none'
  },
  zIndex: {
    base: 0,
    card: 10,
    header: 20,
    dropdown: 30,
    modalBackdrop: 40,
    modalContent: 50,
    toast: 60
  },
  breakpoints: {
    mobileSm: '360px',
    mobileMd: '390px',
    tabletPort: '768px',
    tabletLand: '1024px',
    desktopHd: '1366px',
    desktopFullHd: '1920px'
  },
  focusState: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
} as const;

export type GoatVariant = 'default' | 'gold' | 'victory' | 'defeat' | 'draw' | 'warning' | 'ghost';
