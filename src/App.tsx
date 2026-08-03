import React from 'react';
import { GameProvider } from './engine/GameEngine';
import FlowController from './components/FlowController';
import { GlobalErrorBoundary } from './components/ui/GlobalErrorBoundary';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <GameProvider>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-yellow-500/30">
          <FlowController />
        </div>
      </GameProvider>
    </GlobalErrorBoundary>
  );
}
