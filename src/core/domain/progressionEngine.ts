import { TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType, ProgressionState, GrowthProfile } from '../../types';
import { IRNG } from '../../utils/rng';

export type PositionCategory = 'ATTACKER' | 'MIDFIELDER' | 'DEFENDER' | 'GOALKEEPER';

export interface ProgressionParams {
  age: number;
  position: Position | '';
  personality: PersonalityTrait | '';
  dna: PlayerDNA[];
  minutesPlayed: number; // 0-90
  matchRating: number; // 0-10, null if didn't play
  trainingFocus?: TrainingSessionType;
  trainingLoad: number; // 0-100
  isInjured: boolean;
  injurySeverity?: number; // 1-100
  clubFacilitiesLevel: number; // 1-100
  coachQuality: number; // 1-100
  potentialStats?: Record<TechnicalStat, number>;
}

export interface ProgressionResult {
  technical: Record<TechnicalStat, number>;
  progression: ProgressionState;
  events: string[];
}

export const XP_PER_ATTRIBUTE_POINT = 1000;
export const PHYSICAL_STATS: TechnicalStat[] = ['PAC', 'PHY', 'STA', 'JUM', 'ACC'];
export const TECHNICAL_STATS: TechnicalStat[] = ['SHO', 'PAS', 'DRI', 'DEF', 'HEA', 'VIS', 'CON', 'FK', 'PEN', 'CRE'];

export class PlayerProgressionEngine {

  public static initializeProgression(rng: IRNG, potentialOverall: number, growthProfile: GrowthProfile = 'Consistent'): ProgressionState {
    const curveRoll = rng.random();
    let curve: 'EARLY_PEAK' | 'NORMAL' | 'LATE_BLOOMER' = 'NORMAL';
    let peakAge = 26;
    let declineAge = 30;

    if (curveRoll < 0.2) {
      curve = 'EARLY_PEAK';
      peakAge = 23;
      declineAge = 28;
    } else if (curveRoll > 0.8) {
      curve = 'LATE_BLOOMER';
      peakAge = 29;
      declineAge = 33;
    }

    return {
      developmentPoints: {},
      temporaryForm: 0,
      potential: potentialOverall,
      consistency: rng.integer(5, 15),
      growthCurve: curve,
      growthProfile,
      peakAge,
      declineAge,
      milestones: []
    };
  }

  private static getAgeCurveMultiplier(age: number, profile: GrowthProfile): number {
    let curvePoints = [
        [15, 0.5],
        [17, 1.0], // 16-18 moderate
        [20.5, 2.0], // 19-22 accelerated
        [25, 2.5], // 23-27 peak evolution
        [29, 0.1], // 28-30 stability
        [32, -1.0], // 31-33 decline
        [35, -2.5], // 34+ progressive decline
        [45, -5.0]
    ];

    if (profile === 'Wonderkid') {
        curvePoints = [[15, 1.5], [17, 2.5], [20.5, 2.0], [25, 0.5], [29, 0.0], [32, -1.5], [35, -3.0], [45, -5.0]];
    } else if (profile === 'Late Bloomer') {
        curvePoints = [[15, 0.2], [17, 0.5], [20.5, 1.0], [25, 2.5], [29, 2.5], [32, 0.0], [35, -1.5], [45, -5.0]];
    } else if (profile === 'Explosive') {
        curvePoints = [[15, 2.0], [17, 3.0], [20.5, 1.0], [25, 0.0], [29, -1.0], [32, -2.5], [35, -4.0], [45, -5.0]];
    } else if (profile === 'Late Peak') {
        curvePoints = [[15, 0.2], [17, 0.5], [20.5, 0.8], [25, 1.5], [29, 2.5], [32, 1.5], [35, -0.5], [45, -3.0]];
    } else if (profile === 'Injury Prone') {
        curvePoints = [[15, 0.4], [17, 0.8], [20.5, 1.5], [25, 1.5], [29, -0.5], [32, -2.0], [35, -3.5], [45, -5.0]];
    }

    let mult = 0;
    for (let i = 0; i < curvePoints.length - 1; i++) {
        let p1 = curvePoints[i];
        let p2 = curvePoints[i+1];
        if (age >= p1[0] && age <= p2[0]) {
            let t = (age - p1[0]) / (p2[0] - p1[0]);
            mult = p1[1] + t * (p2[1] - p1[1]);
            break;
        }
    }
    if (age > curvePoints[curvePoints.length-1][0]) {
        mult = curvePoints[curvePoints.length-1][1];
    } else if (age < curvePoints[0][0]) {
        mult = curvePoints[0][1];
    }
    
    if (profile === 'High Discipline') {
        mult += 0.2; 
    } else if (profile === 'Low Discipline') {
        mult -= 0.3;
    }

    return mult;
  }

  public static processWeek(
    currentStats: Record<TechnicalStat, number>,
    progression: ProgressionState,
    params: ProgressionParams,
    rng: IRNG
  ): ProgressionResult {
    let newStats = { ...currentStats };
    let newProg = { ...progression, developmentPoints: { ...progression.developmentPoints } };
    const events: string[] = [];

    // 1. Form Update
    if (params.minutesPlayed > 0 && params.matchRating > 0) {
      const formDelta = (params.matchRating - 6.0) * 0.5;
      const volatility = 1 - (newProg.consistency / 40); 
      newProg.temporaryForm += formDelta * volatility;
      newProg.temporaryForm = Math.max(-10, Math.min(10, newProg.temporaryForm));
    } else if (!params.isInjured) {
      newProg.temporaryForm *= 0.9;
    }

    // 2. Base XP Calculation
    let xpGain = 0;
    
    if (params.minutesPlayed > 0) {
      const matchXpBase = (params.minutesPlayed / 90) * 150;
      const ratingMult = Math.max(0.1, params.matchRating / 6.0);
      xpGain += matchXpBase * ratingMult;
    }
    
    if (!params.isInjured) {
      const trainingXpBase = params.trainingLoad * 2;
      const facilitiesMult = 0.5 + (params.clubFacilitiesLevel / 200);
      const coachMult = 0.5 + (params.coachQuality / 200);
      xpGain += trainingXpBase * facilitiesMult * coachMult;
    }

    // 3. Apply Continuous Age Curve Multiplier
    let ageMult = this.getAgeCurveMultiplier(params.age, newProg.growthProfile);

    // Dynamic Multipliers
    if (ageMult < 0) {
        if (params.isInjured) ageMult *= 1.5;
        if (newProg.temporaryForm < -2) ageMult *= 1.2;
        ageMult *= (1 - (params.trainingLoad / 300)); // Training slows decline slightly
    } else {
        if (params.isInjured) ageMult *= 0.5;
        if (newProg.temporaryForm > 5) ageMult *= 1.2;
    }

    // Personality Modifier
    if (params.personality === 'PROFESSIONAL' || params.personality === 'LEADER') {
      ageMult += 0.1;
    } else if (params.personality === 'PARTY_ANIMAL' || params.personality === 'ARROGANT') {
      ageMult -= 0.1;
    }
    
    if (params.isInjured && params.injurySeverity) {
      xpGain -= params.injurySeverity * 50; 
    }

    let finalXpGain = xpGain * ageMult;

    // Breakthrough chance
    if (params.age < 23 && params.matchRating > 8.5 && rng.chance(5)) {
      events.push('BREAKTHROUGH');
      finalXpGain += 5000;
      if (!newProg.milestones.includes('BREAKTHROUGH_1')) {
        newProg.milestones.push('BREAKTHROUGH_1');
      }
    }

    // 4. Position-Specific Weights
    const weights = this.getStatWeights(params.position);
    
    if (params.trainingFocus && params.trainingFocus !== 'GENERAL' && params.trainingFocus !== 'REST') {
       if (params.trainingFocus === 'FINISHING') {
         weights.SHO! += 2.0; weights.HEA! += 1.0; weights.PEN! += 1.0;
       } else if (params.trainingFocus === 'CREATION') {
         weights.PAS! += 2.0; weights.VIS! += 2.0; weights.CRE! += 2.0;
       } else if (params.trainingFocus === 'DRIBBLING') {
         weights.DRI! += 2.0; weights.CON! += 1.5; weights.ACC! += 1.0;
       } else if (params.trainingFocus === 'PHYSICAL') {
         weights.PHY! += 2.0; weights.STA! += 2.0; weights.PAC! += 1.0; weights.JUM! += 1.0;
       } else if (params.trainingFocus === 'DEFENDING') {
         weights.DEF! += 2.0; weights.HEA! += 1.0; weights.PHY! += 1.0;
       } else if (params.trainingFocus === 'SET_PIECES') {
         weights.FK! += 3.0; weights.PEN! += 2.0;
       } else if (params.trainingFocus === 'CHEMISTRY') {
         weights.PAS! += 1.0;
       } else if (params.trainingFocus === 'POSITIONAL') {
         for (const stat of Object.keys(weights) as TechnicalStat[]) {
           weights[stat]! *= 1.5;
         }
       }
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    // 5. XP Distribution and Limits
    for (const stat of Object.keys(weights) as TechnicalStat[]) {
      if (stat === 'WF' || stat === 'SM') continue; // Do not progress WF/SM via XP easily

      const weight = weights[stat] || 0;
      const statXp = (weight / totalWeight) * finalXpGain;
      
      let currentXp = newProg.developmentPoints[stat] || 0;
      let currentVal = newStats[stat];
      
      // Limit by Potential Attribute
      let pot = params.potentialStats ? params.potentialStats[stat] : Math.max(50, newProg.potential);
      if (!pot) pot = newProg.potential; // fallback
      
      // If we are gaining XP, apply hard limit
      if (statXp > 0) {
          if (currentVal >= pot) {
              // Reached ceiling
              newProg.developmentPoints[stat] = Math.min(XP_PER_ATTRIBUTE_POINT * 0.99, currentXp + (statXp * 0.1));
              continue;
          } else {
              // The closer to potential, the slower the growth (smooth asymptotic curve)
              const distance = pot - currentVal;
              let potentialMult = distance > 10 ? 1.0 : (distance / 10);
              newProg.developmentPoints[stat] = currentXp + (statXp * potentialMult);
          }
      } else {
          // Losing XP (decline)
          newProg.developmentPoints[stat] = currentXp + statXp;
      }

      // 6. Level Up / Decline Check
      if (newProg.developmentPoints[stat]! >= XP_PER_ATTRIBUTE_POINT) {
         if (newStats[stat] < pot) {
            newStats[stat] += 1;
            newProg.developmentPoints[stat]! -= XP_PER_ATTRIBUTE_POINT;
         } else {
            newProg.developmentPoints[stat] = XP_PER_ATTRIBUTE_POINT * 0.99;
         }
      } else if (newProg.developmentPoints[stat]! <= -XP_PER_ATTRIBUTE_POINT) {
         if (newStats[stat] > 10) {
            newStats[stat] -= 1;
            newProg.developmentPoints[stat]! += XP_PER_ATTRIBUTE_POINT;
            events.push(`DECLINE_${stat}`);
         } else {
            newProg.developmentPoints[stat] = 0;
         }
      }
    }

    return {
      technical: newStats,
      progression: newProg,
      events
    };
  }

  private static getStatWeights(position: Position | ''): Partial<Record<TechnicalStat, number>> {
    const defaultWeight = 0.5;
    const weights: Partial<Record<TechnicalStat, number>> = {
      PAC: defaultWeight, SHO: defaultWeight, PAS: defaultWeight, DRI: defaultWeight, 
      DEF: defaultWeight, PHY: defaultWeight, HEA: defaultWeight, VIS: defaultWeight, 
      WF: 0, SM: 0, CON: defaultWeight, ACC: defaultWeight, STA: defaultWeight, 
      JUM: defaultWeight, FK: defaultWeight, PEN: defaultWeight, CRE: defaultWeight
    };

    switch (position) {
        case 'ST': weights.SHO = 3.0; weights.HEA = 2.0; weights.ACC = 1.5; weights.PAC = 1.5; weights.PAS = 0.8; weights.DEF = 0.1; break;
        case 'LW': 
        case 'RW': weights.PAC = 3.0; weights.DRI = 2.5; weights.SHO = 2.0; weights.ACC = 2.5; weights.DEF = 0.5; break;
        case 'CAM': weights.PAS = 3.0; weights.DRI = 2.5; weights.VIS = 3.0; weights.CRE = 2.5; weights.DEF = 0.8; break;
        case 'CM': weights.PAS = 2.5; weights.VIS = 2.5; weights.STA = 2.5; weights.CON = 2.0; weights.DEF = 1.5; break;
        case 'CDM': weights.DEF = 3.0; weights.PAS = 2.0; weights.PHY = 2.5; weights.STA = 2.5; weights.SHO = 0.5; break;
        case 'LB':
        case 'RB': weights.PAC = 2.5; weights.PAS = 2.0; weights.DEF = 2.5; weights.STA = 2.5; weights.SHO = 0.5; break;
        case 'CB': weights.DEF = 3.0; weights.PHY = 3.0; weights.HEA = 2.5; weights.JUM = 2.5; weights.SHO = 0.2; weights.PAS = 1.0; break;
        case 'GK': weights.DEF = 3.0; weights.CON = 3.0; weights.VIS = 3.0; weights.JUM = 2.5; weights.PAC = 0.5; weights.SHO = 0; break;
        default: weights.PAS = 2.0; weights.STA = 2.0; break;
    }
    
    return weights;
  }
}
