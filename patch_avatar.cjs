const fs = require('fs');
const path = 'src/components/ui/PlayerAvatar.tsx';
let content = fs.readFileSync(path, 'utf8');

const newContent = `import React from 'react';
import { PlayerAttributes } from '../../types';
import NewPlayerAvatar from '../3d/PlayerAvatar';
import { useGameEngine } from '../../engine/GameEngine';

export function PlayerAvatar({ player, className = '' }: { player: PlayerAttributes, className?: string }) {
  const { state } = useGameEngine();
  const clubColor = state?.career?.currentClub?.primaryColor || '#1a1a1a';
  
  return (
    <div className={\`w-full h-full min-h-[300px] relative \${className}\`}>
      <NewPlayerAvatar 
         appearance={player.appearance}
         clubColor={clubColor}
         pose="idle"
      />
    </div>
  );
}
`;

fs.writeFileSync(path, newContent);
