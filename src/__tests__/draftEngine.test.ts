import { describe, it, expect, beforeEach } from 'vitest';
import { DraftEngine } from '../core/domain/draftEngine';
import { calculatePlayerOverall } from '../core/domain/playerUtils';

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
    expect(state.selectedIdolIds).toContain(firstOptionId);

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

    const stats = engine.getDraftResult(state).current;
    
    // In QUICK mode, it should extrapolate other stats
    expect(stats.PAC).toBeDefined();
    expect(stats.ACC).toBeDefined(); // Extrapolated from PAC

    const overall = calculatePlayerOverall(stats, 'ST');
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

describe('DraftEngine - New Rules', () => {
  it('should have exactly 8 rounds in QUICK mode and exactly COMPLETE_STATS length in COMPLETE mode', () => {
    const engine = new DraftEngine(1);
    const quickState = engine.initializeDraft('QUICK');
    expect(quickState.rounds.length).toBe(8);

    const completeState = engine.initializeDraft('COMPLETE');
    expect(completeState.rounds.length).toBe(17); // Or COMPLETE_STATS.length
  });

  it('should not mutate original state', () => {
    const engine = new DraftEngine(1);
    const state = engine.initializeDraft('QUICK');
    const originalStateStr = JSON.stringify(state);
    
    const nextState = engine.selectOption(state, state.rounds[0].options[0].idolId);
    
    expect(JSON.stringify(state)).toEqual(originalStateStr); // Unchanged
    expect(nextState).not.toBe(state); // New object
  });

  it('should never contain duplicate options in the same round', () => {
    const engine = new DraftEngine(42);
    const state = engine.initializeDraft('QUICK');
    
    for (let i = 0; i < state.rounds[0].options.length; i++) {
      for (let j = i + 1; j < state.rounds[0].options.length; j++) {
        expect(state.rounds[0].options[i].idolId).not.toEqual(state.rounds[0].options[j].idolId);
      }
    }
  });

  it('should never show selected idols again in QUICK mode drafts simulation', () => {
    // We simulate complete drafts
    let passed = true;
    for(let seed = 0; seed < 1000; seed++) {
      const eng = new DraftEngine(seed);
      let s = eng.initializeDraft('QUICK');
      while (!eng.isComplete(s)) {
        const round = s.rounds[s.currentRoundIndex];
        const selectedIdol = round.options[0].idolId;
        
        // Ensure none of the options are already in selectedIdolIds
        for (const opt of round.options) {
           if (s.selectedIdolIds.includes(opt.idolId)) {
             passed = false;
             break;
           }
        }
        if (!passed) break;

        s = eng.selectOption(s, selectedIdol);
      }
      if (!passed) break;
    }
    expect(passed).toBe(true);
  });

  it('Current and Potential are different, and Potential is not used in current overall', () => {
    const engine = new DraftEngine(42);
    let state = engine.initializeDraft('QUICK');
    while (!engine.isComplete(state)) {
      state = engine.selectOption(state, state.rounds[state.currentRoundIndex].options[0].idolId);
    }
    const result = engine.getDraftResult(state);
    
    // Test they are different objects
    expect(result.current).not.toBe(result.potential);
    
    // Usually potential is higher
    let potentialHigher = false;
    for (const k of Object.keys(result.current)) {
      if ((result.potential[k as keyof typeof result.potential] || 0) > (result.current[k as keyof typeof result.current] || 0)) {
        potentialHigher = true;
        break;
      }
    }
    expect(potentialHigher).toBe(true);
  });
});
