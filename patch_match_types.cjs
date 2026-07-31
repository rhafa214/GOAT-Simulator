const fs = require('fs');

const path = 'src/types.ts';
let content = fs.readFileSync(path, 'utf8');

// MatchStats interface
content = content.replace(
  "opponent: string;",
  "opponent: string;\n  opponentLogo?: string;"
);

fs.writeFileSync(path, content);
