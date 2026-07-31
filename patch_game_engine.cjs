const fs = require('fs');

const path = 'src/engine/GameEngine.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to import ALL_CLUBS
content = content.replace(
  "import { OPPONENTS, COMPETITIONS } from '../data/database';",
  "import { OPPONENTS, COMPETITIONS, ALL_CLUBS } from '../data/database';"
);

// We need to change SETUP_CAREER to generate a valid next match
content = content.replace(
  "career: { ...state.career, currentClub: action.payload.club },",
  "career: { ...state.career, currentClub: action.payload.club, nextMatch: generateNextMatch(action.payload.club) },"
);

// We need to add generateNextMatch function before advanceWeekLogic
const generateNextMatchFunc = `
function generateNextMatch(currentClub: Club | null) {
  if (!currentClub) return null;
  
  // Find clubs in the same league
  const possibleOpponents = ALL_CLUBS.filter(c => c.league === currentClub.league && c.id !== currentClub.id);
  
  let opponentName = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
  let logo = undefined;
  
  if (possibleOpponents.length > 0) {
    const opp = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
    opponentName = opp.name;
    logo = opp.logo;
  }
  
  let competition = currentClub.league;
  
  // 20% chance for a Cup match
  if (Math.random() > 0.8) {
    if (currentClub.league.includes('Brasil')) {
      competition = Math.random() > 0.5 ? 'Copa do Brasil' : 'Copa Libertadores';
    } else if (currentClub.league.includes('Inglaterra')) {
      competition = Math.random() > 0.5 ? 'FA Cup' : 'Carabao Cup';
    }
  }

  return {
    opponent: opponentName,
    opponentLogo: logo,
    isHome: Math.random() > 0.5,
    competition: competition
  };
}
`;

content = content.replace("function advanceWeekLogic", generateNextMatchFunc + "\nfunction advanceWeekLogic");

// We need to update nextMatchInfo generation inside advanceWeekLogic
const oldMatchGen = `
   let nextMatchInfo = null;
   if (state.career.currentClub !== null && Math.random() > 0.3) {
      nextMatchInfo = {
         opponent: OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)],
         isHome: Math.random() > 0.5,
         competition: COMPETITIONS[Math.floor(Math.random() * COMPETITIONS.length)].name
      };
   }
`;

const newMatchGen = `
   let nextMatchInfo = null;
   if (state.career.currentClub !== null && Math.random() > 0.3) {
      nextMatchInfo = generateNextMatch(state.career.currentClub);
   }
`;

content = content.replace(oldMatchGen.trim(), newMatchGen.trim());

fs.writeFileSync(path, content);
console.log('Patched GameEngine.tsx');
