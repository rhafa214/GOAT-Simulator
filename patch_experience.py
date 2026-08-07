import re

with open('src/components/creation/DraftExperience.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { DraftEngine }", "import { DraftEngine, applyDraftResultToPlayer }")

old_completion = """  // Final completion handler: apply to global game state
  const handleFinalCompletion = () => {
    const finalResult = draftEngine.getDraftResult(draftState);
    
    // We construct the final object here or delegate to reducer.
    // Since INITIALIZE_PLAYER replaces payload, we must construct it:
    const newTechnical = { ...state.player.technical };
    const newPotential = { ...(state.player.potential || state.player.technical) };

    for (const stat of Object.keys(finalResult.current)) {
      const ts = stat as TechnicalStat;
      newTechnical[ts] = Math.min(99, (newTechnical[ts] || 50) + (finalResult.current[ts] || 0));
      newPotential[ts] = Math.min(99, (newPotential[ts] || 50) + (finalResult.potential[ts] || 0));
    }

    dispatch({
      type: 'INITIALIZE_PLAYER',
      payload: {
        technical: newTechnical,
        potential: newPotential,
        dna: draftState.acquiredDNA
      }
    });

    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' });
  };"""

new_completion = """  // Final completion handler: apply to global game state
  const handleFinalCompletion = () => {
    const finalResult = draftEngine.getDraftResult(draftState);
    
    const newPlayer = applyDraftResultToPlayer(state.player, finalResult, draftState.acquiredDNA || []);

    dispatch({
      type: 'INITIALIZE_PLAYER',
      payload: {
        technical: newPlayer.technical,
        potential: newPlayer.potential,
        dna: newPlayer.acquiredDNA
      }
    });

    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' });
  };"""

content = content.replace(old_completion, new_completion)

with open('src/components/creation/DraftExperience.tsx', 'w') as f:
    f.write(content)
