import React from 'react';
import { GameProvider } from './engine/GameEngine';
import FlowController from './components/FlowController';

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
        <FlowController />
      </div>
    </GameProvider>
  );
}
