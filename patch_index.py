import re

with open('src/core/state/reducers/index.ts', 'r') as f:
    content = f.read()

content = content.replace("import { DraftEngine }", "import { DraftEngine, applyDraftResultToPlayer }")

old_code = """    const newPlayer = { ...state.player };
    newPlayer.technical = { ...newPlayer.technical };
    newPlayer.potential = { ...(newPlayer.potential || newPlayer.technical) };

    for (const stat of Object.keys(result.current)) {
      const ts = stat as TechnicalStat;
      newPlayer.technical[ts] = Math.min(99, (newPlayer.technical[ts] || 50) + (result.current[ts] || 0));
      newPlayer.potential[ts] = Math.min(99, (newPlayer.potential[ts] || 50) + (result.potential[ts] || 0));
    }

    if (state.draftState.acquiredDNA && state.draftState.acquiredDNA.length > 0) {
      newPlayer.dna = [...(newPlayer.dna || []), ...state.draftState.acquiredDNA];
    }"""

new_code = "    const newPlayer = applyDraftResultToPlayer(state.player, result, state.draftState.acquiredDNA || []);"

content = content.replace(old_code, new_code)

with open('src/core/state/reducers/index.ts', 'w') as f:
    f.write(content)
