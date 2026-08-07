import re

with open('src/core/domain/draftEngine.ts', 'r') as f:
    content = f.read()

old_fallback = """    if (availableIdols.length < 5) {
        // Fallback if total valid idols < 5 (should not happen with 25 idols and max 17 rounds)
        const missing = 5 - availableIdols.length;
        const allOther = validIdols.filter(i => !availableIdols.some(a => a.id === i.id));
        availableIdols = [...availableIdols, ...allOther.slice(0, missing)];
    }"""

new_fallback = """    if (availableIdols.length < 5) {
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
    }"""

content = content.replace(old_fallback, new_fallback)

with open('src/core/domain/draftEngine.ts', 'w') as f:
    f.write(content)
