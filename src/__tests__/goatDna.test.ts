import { describe, it, expect } from 'vitest';
import { DraftEngine } from '../core/domain/draftEngine';
import { calculatePlayerOverall } from '../core/domain/playerUtils';
import { generateInitialPlayerStats } from '../core/domain/potentialSystem';
import { DraftOption } from '../types';

describe('GOAT DNA (Potential System)', () => {
  it('gerar milhares de drafts validando comportamentos do GOAT DNA', () => {
    const engine = new DraftEngine();
    let maxOverall = 0;
    let minOverall = 99;
    
    // Simulate 1000 drafts
    for (let i = 0; i < 1000; i++) {
      let state = engine.initializeDraft('COMPLETE', i);
      let rng = 0;
      
      const seenCards = new Set<string>();
      let hasDuplicates = false;
      
      while (!engine.isComplete(state)) {
        const round = state.rounds[state.currentRoundIndex];
        
        // Check duplicates in round
        for (const opt of round.options) {
          if (seenCards.has(opt.idolId)) {
            hasDuplicates = true;
          }
        }
        
        // Pick an option
        const pickIndex = (i + rng) % round.options.length;
        rng++;
        const chosen = round.options[pickIndex];
        seenCards.add(chosen.idolId);
        
        state = engine.selectOption(state, chosen.idolId);
      }
      
      expect(hasDuplicates).toBe(false);
      
      // Compute the stats with GOAT DNA logic
      const draftResult = engine.getDraftResult(state);
      const position = 'CAM'; // Randomly choose one to test
      
      const { technical, potential, growthProfile, overallCurrent, potentialOverall } = generateInitialPlayerStats(position, i, draftResult.current, draftResult.potential, state.acquiredDNA);
      
      // 1. nenhum Overall inicial acima do permitido (70)
      expect(overallCurrent).toBeLessThanOrEqual(70);
      expect(overallCurrent).toBeGreaterThanOrEqual(60);
      
      maxOverall = Math.max(maxOverall, overallCurrent);
      minOverall = Math.min(minOverall, overallCurrent);
      
      // 2. Potential sempre maior ou igual ao Overall Atual
      expect(potentialOverall).toBeGreaterThanOrEqual(overallCurrent);
      
      // Check that it's between 75 and 99
      expect(potentialOverall).toBeGreaterThanOrEqual(75);
      expect(potentialOverall).toBeLessThanOrEqual(99);
      
      // Growth Profile must be assigned
      expect(growthProfile).toBeDefined();
    }
  });

  it('comportamento determinístico usando seed', () => {
    const engine = new DraftEngine();
    let state = engine.initializeDraft('QUICK', 42);
    state = engine.selectOption(state, state.rounds[0].options[0].idolId);
    
    const draftResult1 = engine.getDraftResult(state);
    const gen1 = generateInitialPlayerStats('ST', 42, draftResult1.current, draftResult1.potential, state.acquiredDNA);
    
    const gen2 = generateInitialPlayerStats('ST', 42, draftResult1.current, draftResult1.potential, state.acquiredDNA);
    
    expect(gen1.technical).toEqual(gen2.technical);
    expect(gen1.potential).toEqual(gen2.potential);
    expect(gen1.growthProfile).toEqual(gen2.growthProfile);
  });
  
  it('cartas continuam influenciando corretamente o potencial', () => {
     // A player with zero draft potential vs high draft potential
     const genLow = generateInitialPlayerStats('CB', 1, {}, {}, []);
     
     // Give a massive draft bonus
     const highDraft = { DEF: 99, PHY: 99 };
     const genHigh = generateInitialPlayerStats('CB', 1, {}, highDraft, [{ id: '1', type: 'TRAIT', originId: 'some', name: 'A', rarity: 'LEGENDARY', description: '' }]);
     
     expect(genHigh.potentialOverall).toBeGreaterThan(genLow.potentialOverall);
  });
});
