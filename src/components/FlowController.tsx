import React, { Suspense, lazy } from 'react';
import { useGamePhase, usePlayer } from '../engine/selectors';
import { Loader2 } from 'lucide-react';

const CreationBasicInfo = lazy(() => import('./creation/CreationBasicInfo'));
const CreationPosition = lazy(() => import('./creation/CreationPosition'));
const CreationAppearance = lazy(() => import('./creation/CreationAppearance'));
const CreationDraftLength = lazy(() => import('./creation/CreationDraftLength'));
const CreationPersonality = lazy(() => import('./creation/CreationPersonality'));
const CreationAttributes = lazy(() => import('./creation/CreationAttributes'));
const CreationDraftClub = lazy(() => import('./creation/CreationDraftClub'));
const MainHub = lazy(() => import('./hub/MainHub'));
const EventScreen = lazy(() => import('./events/EventScreen'));
const MuseumView = lazy(() => import('./museum/MuseumView'));
const PostMatchScreen = lazy(() => import('./hub/PostMatchScreen'));
const TransferHub = lazy(() => import('../presentation/features/transfers/TransferHub'));
const MainMenu = lazy(() => import('./menu/MainMenu'));

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-400">
      <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mb-4" />
      <span className="text-sm font-bold uppercase tracking-widest">Carregando Tela...</span>
    </div>
  );
}

export default function FlowController() {
  const phase = useGamePhase();
  const player = usePlayer();

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
           {player.name && (
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-white/90 tracking-wide">
                   {player.name}
                 </span>
                 <div className="h-4 w-[1px] bg-white/10 mx-1" />
                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                   Idade: {player.age}
                 </span>
              </div>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <Suspense fallback={<LoadingScreen />}>
          {phase === 'MAIN_MENU' && <MainMenu />}
          {phase === 'CREATION_BASIC_INFO' && <CreationBasicInfo />}
          {phase === 'CREATION_POSITION' && <CreationPosition />}
          {phase === 'CREATION_APPEARANCE' && <CreationAppearance />}
          {phase === 'CREATION_DRAFT_LENGTH' && <CreationDraftLength />}
          {phase === 'CREATION_ATTRIBUTES' && <CreationAttributes />}
          {phase === 'CREATION_PERSONALITY' && <CreationPersonality />}
          {phase === 'DRAFT_CLUB' && <CreationDraftClub />}
          
          {phase === 'EVENT' && <EventScreen />}
          {phase === 'POST_MATCH' && <PostMatchScreen />}
          {phase === 'HUB' && <MainHub />}
          {phase === 'RETIREMENT' && <MuseumView />}
          {phase === 'TRANSFERS' && <TransferHub />}
        </Suspense>
      </main>
    </div>
  );
}
