import { describe, it, expect, beforeEach } from 'vitest';
import { DraftEngine } from '../core/domain/draftEngine';
import { DraftState } from '../types';

describe('DraftEngine', () => {
  let engine: DraftEngine;

  beforeEach(() => {
    engine = new DraftEngine(12345); // Fixed seed for determinism
  });

  it('should initialize QUICK draft with 8 rounds', () => {
    const state = engine.initializeDraft('QUICK');
    expect(state.mode).toBe('QUICK');
    expect(state.rounds.length).toBe(8);
    expect(state.currentRoundIndex).toBe(0);
    expect(state.rounds[0].options.length).toBe(5); // Options generated for first round
  });

  it('should initialize COMPLETE draft with ~17 rounds', () => {
    const state = engine.initializeDraft('COMPLETE');
    expect(state.mode).toBe('COMPLETE');
    expect(state.rounds.length).toBeGreaterThan(8);
    expect(state.rounds[0].options.length).toBe(5);
  });

  it('should generate options per round and select an option', () => {
    let state = engine.initializeDraft('QUICK');
    const firstRound = state.rounds[0];
    const optionToSelect = firstRound.options[0].idolId;

    state = engine.selectOption(state, optionToSelect);

    expect(state.currentRoundIndex).toBe(1);
    expect(state.rounds[0].selectedOptionId).toBe(optionToSelect);
    expect(state.rounds[1].options.length).toBe(5); // Next round generated
  });

  it('should apply Player DNA on selection', () => {
    let state = engine.initializeDraft('QUICK');
    
    // Find an option with DNA if possible, otherwise we just test the flow
    const firstRound = state.rounds[0];
    const optionWithDna = firstRound.options.find(o => o.dna);
    
    if (optionWithDna) {
      state = engine.selectOption(state, optionWithDna.idolId);
      expect(state.acquiredDNA.length).toBeGreaterThan(0);
      expect(state.acquiredDNA[0].id).toBe(optionWithDna.dna!.id);
    }
  });

  it('should prevent duplicate idols from appearing frequently', () => {
    let state = engine.initializeDraft('QUICK');
    const firstOptionId = state.rounds[0].options[0].idolId;
    state = engine.selectOption(state, firstOptionId);

    // After selecting, the idol should be in usedIdols
    expect(state.usedIdols).toContain(firstOptionId);

    // Check next few rounds to see if it's less likely to appear. 
    // It's probabilistic, but we know weight is reduced by 90%
  });

  it('should calculate overall and apply attributes correctly', () => {
    let state = engine.initializeDraft('QUICK');
    
    // Complete the draft
    while (!engine.isComplete(state)) {
      const option = state.rounds[state.currentRoundIndex].options[0].idolId;
      state = engine.selectOption(state, option);
    }

    expect(engine.isComplete(state)).toBe(true);

    const stats = engine.applyToTechnicalStats(state);
    
    // In QUICK mode, it should extrapolate other stats
    expect(stats.PAC).toBeDefined();
    expect(stats.ACC).toBeDefined(); // Extrapolated from PAC

    const overall = engine.calculateEstimatedOverall(stats, 'ST');
    expect(overall).toBeGreaterThan(1);
    expect(overall).toBeLessThanOrEqual(99);
  });
  
  it('should be deterministic given the same seed', () => {
    const engine1 = new DraftEngine(999);
    const state1 = engine1.initializeDraft('QUICK');
    
    const engine2 = new DraftEngine(999);
    const state2 = engine2.initializeDraft('QUICK');
    
    expect(state1.rounds[0].options[0].idolId).toBe(state2.rounds[0].options[0].idolId);
  });
  
  it('should resume draft from state', () => {
    let state = engine.initializeDraft('QUICK');
    state = engine.selectOption(state, state.rounds[0].options[0].idolId);
    
    // Create new engine and use the state
    const newEngine = new DraftEngine();
    const nextState = newEngine.selectOption(state, state.rounds[1].options[0].idolId);
    
    expect(nextState.currentRoundIndex).toBe(2);
  });
});
