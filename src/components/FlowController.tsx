import React from 'react';
import { useGameEngine } from '../engine/GameEngine';
import CreationBasicInfo from './creation/CreationBasicInfo';
import CreationPosition from './creation/CreationPosition';
import CreationAppearance from './creation/CreationAppearance';
import CreationDraftLength from './creation/CreationDraftLength';
import CreationPersonality from './creation/CreationPersonality';
import CreationAttributes from './creation/CreationAttributes';
import CreationDraftClub from './creation/CreationDraftClub';
import MainHub from './hub/MainHub';
import EventScreen from './events/EventScreen';
import MuseumView from './museum/MuseumView';

import PostMatchScreen from './hub/PostMatchScreen';

export default function FlowController() {
  const { state } = useGameEngine();

  return (
    <div className="flex-1 w-full min-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-100 font-sans selection:bg-yellow-500/30">
      {/* Background ambient effect - Apple/PS5 style */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80" />
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-yellow-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50 transition-all duration-500">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 to-orange-500 flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
            F
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold tracking-tight text-white/90">GOAT Simulator</h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">O Fenômeno</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {state.player.name && (
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-white/90 tracking-wide">
                   {state.player.name}
                 </span>
                 <div className="h-4 w-[1px] bg-white/10 mx-1" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                   Idade: {state.player.age}
                 </span>
              </div>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {state.phase === 'CREATION_BASIC_INFO' && <CreationBasicInfo />}
        {state.phase === 'CREATION_POSITION' && <CreationPosition />}
        {state.phase === 'CREATION_APPEARANCE' && <CreationAppearance />}
        {state.phase === 'CREATION_DRAFT_LENGTH' && <CreationDraftLength />}
        {state.phase === 'CREATION_ATTRIBUTES' && <CreationAttributes />}
        {state.phase === 'CREATION_PERSONALITY' && <CreationPersonality />}
        {state.phase === 'DRAFT_CLUB' && <CreationDraftClub />}
        
        {state.phase === 'EVENT' && <EventScreen />}
        {state.phase === 'POST_MATCH' && <PostMatchScreen />}
        {state.phase === 'HUB' && <MainHub />}
        {state.phase === 'RETIREMENT' && <MuseumView />}
      </main>
    </div>
  );
}
