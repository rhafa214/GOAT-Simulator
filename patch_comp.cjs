const fs = require('fs');

const path = 'src/engine/GameEngine.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /function generateNextMatch[\s\S]*?function advanceWeekLogic/m;

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
  
  if (competition === 'Série A (Brasil)') competition = 'Brasileirão Série A';
  if (competition === 'Série B (Brasil)') competition = 'Brasileirão Série B';
  if (competition === 'Premier League (Inglaterra)') competition = 'Premier League';
  if (competition === 'Championship (Inglaterra)') competition = 'Championship';
  if (competition === 'League One (Inglaterra)') competition = 'League One';
  if (competition === 'League Two (Inglaterra)') competition = 'League Two';
  if (competition === 'National League (Inglaterra)') competition = 'National League';
  
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

function advanceWeekLogic`;

content = content.replace(regex, generateNextMatchFunc.trim());

fs.writeFileSync(path, content);
