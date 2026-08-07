import re

with open('src/core/domain/draftEngine.ts', 'r') as f:
    content = f.read()

# Replace usedIdols with seenIdolIds and selectedIdolIds
content = content.replace('!state.usedIdols.includes', '!state.selectedIdolIds.includes')
content = content.replace('state.usedIdols', 'state.seenIdolIds') # temporary fix

# Let's just do a clean replacement of generateOptionsForCurrentRound
start_str = 'public generateOptionsForCurrentRound(state: DraftState): DraftState {'
end_str = 'return { ...state, rounds: newRounds };'

new_generate_options = '''public generateOptionsForCurrentRound(state: DraftState): DraftState {
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

    return { ...state, rounds: newRounds, seenIdolIds: newSeenIdolIds };'''

content = re.sub(
    r'public generateOptionsForCurrentRound\(state: DraftState\): DraftState \{.*?return \{ \.\.\.state, rounds: newRounds \};\n  \}',
    new_generate_options + '\n  }',
    content,
    flags=re.DOTALL
)

# Replace selectOption
select_option_start = 'public selectOption(state: DraftState, idolId: string): DraftState {'
new_select_option = '''public selectOption(state: DraftState, idolId: string): DraftState {
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
  }'''

content = re.sub(
    r'public selectOption\(state: DraftState, idolId: string\): DraftState \{.*?\n  \}',
    new_select_option,
    content,
    flags=re.DOTALL
)

with open('src/core/domain/draftEngine.ts', 'w') as f:
    f.write(content)
