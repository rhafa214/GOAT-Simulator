import re

with open('src/core/domain/draftEngine.ts', 'r') as f:
    content = f.read()

content = content.replace("export function applyDraftResultToPlayer(player: PlayerState, result: DraftResult, dna: PlayerDNA[]): PlayerState {", "import { PlayerState } from '../../types';\n\nexport function applyDraftResultToPlayer(player: PlayerState, result: DraftResult, dna: PlayerDNA[]): PlayerState {")

with open('src/core/domain/draftEngine.ts', 'w') as f:
    f.write(content)
