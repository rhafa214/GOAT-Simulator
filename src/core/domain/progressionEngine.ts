import { TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType } from '../../types';
import { IRNG } from '../../utils/rng';

export type PositionCategory = 'ATTACKER' | 'MIDFIELDER' | 'DEFENDER' | 'GOALKEEPER';

export interface ProgressionState {
  developmentPoints: Partial<Record<TechnicalStat, number>>;
  temporaryForm: number; // -10 to 10
  potential: number; // 1-99
  consistency: number; // 1-20
  growthCurve: 'EARLY_PEAK' | 'NORMAL' | 'LATE_BLOOMER';
  peakAge: number;
  declineAge: number;
  milestones: string[];
}

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
  
  public static getPositionCategory(position: Position | ''): PositionCategory {
    switch (position) {
      case 'ST': case 'LW': case 'RW': return 'ATTACKER';
      case 'CAM': case 'CM': case 'CDM': return 'MIDFIELDER';
      case 'LB': case 'CB': case 'RB': return 'DEFENDER';
      case 'GK': return 'GOALKEEPER';
      default: return 'MIDFIELDER';
    }
  }

  public static initializeProgression(rng: IRNG, potentialBase: number): ProgressionState {
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
      potential: Math.min(99, potentialBase + rng.integer(-5, 5)),
      consistency: rng.integer(5, 15),
      growthCurve: curve,
      peakAge,
      declineAge,
      milestones: []
    };
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

    // 1. Temporary Form Update
    if (params.minutesPlayed > 0 && params.matchRating > 0) {
      const formDelta = (params.matchRating - 6.0) * 0.5; // Good match increases form, bad match decreases
      // Consistency affects form volatility: high consistency = less volatility
      const volatility = 1 - (newProg.consistency / 40); 
      newProg.temporaryForm += formDelta * volatility;
      newProg.temporaryForm = Math.max(-10, Math.min(10, newProg.temporaryForm));
    } else if (!params.isInjured) {
      // Natural decay to 0 if not playing and not injured
      newProg.temporaryForm *= 0.9;
    }

    // 2. Base XP Calculation
    let xpGain = 0;
    
    // Match XP
    if (params.minutesPlayed > 0) {
      const matchXpBase = (params.minutesPlayed / 90) * 150;
      const ratingMult = Math.max(0.1, params.matchRating / 6.0);
      xpGain += matchXpBase * ratingMult;
    }

    // Training XP
    if (!params.isInjured) {
      const trainingXpBase = params.trainingLoad * 2;
      const facilitiesMult = 0.5 + (params.clubFacilitiesLevel / 200);
      const coachMult = 0.5 + (params.coachQuality / 200);
      xpGain += trainingXpBase * facilitiesMult * coachMult;
    }

    // Age / Potential Multiplier
    let ageMult = 1.0;
    if (params.age < newProg.peakAge) {
      ageMult = 1.5;
    } else if (params.age >= newProg.declineAge) {
      ageMult = 0.2; // Harder to grow when declining
    } else {
      ageMult = 0.8; // Peak years, slow growth
    }

    // Personality Modifier
    if (params.personality === 'PROFESSIONAL' || params.personality === 'LEADER') {
      ageMult *= 1.2;
    } else if (params.personality === 'PARTY_ANIMAL' || params.personality === 'ARROGANT') {
      ageMult *= 0.8;
    }
    
    // Injury penalty
    if (params.isInjured && params.injurySeverity) {
      // Severe injury can cause negative XP (regression)
      xpGain -= params.injurySeverity * 50;
    }

    xpGain *= ageMult;

    // Breakthrough chance
    if (params.age < newProg.peakAge && params.matchRating > 8.5 && rng.chance(5)) {
      events.push('BREAKTHROUGH');
      xpGain *= 3; // Huge boost
      if (!newProg.milestones.includes('BREAKTHROUGH_1')) {
        newProg.milestones.push('BREAKTHROUGH_1');
      }
    }

    // 3. XP Distribution
    const cat = this.getPositionCategory(params.position);
    const weights = this.getStatWeights(cat);
    

    // Apply training focus
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
         // Doesn't affect technical stats much, but maybe PAS
         weights.PAS! += 1.0;
       } else if (params.trainingFocus === 'POSITIONAL') {
         // Double the base position weights
         for (const stat of Object.keys(weights) as TechnicalStat[]) {
           weights[stat]! *= 1.5;
         }
       }
    }


    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

    for (const stat of Object.keys(weights) as TechnicalStat[]) {
      const weight = weights[stat] || 0;
      const statXp = (weight / totalWeight) * xpGain;
      
      const currentXp = newProg.developmentPoints[stat] || 0;
      newProg.developmentPoints[stat] = currentXp + statXp;

      // 4. Level Up Check
      if (newProg.developmentPoints[stat]! >= XP_PER_ATTRIBUTE_POINT) {
        // Check potential ceiling (soft cap based on potential, hard cap 99)
        const currentVal = newStats[stat];
        const softCap = Math.max(50, newProg.potential + rng.integer(-5, 5));
        
        if (currentVal < 99 && (currentVal < softCap || rng.chance(10))) {
          newStats[stat] += 1;
          newProg.developmentPoints[stat]! -= XP_PER_ATTRIBUTE_POINT;
          // We don't notify every single point to avoid spam, maybe only major milestones.
        } else {
          // Hit ceiling, XP wastes or caps
          newProg.developmentPoints[stat] = XP_PER_ATTRIBUTE_POINT * 0.9; 
        }
      }
    }

    // 5. Decline System
    if (params.age >= newProg.declineAge) {
      const declineFactor = (params.age - newProg.declineAge + 1) * 0.5; // Increases with age
      const declineChance = declineFactor; // e.g. 1% per week if 2 years past decline age
      
      if (rng.random() * 100 < declineChance) {
        // Pick a stat to decline. Physical stats decline first.
        const statToDecline = rng.chance(70) ? rng.pick(PHYSICAL_STATS) : rng.pick(TECHNICAL_STATS);
        if (newStats[statToDecline] > 30) {
          newStats[statToDecline] -= 1;
          events.push(`DECLINE_${statToDecline}`);
        }
      }
    }

    return {
      technical: newStats,
      progression: newProg,
      events
    };
  }

  private static getStatWeights(category: PositionCategory): Partial<Record<TechnicalStat, number>> {
    const defaultWeight = 1.0;
    const weights: Partial<Record<TechnicalStat, number>> = {
      PAC: defaultWeight, SHO: defaultWeight, PAS: defaultWeight, DRI: defaultWeight, 
      DEF: defaultWeight, PHY: defaultWeight, HEA: defaultWeight, VIS: defaultWeight, 
      WF: 0, SM: 0, CON: defaultWeight, ACC: defaultWeight, STA: defaultWeight, 
      JUM: defaultWeight, FK: defaultWeight, PEN: defaultWeight, CRE: defaultWeight
    };

    if (category === 'ATTACKER') {
      weights.SHO = 3.0; weights.PAC = 2.5; weights.DRI = 2.5; weights.ACC = 2.0; weights.CRE = 2.0;
      weights.DEF = 0.5; weights.PHY = 1.5;
    } else if (category === 'MIDFIELDER') {
      weights.PAS = 3.0; weights.VIS = 3.0; weights.CON = 2.5; weights.STA = 2.5; weights.CRE = 2.5;
      weights.SHO = 1.5; weights.DEF = 1.5;
    } else if (category === 'DEFENDER') {
      weights.DEF = 3.0; weights.PHY = 3.0; weights.HEA = 2.5; weights.JUM = 2.0; weights.STA = 2.0;
      weights.SHO = 0.5; weights.DRI = 0.8;
    } else if (category === 'GOALKEEPER') {
      // Assuming generic stats map to GK stats (e.g. CON=Handling, DEF=Reflexes, VIS=Positioning)
      weights.DEF = 3.0; weights.CON = 3.0; weights.VIS = 3.0; weights.JUM = 2.5; weights.PAS = 1.5;
      weights.SHO = 0; weights.PAC = 0.5;
    }

    return weights;
  }
}
