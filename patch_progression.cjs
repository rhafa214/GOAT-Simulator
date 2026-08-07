const fs = require('fs');
const path = './src/core/domain/progressionEngine.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/growthCurve:\s*curve,/, "growthCurve: curve,\n      growthProfile: 'Consistent',");

fs.writeFileSync(path, code);
