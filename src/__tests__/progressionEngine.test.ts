import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerProgressionEngine, ProgressionParams } from '../core/domain/progressionEngine';
import { ProgressionState } from '../types';
import { TechnicalStat } from '../types';
import { IRNG, SeededRNG } from '../utils/rng';

describe('PlayerProgressionEngine', () => {
  let rng: IRNG;
  let baseStats: Record<TechnicalStat, number>;
  let baseProgression: ProgressionState;

  beforeEach(() => {
    rng = new SeededRNG(12345); // Deterministic seed
    baseStats = {
      PAC: 70, SHO: 70, PAS: 70, DRI: 70, DEF: 70, PHY: 70, HEA: 70,
      VIS: 70, WF: 3, SM: 3, CON: 70, ACC: 70, STA: 70, JUM: 70, FK: 70, PEN: 70, CRE: 70
    };
    baseProgression = PlayerProgressionEngine.initializeProgression(rng, 85);
  });

  it('initializes correctly', () => {
    expect(baseProgression.potential).toBeGreaterThanOrEqual(80);
    expect(baseProgression.potential).toBeLessThanOrEqual(90);
    expect(baseProgression.temporaryForm).toBe(0);
    expect(baseProgression.developmentPoints).toEqual({});
  });

  it('accumulates XP over a week for a young player', () => {
    const params: ProgressionParams = {
      age: 18,
      position: 'ST',
      personality: 'PROFESSIONAL',
      dna: [],
      minutesPlayed: 90,
      matchRating: 8.0,
      trainingLoad: 100,
      isInjured: false,
      clubFacilitiesLevel: 80,
      coachQuality: 80
    };

    const result = PlayerProgressionEngine.processWeek(baseStats, baseProgression, params, rng);
    
    // XP should increase
    expect(Object.keys(result.progression.developmentPoints).length).toBeGreaterThan(0);
    
    // As a ST (ATTACKER), SHO should get more XP than DEF
    expect(result.progression.developmentPoints.SHO).toBeGreaterThan(result.progression.developmentPoints.DEF!);
    
    // Form should increase slightly due to good match
    expect(result.progression.temporaryForm).toBeGreaterThan(0);
  });

  it('decreases stats for older players past decline age', () => {
    baseProgression.declineAge = 32;
    const params: ProgressionParams = {
      age: 35, // Past decline age
      position: 'CM',
      personality: 'NORMAL' as any,
      dna: [],
      minutesPlayed: 0, // Not playing
      matchRating: 0,
      trainingLoad: 50, // Modified for new decline system
      isInjured: false,
      clubFacilitiesLevel: 50,
      coachQuality: 50
    };

    let currentStats = { ...baseStats };
    let currentProg = { ...baseProgression };
    let declined = false;

    // Simulate multiple weeks to guarantee decline
    for (let i = 0; i < 100; i++) {
      const res = PlayerProgressionEngine.processWeek(currentStats, currentProg, params, rng);
      currentStats = res.technical;
      currentProg = res.progression;
      if (res.events.some(e => e.startsWith('DECLINE'))) {
        declined = true;
      }
    }

    expect(declined).toBe(true);
    // At least one stat should be less than 70
    const anyDeclined = Object.values(currentStats).some(val => val < 70);
    expect(anyDeclined).toBe(true);
  });

  it('triggers breakthrough for great young player performances', () => {
    const params: ProgressionParams = {
      age: 18,
      position: 'CAM',
      personality: 'PROFESSIONAL',
      dna: [],
      minutesPlayed: 90,
      matchRating: 9.5, // Exceptional rating
      trainingLoad: 100,
      isInjured: false,
      clubFacilitiesLevel: 100,
      coachQuality: 100
    };

    let breakthrough = false;
    let currentStats = { ...baseStats };
    let currentProg = { ...baseProgression };

    // It's a chance-based event, so run a few times
    for (let i = 0; i < 200; i++) {
      const res = PlayerProgressionEngine.processWeek(currentStats, currentProg, params, rng);
      currentStats = res.technical;
      currentProg = res.progression;
      if (res.events.includes('BREAKTHROUGH')) {
        breakthrough = true;
        break;
      }
    }

    expect(breakthrough).toBe(true);
  });
});
