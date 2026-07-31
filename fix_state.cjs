const fs = require('fs');
let code = fs.readFileSync('src/components/creation/CreationAttributes.tsx', 'utf8');

code = code.replace(/export default function CreationAttributes\(\) \{[\s\S]*?const { state, dispatch } = useGameEngine\(\);/, `export default function CreationAttributes() {
  const { state, dispatch } = useGameEngine();
  const activeCategories = state.draftLength === 'SHORT' ? DRAFT_CATEGORIES.slice(0, 8) : DRAFT_CATEGORIES;
  const TOTAL_STEPS = activeCategories.length;`);

fs.writeFileSync('src/components/creation/CreationAttributes.tsx', code);
