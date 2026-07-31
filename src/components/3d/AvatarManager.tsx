import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { PhysicalAppearance } from '../../types';

interface AvatarContextType {
  appearance: PhysicalAppearance;
  setAppearance: (app: PhysicalAppearance) => void;
  pose: 'idle' | 'confident' | 'celebration' | 'arms_crossed';
  setPose: (pose: 'idle' | 'confident' | 'celebration' | 'arms_crossed') => void;
  clubColor: string;
  setClubColor: (color: string) => void;
}

const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children, initialAppearance, initialClubColor = '#ffffff' }: { children: ReactNode, initialAppearance: PhysicalAppearance, initialClubColor?: string }) {
  const [appearance, setAppearance] = useState<PhysicalAppearance>(initialAppearance);
  const [pose, setPose] = useState<'idle' | 'confident' | 'celebration' | 'arms_crossed'>('idle');
  const [clubColor, setClubColor] = useState(initialClubColor);

  const value = useMemo(() => ({
    appearance,
    setAppearance,
    pose,
    setPose,
    clubColor,
    setClubColor
  }), [appearance, pose, clubColor]);

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>;
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider");
  return ctx;
}
