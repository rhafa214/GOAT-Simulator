import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson.scripts.prebuild = "node scripts/validate-glb.mjs public/models/avatar/goat_base_human_v2.glb";
packageJson.scripts.postbuild = "node scripts/validate-glb.mjs dist/models/avatar/goat_base_human_v2.glb && node scripts/compare-glb.mjs public/models/avatar/goat_base_human_v2.glb dist/models/avatar/goat_base_human_v2.glb";

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
