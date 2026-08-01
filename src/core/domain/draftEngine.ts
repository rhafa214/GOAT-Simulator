import { TechnicalStat, PlayerDNA, DraftMode, DraftOption, DraftRound, DraftState } from '../../types';
import { SeededRNG } from '../../utils/rng';
import { IDOLS, Idol } from '../../data/idols';









const QUICK_STATS: TechnicalStat[] = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY', 'SM', 'WF'];
const COMPLETE_STATS: TechnicalStat[] = [
  'PAC', 'ACC', 'SHO', 'PEN', 'FK', 
  'PAS', 'VIS', 'CRE', 
  'DRI', 'CON', 'SM', 'WF',
  'DEF', 'HEA',
  'PHY', 'STA', 'JUM'
];

export class DraftEngine {
  private rng: SeededRNG;

  constructor(seed: number = Date.now()) {
    this.rng = new SeededRNG(seed);
  }

  public initializeDraft(mode: DraftMode, seed?: number): DraftState {
    if (seed !== undefined) {
      this.rng = new SeededRNG(seed);
    }
    
    const targetStats = mode === 'QUICK' ? QUICK_STATS : COMPLETE_STATS;
    
    // Generate empty rounds
    const rounds = targetStats.map(stat => ({
      attributeId: stat,
      options: []
    }));

    const state: DraftState = {
      mode,
      seed: (this.rng as any).seed,
      currentRoundIndex: 0,
      rounds,
      acquiredDNA: [],
      usedIdols: []
    };

    return this.generateOptionsForCurrentRound(state);
  }

  public generateOptionsForCurrentRound(state: DraftState): DraftState {
    if (state.currentRoundIndex >= state.rounds.length) return state;

    const round = state.rounds[state.currentRoundIndex];
    if (round.options.length > 0) return state; // Already generated

    const stat = round.attributeId;
    
    // Weight idols based on their baseStats for this stat.
    // If they don't have it explicitly, give a fallback based on position maybe, 
    // or just a base weight. For simplicity, we fallback to 50-80.
    const candidates = IDOLS.map(idol => {
      let baseVal = idol.baseStats[stat];
      if (baseVal === undefined) {
        baseVal = 60 + Math.floor(this.rng.random() * 20); // 60-79
      }
      
      // Reduce weight heavily if already used
      let weight = baseVal;
      if (state.usedIdols.includes(idol.id)) {
        weight = weight * 0.1; // 90% reduction
      }
      
      return { idol, baseVal, weight };
    });

    // Select top 3 using weighted random or just sort by weight + random
    // A simple approach: sort by weight + some noise, take top 3
    candidates.sort((a, b) => {
      const scoreA = a.weight * (0.8 + this.rng.random() * 0.4);
      const scoreB = b.weight * (0.8 + this.rng.random() * 0.4);
      return scoreB - scoreA;
    });

    const selectedCandidates = candidates.slice(0, 5);
    
    // Generate DraftOption
    const options: DraftOption[] = selectedCandidates.map(c => {
      // Add slight variance to the baseVal (-2 to +2)
      let finalVal = c.baseVal + Math.floor(this.rng.random() * 5) - 2;
      finalVal = Math.max(1, Math.min(99, finalVal)); // Cap 1-99
      
      // Assign DNA if available and not already acquired
      let assignedDna: PlayerDNA | undefined = undefined;
      if (c.idol.dnaOptions.length > 0) {
         const possibleDna = c.idol.dnaOptions.filter(d => !state.acquiredDNA.some(ad => ad.id === d.id));
         if (possibleDna.length > 0) {
            assignedDna = possibleDna[Math.floor(this.rng.random() * possibleDna.length)];
         }
      }

      return {
        idolId: c.idol.id,
        name: c.idol.name,
        nationality: c.idol.nationality,
        positionOrEra: c.idol.positionOrEra,
        photoUrl: c.idol.photoUrl,
        attributeValue: finalVal,
        dna: assignedDna
      };
    });

    // Shuffle options so the best isn't always first
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const newRounds = [...state.rounds];
    newRounds[state.currentRoundIndex] = { ...round, options };

    return { ...state, rounds: newRounds };
  }

  public selectOption(state: DraftState, idolId: string): DraftState {
    if (state.currentRoundIndex >= state.rounds.length) return state;

    const round = state.rounds[state.currentRoundIndex];
    const option = round.options.find(o => o.idolId === idolId);
    
    if (!option) throw new Error("Invalid option selected");

    const newRounds = [...state.rounds];
    newRounds[state.currentRoundIndex] = { ...round, selectedOptionId: idolId };

    const newUsedIdols = [...state.usedIdols, idolId];
    const newAcquiredDNA = [...state.acquiredDNA];
    if (option.dna) {
      newAcquiredDNA.push(option.dna);
    }

    const nextRoundIndex = state.currentRoundIndex + 1;

    let nextState = {
      ...state,
      rounds: newRounds,
      usedIdols: newUsedIdols,
      acquiredDNA: newAcquiredDNA,
      currentRoundIndex: nextRoundIndex
    };

    if (nextRoundIndex < nextState.rounds.length) {
       nextState = this.generateOptionsForCurrentRound(nextState);
    }

    return nextState;
  }

  public isComplete(state: DraftState): boolean {
    return state.currentRoundIndex >= state.rounds.length;
  }

  public applyToTechnicalStats(state: DraftState): Partial<Record<TechnicalStat, number>> {
    const stats: Partial<Record<TechnicalStat, number>> = {};
    for (const round of state.rounds) {
      if (round.selectedOptionId) {
        const opt = round.options.find(o => o.idolId === round.selectedOptionId);
        if (opt) {
          stats[round.attributeId] = opt.attributeValue;
        }
      }
    }

    if (state.mode === 'QUICK') {
       // Extrapolate other stats based on QUICK choices
       // Simple mapping for demonstration
       if (stats.PAC) { stats.ACC = Math.max(1, stats.PAC - 2); }
       if (stats.SHO) { stats.PEN = Math.max(1, stats.SHO - 5); stats.FK = stats.SHO - 2; }
       if (stats.PAS) { stats.VIS = stats.PAS; stats.CRE = stats.PAS - 1; }
       if (stats.DRI) { stats.CON = Math.min(99, (stats.DRI || 50) + 2); }
       if (stats.DEF) { stats.HEA = stats.DEF; }
       if (stats.PHY) { stats.STA = stats.PHY; stats.JUM = stats.PHY; }
    }

    return stats;
  }

  public calculateEstimatedOverall(stats: Partial<Record<TechnicalStat, number>>, position: string): number {
    // Basic calculation for overall
    const values = Object.values(stats).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 50;
    const avg = values.reduce((a,b) => a+b, 0) / values.length;
    // Boost slightly based on max stats
    const max = Math.max(...values);
    return Math.floor((avg * 0.7) + (max * 0.3));
  }
}
