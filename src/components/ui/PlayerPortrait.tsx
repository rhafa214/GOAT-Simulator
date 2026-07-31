import React from 'react';
import { PlayerAttributes } from '../../types';
import AvatarScene from '../3d/AvatarScene';
import { useGameEngine } from '../../engine/GameEngine';

export function PlayerPortrait({ player, className = '' }: { player: PlayerAttributes, className?: string }) {
  const { state } = useGameEngine();
  const clubColor = state?.career?.currentClub?.primaryColor || '#1a1a1a';
  
  return (
    <div className={`w-full h-full min-h-[300px] relative ${className}`}>
      <AvatarScene 
         appearance={player.appearance}
         clubColor={clubColor}
         pose="idle"
      />
    </div>
  );
}
