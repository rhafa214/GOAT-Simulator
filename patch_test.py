import re

with open('src/__tests__/draftEngine.test.ts', 'r') as f:
    content = f.read()

content = content.replace("expect(state.usedIdols).toContain(firstOptionId);", "expect(state.selectedIdolIds).toContain(firstOptionId);")

with open('src/__tests__/draftEngine.test.ts', 'w') as f:
    f.write(content)
