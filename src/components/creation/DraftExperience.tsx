import React, { useState, useEffect, useMemo } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { DraftEngine } from '../../core/domain/draftEngine';
import { DraftMode, DraftState, TechnicalStat, PlayerDNA } from '../../types';
import { DraftCard } from './DraftCard';
import { DraftFixedPanel } from './DraftFixedPanel';
import { DraftReviewModal } from './DraftReviewModal';
import { DraftSummaryView } from './DraftSummaryView';
import { Zap, Eye, EyeOff, FastForward, History, HelpCircle, Keyboard } from 'lucide-react';

interface DraftExperienceProps {
  initialMode?: DraftMode;
}

export const DraftExperience: React.FC<DraftExperienceProps> = ({
  initialMode
}) => {
  const { state, dispatch } = useGameEngine();
  const draftEngine = useMemo(() => new DraftEngine(), []);

  // Modes & Visibility
  const mode: DraftMode = initialMode || state.draftLength || 'QUICK';
  const [visibilityMode, setVisibilityMode] = useState<'OPEN' | 'BLIND'>('BLIND');

  // Animation Speed setting
  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast' | 'instant'>('normal');

  // Draft State initialized via Engine
  const [draftState, setDraftState] = useState<DraftState>(() => {
    return draftEngine.initializeDraft(mode);
  });

  // UI Flow State
  const [inspectedIndex, setInspectedIndex] = useState<number>(0);
  const [revealedCurrentRound, setRevealedCurrentRound] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  const currentRoundIndex = draftState.currentRoundIndex;
  const totalRounds = draftState.rounds.length;
  const currentRound = draftState.rounds[currentRoundIndex];

  // Selected technical stats applied so far
  const statsApplied = useMemo(() => {
    return draftEngine.applyToTechnicalStats(draftState);
  }, [draftState, draftEngine]);

  const estimatedOvr = useMemo(() => {
    return draftEngine.calculateEstimatedOverall(
      statsApplied,
      state.player.position || 'ST'
    );
  }, [statsApplied, state.player.position, draftEngine]);

  // Keyboard navigation & shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || isReviewOpen) return;

      // Card selection 1-5
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentRound && idx < currentRound.options.length) {
          setInspectedIndex(idx);
        }
      }

      // Arrow navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setInspectedIndex((prev) => (prev > 0 ? prev - 1 : currentRound ? currentRound.options.length - 1 : 0));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setInspectedIndex((prev) => (currentRound && prev < currentRound.options.length - 1 ? prev + 1 : 0));
      }

      // Confirm pick via Enter or Space
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleConfirmPick();
      }

      // Toggle Animation Speed via 'a'
      if (e.key === 'a' || e.key === 'A') {
        setAnimationSpeed((prev) => (prev === 'normal' ? 'fast' : prev === 'fast' ? 'instant' : 'normal'));
      }

      // Toggle Review choices modal via 'r'
      if (e.key === 'r' || e.key === 'R') {
        setIsReviewOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRound, inspectedIndex, isFinished, isReviewOpen, draftState]);

  // Handle confirming selected option for current round
  const handleConfirmPick = () => {
    if (!currentRound || isFinished) return;

    const selectedOption = currentRound.options[inspectedIndex];
    if (!selectedOption) return;

    // Reveal attribute value if in Blind Draft
    if (visibilityMode === 'BLIND') {
      setRevealedCurrentRound(true);
    }

    // Apply selection to engine state
    const nextState = draftEngine.selectOption(draftState, selectedOption.idolId);

    // Short delay for reveal feedback
    const delay = animationSpeed === 'instant' ? 0 : animationSpeed === 'fast' ? 200 : 400;

    setTimeout(() => {
      if (draftEngine.isComplete(nextState)) {
        setDraftState(nextState);
        setIsFinished(true);
      } else {
        setDraftState(nextState);
        setInspectedIndex(0);
        setRevealedCurrentRound(false);
      }
    }, delay);
  };

  // Final completion handler: apply to global game state
  const handleFinalCompletion = () => {
    const finalStats = draftEngine.applyToTechnicalStats(draftState) as Record<TechnicalStat, number>;

    dispatch({
      type: 'INITIALIZE_PLAYER',
      payload: {
        technical: finalStats,
        dna: draftState.acquiredDNA
      }
    });

    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' });
  };

  if (isFinished) {
    return (
      <DraftSummaryView
        estimatedOvr={estimatedOvr}
        position={state.player.position || 'ST'}
        acquiredDNA={draftState.acquiredDNA}
        stats={statsApplied}
        onFinish={handleFinalCompletion}
      />
    );
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col lg:flex-row gap-6 relative">
      {/* Top Controls Header */}
      <div className="w-full flex items-center justify-between p-4 bg-zinc-950/90 border-b border-zinc-800 rounded-2xl shadow-xl z-30">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs uppercase tracking-wider">
            Draft {mode === 'QUICK' ? 'Rápido (8)' : 'Completo (20)'}
          </span>
          <span className="text-zinc-400 font-bold text-xs hidden sm:inline">
            Rodada {currentRoundIndex + 1} de {totalRounds}
          </span>
        </div>

        {/* Mode & Speed Toggles */}
        <div className="flex items-center gap-2">
          {/* Blind vs Open Toggle */}
          <button
            onClick={() => setVisibilityMode((prev) => (prev === 'BLIND' ? 'OPEN' : 'BLIND'))}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Alternar entre Draft Aberto e Blind Draft"
          >
            {visibilityMode === 'BLIND' ? (
              <>
                <EyeOff size={14} className="text-amber-400" />
                <span>Blind Draft</span>
              </>
            ) : (
              <>
                <Eye size={14} className="text-cyan-400" />
                <span>Draft Aberto</span>
              </>
            )}
          </button>

          {/* Speed Control Toggle */}
          <button
            onClick={() =>
              setAnimationSpeed((prev) => (prev === 'normal' ? 'fast' : prev === 'fast' ? 'instant' : 'normal'))
            }
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            title="Acelerar animações (Atalho: Tecla A)"
          >
            <FastForward size={14} className="text-yellow-400" />
            <span className="uppercase text-[11px] font-black">
              {animationSpeed === 'normal' ? '1x' : animationSpeed === 'fast' ? '2x' : 'Inst.'}
            </span>
          </button>

          {/* Keyboard Shortcuts Help Button */}
          <button
            onClick={() => setShowKeyboardHelp((prev) => !prev)}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Teclas de Atalho"
          >
            <Keyboard size={16} />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Overlay Banner */}
      {showKeyboardHelp && (
        <div className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-300 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span><strong>[1..5]</strong> Inspecionar Carta</span>
            <span><strong>[← / →]</strong> Navegar</span>
            <span><strong>[Enter / Espaço]</strong> Confirmar Escolha</span>
            <span><strong>[A]</strong> Velocidade</span>
            <span><strong>[R]</strong> Revisar Escolhas</span>
          </div>
          <button
            onClick={() => setShowKeyboardHelp(false)}
            className="text-amber-400 font-bold hover:underline"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Main Center Area: Category Intro & Cards Carousel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        {/* Category Header */}
        {currentRound && (
          <div className="text-center mb-6 animate-fadeIn">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
              Atributo Alvo — Rodada {currentRoundIndex + 1}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
              {currentRound.attributeId}
            </h2>
            <p className="text-xs text-zinc-400 font-bold mt-1">
              Inspecione as opções e confirme qual mestre você deseja absorver
            </p>
          </div>
        )}

        {/* Responsive Cards Carousel Container */}
        <div className="w-full max-w-5xl flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center">
          {currentRound &&
            currentRound.options.map((option, idx) => (
              <div key={`${option.idolId}-${idx}`} className="snap-center">
                <DraftCard
                  option={option}
                  categoryName={currentRound.attributeId}
                  cardNumber={idx + 1}
                  isInspected={inspectedIndex === idx}
                  isConfirmed={draftState.usedIdols.includes(option.idolId)}
                  visibilityMode={visibilityMode}
                  isRevealed={revealedCurrentRound && inspectedIndex === idx}
                  animationSpeed={animationSpeed}
                  onInspect={() => setInspectedIndex(idx)}
                  onConfirm={handleConfirmPick}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Fixed Status Panel */}
      <DraftFixedPanel
        currentRound={currentRoundIndex + 1}
        totalRounds={totalRounds}
        estimatedOvr={estimatedOvr}
        position={state.player.position || 'ST'}
        acquiredDNA={draftState.acquiredDNA}
        stats={statsApplied}
        onOpenReview={() => setIsReviewOpen(true)}
      />

      {/* Review Modal */}
      <DraftReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        rounds={draftState.rounds}
      />
    </div>
  );
};
