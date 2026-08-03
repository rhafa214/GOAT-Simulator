import React from 'react';

interface PlayerPortraitFallbackProps {
  skinColor?: string;
  hairColor?: string;
  className?: string;
}

export function PlayerPortraitFallback({ 
  skinColor = '#edb98a', 
  hairColor = '#2c1b18',
  className = '' 
}: PlayerPortraitFallbackProps) {
  return (
    <div 
      className={`w-full h-full flex items-center justify-center bg-zinc-800 overflow-hidden ${className}`}
      data-testid="player-portrait-fallback"
    >
      <div className="relative w-3/4 h-3/4 max-w-sm flex flex-col items-center justify-end">
        {/* Head */}
        <div 
          className="w-32 h-40 rounded-[3rem] z-10 shadow-lg relative"
          style={{ backgroundColor: skinColor }}
        >
          {/* Hair */}
          <div 
            className="absolute -top-4 -left-2 -right-2 h-16 rounded-t-[3.5rem] rounded-b-xl"
            style={{ backgroundColor: hairColor }}
          />
        </div>
        
        {/* Neck */}
        <div 
          className="w-12 h-10 -mt-4 z-0"
          style={{ backgroundColor: skinColor, filter: 'brightness(0.8)' }}
        />
        
        {/* Shoulders / Shirt */}
        <div 
          className="w-48 h-24 bg-zinc-700 rounded-t-3xl z-20 flex justify-center overflow-hidden shadow-inner"
        >
          {/* V-Neck detail */}
          <div className="w-16 h-12 bg-zinc-800 rounded-b-full shadow-inner" />
        </div>
      </div>
    </div>
  );
}
