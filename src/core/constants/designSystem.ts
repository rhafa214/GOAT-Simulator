export const DESIGN_SYSTEM = {
  colors: {
    primary: {
      DEFAULT: '#EAB308', // yellow-500
      hover: '#CA8A04', // yellow-600
      glow: 'rgba(234, 179, 8, 0.3)',
    },
    secondary: {
      DEFAULT: '#F97316', // orange-500
      hover: '#EA580C', // orange-600
    },
    background: {
      base: '#000000',
      panel: '#09090B', // zinc-950
      card: '#18181B', // zinc-900
      elevated: '#27272A', // zinc-800
    },
    text: {
      primary: '#FAFAFA', // zinc-50
      secondary: '#A1A1AA', // zinc-400
      muted: '#52525B', // zinc-600
    },
    border: {
      subtle: '#27272A', // zinc-800
      default: '#3F3F46', // zinc-700
      highlight: '#52525B', // zinc-600
    },
    status: {
      success: '#22C55E', // green-500
      warning: '#F59E0B', // amber-500
      error: '#EF4444', // red-500
      info: '#3B82F6', // blue-500
    }
  },
  shadows: {
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    glow: '0 0 20px rgba(234, 179, 8, 0.15)',
    glowStrong: '0 0 40px rgba(234, 179, 8, 0.3)',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      heading: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    weights: {
      normal: '400',
      medium: '500',
      bold: '700',
      black: '900',
    }
  },
  radius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem', // 32px
    full: '9999px',
  },
  spacing: {
    '1': '0.25rem', // 4px
    '2': '0.5rem', // 8px
    '3': '0.75rem', // 12px
    '4': '1rem', // 16px
    '6': '1.5rem', // 24px
    '8': '2rem', // 32px
    '12': '3rem', // 48px
  },
  animation: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionFast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionSlow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};
