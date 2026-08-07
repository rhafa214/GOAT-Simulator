import { TechnicalStat, Position } from '../../types';

export const POSITION_WEIGHTS: Record<Position, Partial<Record<TechnicalStat, number>>> = {
  ST: { PAC: 15, SHO: 25, PAS: 5, DRI: 15, DEF: 0, PHY: 15, HEA: 10, VIS: 5, CON: 10 },
  LW: { PAC: 25, SHO: 15, PAS: 15, DRI: 25, DEF: 0, PHY: 5, CON: 10, CRE: 5 },
  RW: { PAC: 25, SHO: 15, PAS: 15, DRI: 25, DEF: 0, PHY: 5, CON: 10, CRE: 5 },
  CAM: { PAC: 10, SHO: 15, PAS: 25, DRI: 20, DEF: 5, PHY: 5, VIS: 15, CRE: 5 },
  CM: { PAC: 5, SHO: 10, PAS: 25, DRI: 15, DEF: 15, PHY: 15, VIS: 10, STA: 5 },
  CDM: { PAC: 5, SHO: 5, PAS: 15, DRI: 5, DEF: 30, PHY: 25, STA: 10, HEA: 5 },
  LB: { PAC: 20, SHO: 5, PAS: 15, DRI: 10, DEF: 25, PHY: 15, STA: 10 },
  RB: { PAC: 20, SHO: 5, PAS: 15, DRI: 10, DEF: 25, PHY: 15, STA: 10 },
  CB: { PAC: 5, SHO: 0, PAS: 5, DRI: 0, DEF: 40, PHY: 30, HEA: 20 },
  GK: { DEF: 20, PHY: 20, PAS: 10, CON: 10, VIS: 10, CRE: 10, ACC: 10, JUM: 10 } // Simplified for GK
};

export function calculatePlayerOverall(stats: Partial<Record<TechnicalStat, number>>, position: Position | ''): number {
  if (!position || !POSITION_WEIGHTS[position]) {
    // Fallback: simple average if no position
    const values = Object.values(stats).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 50;
    return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
  }

  const weights = POSITION_WEIGHTS[position];
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [stat, weight] of Object.entries(weights)) {
    const statVal = stats[stat as TechnicalStat] || 30; // base fallback for missing stats
    weightedSum += statVal * (weight as number);
    totalWeight += (weight as number);
  }

  if (totalWeight === 0) return 50;
  return Math.floor(weightedSum / totalWeight);
}

export function calculatePotentialOverall(potentialStats: Partial<Record<TechnicalStat, number>>, position: Position | ''): number {
  return calculatePlayerOverall(potentialStats, position);
}
