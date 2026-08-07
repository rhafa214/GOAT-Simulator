import { Position, TechnicalStat, PlayerDNA, GrowthProfile } from '../../types';
import { calculatePlayerOverall } from './playerUtils';
import { SeededRNG } from '../../utils/rng';

const PROFILES: GrowthProfile[] = [
  'Late Bloomer', 'Wonderkid', 'Consistent', 'Explosive', 
  'Late Peak', 'Injury Prone', 'High Discipline', 'Low Discipline'
];

export const STATS_LIST: TechnicalStat[] = [
  'PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY', 'HEA', 'VIS', 'WF', 'SM', 'CON', 'ACC', 'STA', 'JUM', 'FK', 'PEN', 'CRE'
];

export function generateInitialPlayerStats(
  position: Position | '',
  seed: number,
  draftCurrent: Partial<Record<TechnicalStat, number>>,
  draftPotential: Partial<Record<TechnicalStat, number>>,
  dna: PlayerDNA[]
) {
  const rng = new SeededRNG(seed);
  
  // 1. Generate targetOverall: 60 to 70
  let targetOverall = 60 + Math.floor(rng.random() * 9); // 60-68
  if (rng.random() < 0.05) { // 5% chance of 69-70
    targetOverall = 69 + Math.floor(rng.random() * 2); 
  }
  
  // 2. Distribute technical stats around targetOverall
  const technical: Record<TechnicalStat, number> = {} as any;
  for (const s of STATS_LIST) {
    if (s === 'WF' || s === 'SM') {
      technical[s] = 3;
    } else {
      technical[s] = targetOverall - 3 + Math.floor(rng.random() * 7); // targetOverall +/- 3
    }
  }

  // 3. Apply draftCurrent bonuses
  for (const s of STATS_LIST) {
    if (s !== 'WF' && s !== 'SM') {
       // Extract the bonus (it's 50 + bonus in draftCurrent)
       const bonusVal = draftCurrent[s] !== undefined ? draftCurrent[s]! : 50;
       const bonus = Math.max(0, Math.floor((bonusVal - 50) * 0.4)); // Apply a fraction of the current bonus
       technical[s] = Math.min(85, technical[s] + bonus);
    }
  }

  // 4. Refine until calculatePlayerOverall matches exactly a valid range (60-70)
  let currentOvr = calculatePlayerOverall(technical, position);
  let iterations = 0;
  
  while ((currentOvr > 70 || currentOvr < 60) && iterations < 1000) {
    const diff = currentOvr > 70 ? -1 : 1;
    const statToAdjust = STATS_LIST[Math.floor(rng.random() * STATS_LIST.length)];
    if (statToAdjust !== 'WF' && statToAdjust !== 'SM') {
      technical[statToAdjust] += diff;
      technical[statToAdjust] = Math.max(10, Math.min(99, technical[statToAdjust]));
    }
    currentOvr = calculatePlayerOverall(technical, position);
    iterations++;
  }

  // 5. Generate potential based on Draft Bonuses
  const potential: Record<TechnicalStat, number> = {} as any;
  for (const s of STATS_LIST) {
    if (s === 'WF' || s === 'SM') {
      potential[s] = technical[s];
    } else {
      const bonusVal = draftPotential[s] !== undefined ? draftPotential[s]! : 50;
      const bonus = Math.max(0, bonusVal - 50);
      potential[s] = technical[s] + bonus + Math.floor(rng.random() * 5); // Add draft bonus + some random noise
      potential[s] = Math.max(technical[s], Math.min(99, potential[s]));
    }
  }

  // 6. Calculate and adjust potential overall (must be between 75 and 99, and >= currentOvr)
  let pOvr = calculatePlayerOverall(potential, position);
  iterations = 0;
  
  // Boost if too low
  while (pOvr < 75 && iterations < 1000) {
    const statToAdjust = STATS_LIST[Math.floor(rng.random() * STATS_LIST.length)];
    if (statToAdjust !== 'WF' && statToAdjust !== 'SM' && potential[statToAdjust] < 99) {
      potential[statToAdjust]++;
    }
    pOvr = calculatePlayerOverall(potential, position);
    iterations++;
  }

  // Nerf if too high (over 99)
  iterations = 0;
  while (pOvr > 99 && iterations < 1000) {
    const statToAdjust = STATS_LIST[Math.floor(rng.random() * STATS_LIST.length)];
    if (statToAdjust !== 'WF' && statToAdjust !== 'SM' && potential[statToAdjust] > technical[statToAdjust]) {
      potential[statToAdjust]--;
    }
    pOvr = calculatePlayerOverall(potential, position);
    iterations++;
  }

  // 7. Assign GrowthProfile deterministically
  let profileScore = seed % 100;
  for (const d of dna) {
    profileScore += d.rarity === 'LEGENDARY' ? 40 : d.rarity === 'EPIC' ? 30 : 10;
  }
  let growthProfile: GrowthProfile = 'Consistent';
  const potDiff = pOvr - currentOvr;
  if (pOvr >= 90 && currentOvr < 65) {
     growthProfile = 'Late Bloomer';
  } else if (pOvr >= 90 && currentOvr >= 65) {
     growthProfile = 'Wonderkid';
  } else if (potDiff < 10) {
     growthProfile = 'Late Peak';
  } else {
     const profiles: GrowthProfile[] = ['Consistent', 'Explosive', 'Injury Prone', 'High Discipline', 'Low Discipline'];
     growthProfile = profiles[profileScore % profiles.length];
  }

  return { technical, potential, growthProfile, overallCurrent: currentOvr, potentialOverall: pOvr };
}
