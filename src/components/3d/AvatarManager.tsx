import React, { createContext, useContext, useState, useMemo } from 'react';
import { PhysicalAppearance } from '../../types';
import { AppearanceValidator } from '../../core/domain/avatar/AppearanceValidator';
import { DEFAULT_APPEARANCE } from '../../core/domain/avatar/AvatarCatalog';

interface AvatarManagerContextType {
  appearance: PhysicalAppearance;
  updateAppearance: (updates: Partial<PhysicalAppearance>) => void;
  quality: 'low' | 'high';
  setQuality: (quality: 'low' | 'high') => void;
}

const AvatarManagerContext = createContext<AvatarManagerContextType | undefined>(undefined);

export function AvatarManagerProvider({ children, initialAppearance }: { children: React.ReactNode, initialAppearance?: Partial<PhysicalAppearance> }) {
  const [appearance, setAppearanceState] = useState<PhysicalAppearance>(() => 
    AppearanceValidator.validate(initialAppearance || {})
  );
  
  const [quality, setQuality] = useState<'low' | 'high'>('high');

  const updateAppearance = (updates: Partial<PhysicalAppearance>) => {
    setAppearanceState((prev) => AppearanceValidator.validate({ ...prev, ...updates }));
  };

  const value = useMemo(() => ({
    appearance,
    updateAppearance,
    quality,
    setQuality
  }), [appearance, quality]);

  return (
    <AvatarManagerContext.Provider value={value}>
      {children}
    </AvatarManagerContext.Provider>
  );
}

export function useAvatarManager() {
  const context = useContext(AvatarManagerContext);
  if (!context) {
    throw new Error('useAvatarManager must be used within an AvatarManagerProvider');
  }
  return context;
}
