import { TechnicalStat, PlayerDNA, DraftMode, DraftOption, DraftRound, DraftState, CardRarity } from '../../types';
import { SeededRNG } from '../../utils/rng';
import { IDOLS, Idol } from '../../data/idols';
import { calculatePlayerOverall } from './playerUtils';

const QUICK_STATS: TechnicalStat[] = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY', 'SM', 'WF'];
const COMPLETE_STATS: TechnicalStat[] = [
  'PAC', 'ACC', 'SHO', 'PEN', 'FK', 
  'PAS', 'VIS', 'CRE', 
  'DRI', 'CON', 'SM', 'WF',
  'DEF', 'HEA',
  'PHY', 'STA', 'JUM'
];

export interface DraftResult {
  current: Partial<Record<TechnicalStat, number>>;
  potential: Partial<Record<TechnicalStat, number>>;
}

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
    
    const rounds = targetStats.map(stat => ({
      attributeId: stat,
      options: []
    }));

    const state: DraftState = {
      mode,
      seed: this.rng.seed,
      currentRoundIndex: 0,
      rounds,
      acquiredDNA: [],
      seenIdolIds: [],
      selectedIdolIds: []
    };

    return this.generateOptionsForCurrentRound(state);
  }

  private generateRarity(): CardRarity {
    const roll = this.rng.random();
    if (roll < 0.05) return 'GOAT';
    if (roll < 0.15) return 'LEGEND';
    if (roll < 0.35) return 'EPIC';
    if (roll < 0.65) return 'RARE';
    return 'COMMON';
  }

  private getRarityMultipliers(rarity: CardRarity): { current: number, potential: number } {
    switch (rarity) {
      case 'GOAT': return { current: 1.5, potential: 2.0 };
      case 'LEGEND': return { current: 1.3, potential: 1.6 };
      case 'EPIC': return { current: 1.1, potential: 1.3 };
      case 'RARE': return { current: 0.9, potential: 1.0 };
      case 'COMMON': return { current: 0.7, potential: 0.7 };
    }
  }

  public generateOptionsForCurrentRound(state: DraftState): DraftState {
    if (state.currentRoundIndex >= state.rounds.length) return state;

    const round = state.rounds[state.currentRoundIndex];
    if (round.options.length > 0) return state;

    const stat = round.attributeId;
    
    // 1. Exclude already selected idols permanently
    const validIdols = IDOLS.filter(idol => !state.selectedIdolIds.includes(idol.id));
    
    // 2. Separate into unseen and seen (but not selected)
    const unseenIdols = validIdols.filter(idol => !state.seenIdolIds.includes(idol.id));
    const seenIdols = validIdols.filter(idol => state.seenIdolIds.includes(idol.id));
    
    let availableIdols = [...unseenIdols];
    if (availableIdols.length < 5) {
       // Recycle from seenIdols if we don't have enough unseen
       // Prioritize oldest seen by taking from the beginning of seenIdolIds
       // To do this, we can order seenIdols by their first appearance in state.seenIdolIds
       const orderedSeen = [...seenIdols].sort((a, b) => state.seenIdolIds.indexOf(a.id) - state.seenIdolIds.indexOf(b.id));
       availableIdols = [...availableIdols, ...orderedSeen.slice(0, 5 - availableIdols.length)];
    }

    if (availableIdols.length < 5) {
        // Fallback if total valid idols < 5 (should not happen with 25 idols and max 17 rounds)
        const missing = 5 - availableIdols.length;
        const allOther = validIdols.filter(i => !availableIdols.some(a => a.id === i.id));
        availableIdols = [...availableIdols, ...allOther.slice(0, missing)];
    }
    
    // Absolute fallback: if STILL < 5 (e.g. only 12 IDOLS total but 17 rounds)
    // we MUST recycle from selected idols to prevent crash
    if (availableIdols.length < 5) {
        const missing = 5 - availableIdols.length;
        const allOther = IDOLS.filter(i => !availableIdols.some(a => a.id === i.id));
        availableIdols = [...availableIdols, ...allOther.slice(0, missing)];
    }

    const candidates = availableIdols.map(idol => {
      let baseVal = idol.baseStats[stat];
      if (baseVal === undefined) {
        if (stat === 'SM' || stat === 'WF') {
           baseVal = 3;
        } else {
           baseVal = 60 + Math.floor(this.rng.random() * 20); // 60-79
        }
      }
      return { idol, baseVal, weight: baseVal };
    });

    candidates.sort((a, b) => {
      const scoreA = a.weight * (0.8 + this.rng.random() * 0.4);
      const scoreB = b.weight * (0.8 + this.rng.random() * 0.4);
      return scoreB - scoreA;
    });

    const selectedCandidates = candidates.slice(0, 5);
    
    const options: DraftOption[] = selectedCandidates.map(c => {
      const rarity = this.generateRarity();
      const mults = this.getRarityMultipliers(rarity);
      
      const currentBonus: Partial<Record<TechnicalStat, number>> = {};
      const potentialBonus: Partial<Record<TechnicalStat, number>> = {};
      
      let secondaryStat: TechnicalStat | null = null;
      const sortedStats = Object.keys(c.idol.baseStats).sort((a,b) => (c.idol.baseStats[b as TechnicalStat] || 0) - (c.idol.baseStats[a as TechnicalStat] || 0)) as TechnicalStat[];
      for (const s of sortedStats) {
        if (s !== stat && s !== 'SM' && s !== 'WF') {
          secondaryStat = s;
          break;
        }
      }
      if (!secondaryStat && stat !== 'PAC') secondaryStat = 'PAC';
      else if (!secondaryStat) secondaryStat = 'SHO';

      if (stat === 'SM' || stat === 'WF') {
         currentBonus[stat] = Math.max(0, Math.floor(this.rng.random() * 2)); // 0 to 1
         potentialBonus[stat] = Math.max(0, Math.floor(this.rng.random() * 3)); // 0 to 2
      } else {
         const baseCurr = 3 + Math.floor(this.rng.random() * 3); // 3 to 5
         const basePot = 10 + Math.floor(this.rng.random() * 6); // 10 to 15
         currentBonus[stat] = Math.ceil(baseCurr * mults.current);
         potentialBonus[stat] = Math.ceil(basePot * mults.potential);
      }

      if (secondaryStat) {
         const secCurr = 1 + Math.floor(this.rng.random() * 2); // 1 to 2
         const secPot = 5 + Math.floor(this.rng.random() * 4); // 5 to 8
         currentBonus[secondaryStat] = Math.ceil(secCurr * mults.current);
         potentialBonus[secondaryStat] = Math.ceil(secPot * mults.potential);
      }

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
        currentBonus,
        potentialBonus,
        rarity,
        dna: assignedDna
      };
    });

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const newRounds = [...state.rounds];
    newRounds[state.currentRoundIndex] = { ...round, options };

    // Update seenIdolIds
    const newlySeen = options.map(o => o.idolId).filter(id => !state.seenIdolIds.includes(id));
    const newSeenIdolIds = [...state.seenIdolIds, ...newlySeen];

    return { ...state, rounds: newRounds, seenIdolIds: newSeenIdolIds };
  }

  public selectOption(state: DraftState, idolId: string): DraftState {
    if (state.currentRoundIndex >= state.rounds.length) return state;

    const round = state.rounds[state.currentRoundIndex];
    const option = round.options.find(o => o.idolId === idolId);
    
    if (!option) throw new Error("Invalid option selected");

    const newRounds = [...state.rounds];
    newRounds[state.currentRoundIndex] = { ...round, selectedOptionId: idolId };

    const newSelectedIdolIds = [...state.selectedIdolIds, idolId];
    
    const newAcquiredDNA = [...state.acquiredDNA];
    if (option.dna) {
      newAcquiredDNA.push(option.dna);
    }

    const nextRoundIndex = state.currentRoundIndex + 1;

    let nextState = {
      ...state,
      rounds: newRounds,
      selectedIdolIds: newSelectedIdolIds,
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

  public getDraftResult(state: DraftState): DraftResult {
    const current: Partial<Record<TechnicalStat, number>> = {};
    const potential: Partial<Record<TechnicalStat, number>> = {};

    for (const round of state.rounds) {
      if (round.selectedOptionId) {
        const opt = round.options.find(o => o.idolId === round.selectedOptionId);
        if (opt) {
          // Accumulate current
          for (const [stat, val] of Object.entries(opt.currentBonus)) {
            current[stat as TechnicalStat] = (current[stat as TechnicalStat] || 0) + (val || 0);
          }
          // Accumulate potential
          for (const [stat, val] of Object.entries(opt.potentialBonus)) {
            potential[stat as TechnicalStat] = (potential[stat as TechnicalStat] || 0) + (val || 0);
          }
        }
      }
    }

    if (state.mode === 'QUICK') {
       // Extrapolate other stats based on QUICK choices for BOTH current and potential
       if (current.PAC) { current.ACC = Math.max(1, current.PAC - 2); }
       if (current.SHO) { current.PEN = Math.max(1, current.SHO - 2); current.FK = current.SHO - 1; }
       if (current.PAS) { current.VIS = current.PAS; current.CRE = current.PAS - 1; }
       if (current.DRI) { current.CON = (current.DRI || 0) + 1; }
       if (current.DEF) { current.HEA = current.DEF; }
       if (current.PHY) { current.STA = current.PHY; current.JUM = current.PHY; }

       if (potential.PAC) { potential.ACC = Math.max(1, potential.PAC - 2); }
       if (potential.SHO) { potential.PEN = Math.max(1, potential.SHO - 2); potential.FK = potential.SHO - 1; }
       if (potential.PAS) { potential.VIS = potential.PAS; potential.CRE = potential.PAS - 1; }
       if (potential.DRI) { potential.CON = (potential.DRI || 0) + 1; }
       if (potential.DEF) { potential.HEA = potential.DEF; }
       if (potential.PHY) { potential.STA = potential.PHY; potential.JUM = potential.PHY; }
    }

    return { current, potential };
  }
}


export function applyDraftResultToPlayer(player: any, result: DraftResult, dna: PlayerDNA[]): any {
  const newPlayer = JSON.parse(JSON.stringify(player));
  
  // Apply Current
  for (const [stat, val] of Object.entries(result.current)) {
    if (val && newPlayer.technical[stat as TechnicalStat] !== undefined) {
      newPlayer.technical[stat as TechnicalStat] += val;
      // Cap at 99
      newPlayer.technical[stat as TechnicalStat] = Math.min(99, newPlayer.technical[stat as TechnicalStat]);
    }
  }

  // Apply Potential
  for (const [stat, val] of Object.entries(result.potential)) {
    if (val && newPlayer.potential[stat as TechnicalStat] !== undefined) {
      newPlayer.potential[stat as TechnicalStat] += val;
      // Cap at 99
      newPlayer.potential[stat as TechnicalStat] = Math.min(99, newPlayer.potential[stat as TechnicalStat]);
    }
  }

  // Ensure potential is at least current
  for (const key of Object.keys(newPlayer.technical)) {
    const k = key as TechnicalStat;
    if (newPlayer.potential[k] < newPlayer.technical[k]) {
      newPlayer.potential[k] = newPlayer.technical[k];
    }
  }

  // Apply DNA
  if (dna && dna.length > 0) {
    if (!newPlayer.acquiredDNA) {
      newPlayer.acquiredDNA = [];
    }
    newPlayer.acquiredDNA = [...newPlayer.acquiredDNA, ...dna];
  }

  return newPlayer;
}
