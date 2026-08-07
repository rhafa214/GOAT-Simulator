import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerProgressionEngine, ProgressionParams } from '../core/domain/progressionEngine';
import { SeededRNG } from '../utils/rng';
import { GrowthProfile, TechnicalStat, ProgressionState } from '../types';
import { calculatePlayerOverall } from '../core/domain/playerUtils';

describe('Career Growth Curve Simulation (20 Seasons)', () => {
  const rng = new SeededRNG(42);
  const profiles: GrowthProfile[] = ['Wonderkid', 'Late Bloomer', 'Explosive', 'Consistent', 'Late Peak'];

  it.each(profiles)('should simulate 20 seasons correctly for %s', (profile) => {
    let currentStats: Record<TechnicalStat, number> = {
      PAC: 60, SHO: 60, PAS: 60, DRI: 60, DEF: 60, PHY: 60, HEA: 60, VIS: 60,
      WF: 3, SM: 3, CON: 60, ACC: 60, STA: 60, JUM: 60, FK: 60, PEN: 60, CRE: 60
    } as any;

    let potentialStats: Record<TechnicalStat, number> = {
      PAC: 90, SHO: 90, PAS: 90, DRI: 90, DEF: 90, PHY: 90, HEA: 90, VIS: 90,
      WF: 3, SM: 3, CON: 90, ACC: 90, STA: 90, JUM: 90, FK: 90, PEN: 90, CRE: 90
    } as any;

    let progression: ProgressionState = PlayerProgressionEngine.initializeProgression(rng, 90, profile);
    
    let age = 16;
    let overalls = [];

    // Simulate 20 seasons (until age 35)
    for (let season = 0; season < 20; season++) {
      for (let week = 0; week < 52; week++) {
        const params: ProgressionParams = {
          age: age,
          position: 'CM',
          personality: 'PROFESSIONAL',
          dna: [],
          minutesPlayed: 90, // play every week
          matchRating: 8.5,
          trainingFocus: 'GENERAL',
          trainingLoad: 60,
          isInjured: false,
          clubFacilitiesLevel: 80,
          coachQuality: 80,
          potentialStats
        };

        const result = PlayerProgressionEngine.processWeek(currentStats, progression, params, rng);
        currentStats = result.technical;
        progression = result.progression;
      }
      
      overalls.push({ age, ovr: calculatePlayerOverall(currentStats, 'CM') });
      age++;
    }

    // Validation checks
    const finalOvr = overalls[19].ovr;
    const peakOvr = Math.max(...overalls.map(o => o.ovr));
    const peakAge = overalls.find(o => o.ovr === peakOvr)?.age || 16;

    // Output stats for the prompt request
    console.log(`\nProfile: ${profile}`);
    console.log(`Peak Age: ${peakAge}, Peak Ovr: ${peakOvr}, Final Ovr (35): ${finalOvr}`);
    console.log(overalls.map(o => `${o.age}:${o.ovr}`).join(' | '));

    expect(peakOvr).toBeLessThanOrEqual(95); 
    
    for (const stat of Object.keys(currentStats) as TechnicalStat[]) {
      if (stat !== 'WF' && stat !== 'SM') {
        expect(currentStats[stat]).toBeLessThanOrEqual(potentialStats[stat] + 1);
      }
    }
  });
});
