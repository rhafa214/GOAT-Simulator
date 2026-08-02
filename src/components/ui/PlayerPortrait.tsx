import React, { Suspense, lazy } from 'react';
import { PlayerAttributes } from '../../types';
import { useGameEngine } from '../../engine/GameEngine';

const AvatarScene = lazy(() => import('../3d/AvatarScene'));

export function PlayerPortrait({ player, className = '' }: { player: PlayerAttributes, className?: string }) {
  const { state } = useGameEngine();
  const clubColor = state?.career?.currentClub?.primaryColor || '#1a1a1a';
  
  return (
    <div className={`w-full h-full min-h-[300px] relative ${className}`} aria-label="Avatar 3D do Jogador" role="img">
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full" aria-busy="true" aria-label="Carregando avatar 3D">
           <div className="w-8 h-8 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
        </div>
      }>
        <AvatarScene 
          clubColor={clubColor} 
          pose="idle"
        />
      </Suspense>
    </div>
  );
}
