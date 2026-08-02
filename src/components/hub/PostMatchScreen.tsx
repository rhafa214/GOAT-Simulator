import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameEngine } from '../../engine/GameEngine';
import { generateMatchStory, PostMatchLevel } from '../postMatch/postMatchStoryEngine';
import { PostMatchCompact } from '../postMatch/PostMatchCompact';
import { PostMatchComplete } from '../postMatch/PostMatchComplete';
import { PostMatchHistoric } from '../postMatch/PostMatchHistoric';
import { Trophy, ArrowLeft, Layers, ArrowRight } from 'lucide-react';
import { GoatButton } from '../ui/goat';

export default function PostMatchScreen() {
  const { state, dispatch } = useGameEngine();
  const lastMatch = state.career.matches[0];

  const [levelOverride, setLevelOverride] = useState<PostMatchLevel | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleContinue = () => {
    dispatch({ type: 'CHANGE_PHASE', payload: 'HUB' });
  };

  if (!lastMatch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-400 gap-4">
        <Trophy className="w-12 h-12 text-zinc-600 animate-pulse" />
        <p className="text-sm font-bold uppercase tracking-wider">Nenhum relatório de partida recente encontrado.</p>
        <GoatButton variant="secondary" onClick={handleContinue}>
          Voltar ao Hub
        </GoatButton>
      </div>
    );
  }

  const generatedStory = generateMatchStory(state, lastMatch);
  const activeLevel = levelOverride || generatedStory.level;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      data-testid="post-match-screen"
      className="w-full max-w-7xl mx-auto p-4 md:p-6 pb-20 flex flex-col gap-6"
    >
      {/* Top Bar: Return & Level Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <GoatButton
          data-testid="back-to-hub-button"
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={handleContinue}
          className="text-zinc-400 hover:text-white"
        >
          Voltar ao Hub (ESC)
        </GoatButton>

        {/* Presentation Level Selector */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Nível:
          </span>

          <button
            data-testid="level-compact-btn"
            onClick={() => setLevelOverride('COMPACT')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeLevel === 'COMPACT'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            1. Compacto
          </button>

          <button
            data-testid="level-complete-btn"
            onClick={() => setLevelOverride('COMPLETE')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeLevel === 'COMPLETE'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            2. Completo
          </button>

          <button
            data-testid="level-historic-btn"
            onClick={() => setLevelOverride('HISTORIC')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeLevel === 'HISTORIC'
                ? 'bg-amber-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3. Histórico
          </button>
        </div>
      </div>

      {/* Main View Level Render */}
      <AnimatePresence mode="wait">
        {activeLevel === 'COMPACT' && (
          <PostMatchCompact
            key="compact"
            match={lastMatch}
            story={generatedStory}
            state={state}
            onContinue={handleContinue}
          />
        )}

        {activeLevel === 'COMPLETE' && (
          <PostMatchComplete
            key="complete"
            match={lastMatch}
            story={generatedStory}
            state={state}
            onContinue={handleContinue}
          />
        )}

        {activeLevel === 'HISTORIC' && (
          <PostMatchHistoric
            key="historic"
            match={lastMatch}
            story={generatedStory}
            state={state}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
