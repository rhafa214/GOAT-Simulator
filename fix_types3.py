import re

with open('src/core/domain/draftEngine.ts', 'r') as f:
    content = f.read()

content = content.replace("import { TechnicalStat, PlayerDNA, DraftMode, DraftOption, DraftRound, DraftState, CardRarity } from '../../types';", "import { TechnicalStat, PlayerDNA, DraftMode, DraftOption, DraftRound, DraftState, CardRarity, PlayerState } from '../../types';")

with open('src/core/domain/draftEngine.ts', 'w') as f:
    f.write(content)
