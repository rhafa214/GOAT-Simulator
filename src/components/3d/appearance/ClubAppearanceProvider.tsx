import React, { createContext, useContext, useEffect, useState } from 'react';
import { KitType, KitDefinition } from './types';
import { KitResolver } from './KitResolver';
import { MaterialLoader, LoadedMaterialData } from './MaterialLoader';

interface ClubAppearanceContextData {
  clubId?: string;
  kitType?: KitType;
  season?: string;
  kitDefinition?: KitDefinition;
  materialData?: LoadedMaterialData;
  isLoading: boolean;
}

const ClubAppearanceContext = createContext<ClubAppearanceContextData>({ isLoading: false });

export interface ClubAppearanceProviderProps {
  clubId?: string;
  kitType?: KitType;
  season?: string;
  children: React.ReactNode;
}

export const ClubAppearanceProvider: React.FC<ClubAppearanceProviderProps> = ({ 
  clubId, 
  kitType = 'home', 
  season, 
  children 
}) => {
  const [kitDefinition, setKitDefinition] = useState<KitDefinition>();
  const [materialData, setMaterialData] = useState<LoadedMaterialData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!clubId) {
      setKitDefinition(undefined);
      setMaterialData(undefined);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const def = KitResolver.resolve(clubId, kitType, season);
      
      if (!isMounted) return;
      setKitDefinition(def);
      
      if (def) {
         try {
           const data = await MaterialLoader.loadKitMaterial(def);
           if (isMounted) {
             setMaterialData(data);
           }
         } catch (e) {
           console.error("[ClubAppearanceProvider] Failed to load kit material", e);
           if (isMounted) setMaterialData(undefined);
         }
      } else {
        if (isMounted) setMaterialData(undefined);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [clubId, kitType, season]);

  return (
    <ClubAppearanceContext.Provider value={{ clubId, kitType, season, kitDefinition, materialData, isLoading }}>
      {children}
    </ClubAppearanceContext.Provider>
  );
};

export const useClubAppearance = () => useContext(ClubAppearanceContext);
