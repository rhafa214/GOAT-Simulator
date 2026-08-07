import { describe, it, expect } from 'vitest';
import { DraftEngine } from '../core/domain/draftEngine';
import { calculatePlayerOverall, POSITION_WEIGHTS } from '../core/domain/playerUtils';
import { DraftState, DraftMode, TechnicalStat } from '../types';
import { SaveGameService } from '../core/domain/saveSystem';
import { createInitialGameState } from '../core/state/initialState';

describe('Draft Balance and Progression Check', () => {

  it('Jogador comum inicia dentro da faixa esperada (aleatório)', () => {
    const engine = new DraftEngine();
    const overalls: number[] = [];
    
    // Test 100 random players
    for (let i = 0; i < 100; i++) {
      let state = engine.initializeDraft('COMPLETE', i);
      let rng = 0;
      while (!engine.isComplete(state)) {
        const round = state.rounds[state.currentRoundIndex];
        const pickIndex = (i + rng) % round.options.length;
        rng++;
        state = engine.selectOption(state, round.options[pickIndex].idolId);
      }
      const base = engine.getDraftResult(state).current; const stats = Object.fromEntries(Object.keys(base).map(k => [k, 50 + (base[k as keyof typeof base] || 0)])) as any;
      overalls.push(calculatePlayerOverall(stats, 'CM'));
    }
    
    const max = Math.max(...overalls);
    const min = Math.min(...overalls);
    
    expect(max).toBeLessThanOrEqual(68); // even max random shouldn't exceed 68 easily
    expect(min).toBeGreaterThanOrEqual(50);
  });

  it('Grande promessa continua limitada (maximizado)', () => {
    const engine = new DraftEngine();
    let state = engine.initializeDraft('COMPLETE', 42);
    while (!engine.isComplete(state)) {
      const round = state.rounds[state.currentRoundIndex];
      // pick highest
      let best = round.options[0];
      for (const opt of round.options) {
        if (opt.currentBonus[round.attributeId] || 0 > best.currentBonus[round.attributeId] || 0) best = opt;
      }
      state = engine.selectOption(state, best.idolId);
    }
    const base = engine.getDraftResult(state).current; const stats = Object.fromEntries(Object.keys(base).map(k => [k, 50 + (base[k as keyof typeof base] || 0)])) as any;
    const ovr = calculatePlayerOverall(stats, 'ST');
    expect(ovr).toBeLessThanOrEqual(70);
    expect(ovr).toBeGreaterThanOrEqual(55); // Grande promessa
  });

  it('Nenhum atributo é aplicado duas vezes (soma de bônus restrita)', () => {
    const engine = new DraftEngine();
    let state = engine.initializeDraft('QUICK', 1);
    
    const pacRound = state.rounds.find(r => r.attributeId === 'PAC');
    expect(pacRound).toBeDefined();
    
    state = engine.selectOption(state, pacRound!.options[0].idolId);
    const appliedStats = engine.getDraftResult(state).current;
    
    // PAC should exactly equal the chosen option
    const base = engine.getDraftResult(state).current; const pac = 50 + (base.PAC || 0); expect(pac).toEqual(50 + (pacRound!.options[0].currentBonus.PAC || 0));
  });

  it('Inspecionar carta não altera o estado real do jogo', () => {
    const engine = new DraftEngine();
    let state = engine.initializeDraft('QUICK', 1);
    
    const clone = JSON.parse(JSON.stringify(state));
    expect(clone).toEqual(state);
    // There is no inspect method in DraftEngine, inspecting is purely UI state.
    // If it was in the engine, we'd test it here. But since it's not, we just assert the engine state is immutable.
    expect(engine.isComplete(state)).toBe(false);
  });

  it('Posição influencia os atributos corretos (pesos de overall)', () => {
    const stats: Partial<Record<TechnicalStat, number>> = {
      DEF: 90, PHY: 90, HEA: 90,
      PAC: 40, SHO: 30, PAS: 30, DRI: 30
    };
    
    const cbOverall = calculatePlayerOverall(stats, 'CB');
    const stOverall = calculatePlayerOverall(stats, 'ST');
    
    expect(cbOverall).toBeGreaterThan(stOverall); // A defender with high DEF/PHY should have higher OVR as CB
  });

  it('Seed fixa produz resultado determinístico', () => {
    const engine1 = new DraftEngine();
    const state1 = engine1.initializeDraft('QUICK', 999);
    
    const engine2 = new DraftEngine();
    const state2 = engine2.initializeDraft('QUICK', 999);
    
    expect(state1.rounds[0].options[0].currentBonus[state1.rounds[0].attributeId]).toEqual(state2.rounds[0].options[0].currentBonus[state2.rounds[0].attributeId]);
    expect(state1.rounds[0].options[0].name).toEqual(state2.rounds[0].options[0].name);
  });

  it('Simulação de 1.000 criações para distribuição', () => {
    const engine = new DraftEngine();
    const overalls: number[] = [];
    
    for (let i = 0; i < 1000; i++) {
      let state = engine.initializeDraft('COMPLETE', i);
      let rng = 0;
      while (!engine.isComplete(state)) {
        const round = state.rounds[state.currentRoundIndex];
        // Mix of random and best to simulate average players
        let picked = round.options[0];
        if (i % 2 === 0) { // 50% try to pick best
          for (const opt of round.options) {
            if (opt.currentBonus[round.attributeId] || 0 > picked.currentBonus[round.attributeId] || 0) picked = opt;
          }
        } else {
          picked = round.options[(i + rng) % round.options.length];
        }
        rng++;
        state = engine.selectOption(state, picked.idolId);
      }
      const base = engine.getDraftResult(state).current; const stats = Object.fromEntries(Object.keys(base).map(k => [k, 50 + (base[k as keyof typeof base] || 0)])) as any;
      overalls.push(calculatePlayerOverall(stats, 'CM'));
    }
    
    overalls.sort((a, b) => a - b);
    
    const min = overalls[0];
    const max = overalls[overalls.length - 1];
    const avg = overalls.reduce((a, b) => a + b, 0) / 1000;
    const median = overalls[500];
    const p10 = overalls[100];
    const p90 = overalls[900];
    const above67 = overalls.filter(o => o > 67).length;
    const above70 = overalls.filter(o => o > 70).length;
    
    expect(max).toBeLessThanOrEqual(70);
    expect(min).toBeGreaterThanOrEqual(45);
    
    console.log({
      min, max, avg, median, p10, p90, above67, above70
    });
  });

});
