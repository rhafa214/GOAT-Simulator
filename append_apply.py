content = """

export function applyDraftResultToPlayer(player: PlayerState, result: DraftResult, dna: PlayerDNA[]): PlayerState {
  const newPlayer = JSON.parse(JSON.stringify(player)) as PlayerState;
  
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
"""

with open('src/core/domain/draftEngine.ts', 'a') as f:
    f.write(content)
