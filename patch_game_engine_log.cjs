const fs = require('fs');

const path = 'src/engine/GameEngine.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "opponent: currentMatchInfo.opponent,",
  "opponent: currentMatchInfo.opponent,\n         opponentLogo: currentMatchInfo.opponentLogo,"
);

fs.writeFileSync(path, content);
