const fs = require('fs');
let code = fs.readFileSync('src/components/creation/CreationAttributes.tsx', 'utf8');

// Replace constant references to activeCategories
code = code.replace(/export default function CreationAttributes\(\) \{/, `
export default function CreationAttributes() {
  const { state, dispatch } = useGameEngine();
  
  const activeCategories = state.draftLength === 'SHORT' 
    ? DRAFT_CATEGORIES.slice(0, 8) 
    : DRAFT_CATEGORIES;
    
  const TOTAL_STEPS = activeCategories.length;
`);

// Now replace usages inside the component
code = code.replace(/const { state, dispatch } = useGameEngine\(\);/, '');
code = code.replace(/Array\(20\)\.fill\(null\)/, 'Array(TOTAL_STEPS).fill(null)');
code = code.replace(/currentStep < 20/, 'currentStep < TOTAL_STEPS');
code = code.replace(/DRAFT_CATEGORIES\[currentStep\]/g, 'activeCategories[currentStep]');
code = code.replace(/DRAFT_CATEGORIES\[index\]/g, 'activeCategories[index]');
code = code.replace(/DRAFT_CATEGORIES\[i\]/g, 'activeCategories[i]');

// Now we need to modify the finalize selection to handle the fast mode calculations
// Let's find how handleNext works
// We will replace handleNext or the block inside handleSelect when currentStep === TOTAL_STEPS - 1
// But wait, the completion might be in another function.
fs.writeFileSync('src/components/creation/CreationAttributes.tsx.tmp', code);
