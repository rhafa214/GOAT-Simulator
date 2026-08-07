import re

with open('src/core/domain/draftEngine.ts', 'r') as f:
    content = f.read()

content = content.replace("export function applyDraftResultToPlayer(player: PlayerState, result: DraftResult, dna: PlayerDNA[]): PlayerState {", "export function applyDraftResultToPlayer(player: any, result: DraftResult, dna: PlayerDNA[]): any {")
content = content.replace("const newPlayer = JSON.parse(JSON.stringify(player)) as PlayerState;", "const newPlayer = JSON.parse(JSON.stringify(player));")
content = content.replace(", PlayerState }", " }")

with open('src/core/domain/draftEngine.ts', 'w') as f:
    f.write(content)
