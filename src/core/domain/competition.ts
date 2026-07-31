export type CompetitionType = 'LEAGUE' | 'CUP' | 'CONTINENTAL' | 'INTERNATIONAL';

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
}

export interface CompetitionFixture {
  id: string;
  competitionId: string;
  phaseId?: string; // 'LEAGUE' or 'KNOCKOUT_16', 'KNOCKOUT_8', etc.
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  isPlayed: boolean;
  homeScore?: number;
  awayScore?: number;
  homePenalties?: number;
  awayPenalties?: number;
  nextMatchupId?: string; // For knockouts, where the winner goes
  nextMatchupSlot?: 'home' | 'away';
}

export interface TeamStanding {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export function createEmptyStanding(teamId: string): TeamStanding {
  return {
    teamId,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

export function updateStanding(
  standing: TeamStanding,
  goalsFor: number,
  goalsAgainst: number
): TeamStanding {
  const isWin = goalsFor > goalsAgainst;
  const isDraw = goalsFor === goalsAgainst;
  const isLoss = goalsFor < goalsAgainst;

  return {
    ...standing,
    played: standing.played + 1,
    wins: standing.wins + (isWin ? 1 : 0),
    draws: standing.draws + (isDraw ? 1 : 0),
    losses: standing.losses + (isLoss ? 1 : 0),
    goalsFor: standing.goalsFor + goalsFor,
    goalsAgainst: standing.goalsAgainst + goalsAgainst,
    goalDifference: standing.goalDifference + (goalsFor - goalsAgainst),
    points: standing.points + (isWin ? 3 : isDraw ? 1 : 0),
  };
}

export function sortStandings(standings: TeamStanding[]): TeamStanding[] {
  return [...standings].sort((a, b) => {
    // 1. Points
    if (a.points !== b.points) return b.points - a.points;
    // 2. Goal Difference
    if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference;
    // 3. Goals Scored
    if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor;
    // 4. Wins
    if (a.wins !== b.wins) return b.wins - a.wins;
    // 5. Default string comparison for consistent ties
    return a.teamId.localeCompare(b.teamId);
  });
}

export function calculateStandings(
  teamIds: string[],
  fixtures: CompetitionFixture[]
): TeamStanding[] {
  const standingsMap = new Map<string, TeamStanding>();
  for (const id of teamIds) {
    standingsMap.set(id, createEmptyStanding(id));
  }

  for (const fixture of fixtures) {
    if (fixture.isPlayed && fixture.homeScore !== undefined && fixture.awayScore !== undefined) {
      if (standingsMap.has(fixture.homeTeamId)) {
        standingsMap.set(
          fixture.homeTeamId,
          updateStanding(standingsMap.get(fixture.homeTeamId)!, fixture.homeScore, fixture.awayScore)
        );
      }
      if (standingsMap.has(fixture.awayTeamId)) {
        standingsMap.set(
          fixture.awayTeamId,
          updateStanding(standingsMap.get(fixture.awayTeamId)!, fixture.awayScore, fixture.homeScore)
        );
      }
    }
  }

  return sortStandings(Array.from(standingsMap.values()));
}

export function getLeagueChampion(standings: TeamStanding[]): string | null {
  if (standings.length === 0) return null;
  return standings[0].teamId;
}

export function scheduleRoundRobin(
  competitionId: string,
  teamIds: string[],
  startWeek: number
): CompetitionFixture[] {
  const fixtures: CompetitionFixture[] = [];
  const teams = [...teamIds];
  if (teams.length % 2 !== 0) {
    teams.push('BYE');
  }

  const numRounds = teams.length - 1;
  const halfSize = teams.length / 2;

  let currentWeek = startWeek;

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < halfSize; i++) {
      const home = teams[i];
      const away = teams[teams.length - 1 - i];
      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({
          id: `fix_${competitionId}_w${currentWeek}_${home}_${away}`,
          competitionId,
          phaseId: 'LEAGUE',
          week: currentWeek,
          homeTeamId: home,
          awayTeamId: away,
          isPlayed: false,
        });
      }
    }
    teams.splice(1, 0, teams.pop()!);
    currentWeek++;
  }

  for (let round = 0; round < numRounds; round++) {
    for (let i = 0; i < halfSize; i++) {
      const home = teams[i];
      const away = teams[teams.length - 1 - i];
      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({
          id: `fix_${competitionId}_w${currentWeek}_${away}_${home}`,
          competitionId,
          phaseId: 'LEAGUE',
          week: currentWeek,
          homeTeamId: away, 
          awayTeamId: home, 
          isPlayed: false,
        });
      }
    }
    teams.splice(1, 0, teams.pop()!);
    currentWeek++;
  }

  return fixtures;
}

export function createKnockoutFixtures(
  competitionId: string,
  teamIds: string[],
  startWeek: number
): CompetitionFixture[] {
  let currentRoundTeams = [...teamIds];
  const fixtures: CompetitionFixture[] = [];
  
  let currentWeek = startWeek;
  let roundNum = currentRoundTeams.length; 
  
  let previousRoundFixtures: CompetitionFixture[] = [];

  while (roundNum > 1) {
    const nextRoundFixtures: CompetitionFixture[] = [];
    
    for (let i = 0; i < roundNum / 2; i++) {
      const home = roundNum === teamIds.length ? currentRoundTeams[i * 2] : `TBD_${roundNum}_${i*2}`;
      const away = roundNum === teamIds.length ? currentRoundTeams[i * 2 + 1] : `TBD_${roundNum}_${i*2+1}`;
      
      const fixId = `fix_${competitionId}_ko_${roundNum}_${i}`;
      
      const fixture: CompetitionFixture = {
        id: fixId,
        competitionId,
        phaseId: `KNOCKOUT_${roundNum}`,
        week: currentWeek,
        homeTeamId: home,
        awayTeamId: away,
        isPlayed: false,
      };
      
      fixtures.push(fixture);
      nextRoundFixtures.push(fixture);

      if (previousRoundFixtures.length > 0) {
        previousRoundFixtures[i * 2].nextMatchupId = fixId;
        previousRoundFixtures[i * 2].nextMatchupSlot = 'home';
        previousRoundFixtures[i * 2 + 1].nextMatchupId = fixId;
        previousRoundFixtures[i * 2 + 1].nextMatchupSlot = 'away';
      }
    }
    
    previousRoundFixtures = nextRoundFixtures;
    roundNum /= 2;
    currentWeek++;
  }
  
  return fixtures;
}

export function advanceKnockout(
  fixtures: CompetitionFixture[],
  playedFixtureId: string
): CompetitionFixture[] {
  const newFixtures = [...fixtures];
  const playedFix = newFixtures.find(f => f.id === playedFixtureId);
  
  if (!playedFix || !playedFix.isPlayed) return newFixtures;
  if (playedFix.homeScore === undefined || playedFix.awayScore === undefined) return newFixtures;

  let winnerId = '';
  if (playedFix.homeScore > playedFix.awayScore) {
    winnerId = playedFix.homeTeamId;
  } else if (playedFix.awayScore > playedFix.homeScore) {
    winnerId = playedFix.awayTeamId;
  } else {
    if (playedFix.homePenalties !== undefined && playedFix.awayPenalties !== undefined) {
      winnerId = playedFix.homePenalties > playedFix.awayPenalties ? playedFix.homeTeamId : playedFix.awayTeamId;
    } else {
       winnerId = playedFix.homeTeamId;
    }
  }

  if (playedFix.nextMatchupId && playedFix.nextMatchupSlot) {
    const nextFixIndex = newFixtures.findIndex(f => f.id === playedFix.nextMatchupId);
    if (nextFixIndex !== -1) {
      const nextFix = { ...newFixtures[nextFixIndex] };
      if (playedFix.nextMatchupSlot === 'home') {
        nextFix.homeTeamId = winnerId;
      } else {
        nextFix.awayTeamId = winnerId;
      }
      newFixtures[nextFixIndex] = nextFix;
    }
  }

  return newFixtures;
}

export function getKnockoutChampion(fixtures: CompetitionFixture[]): string | null {
  const final = fixtures.find(f => f.phaseId === 'KNOCKOUT_2'); 
  if (!final || !final.isPlayed) return null;
  
  if (final.homeScore! > final.awayScore!) return final.homeTeamId;
  if (final.awayScore! > final.homeScore!) return final.awayTeamId;
  
  if (final.homePenalties !== undefined && final.awayPenalties !== undefined) {
    return final.homePenalties > final.awayPenalties ? final.homeTeamId : final.awayTeamId;
  }
  
  return null;
}
