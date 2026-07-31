import { IRNG } from '../../utils/rng';
import { 
  Competition, 
  CompetitionFixture, 
  TeamStanding, 
  calculateStandings, 
  getLeagueChampion, 
  scheduleRoundRobin,
  getKnockoutChampion
} from './competition';

export interface SeasonCompetition {
  competition: Competition;
  teams: string[]; // Club IDs
  fixtures: CompetitionFixture[];
  standings: TeamStanding[];
  isFinished: boolean;
  championId?: string;
}

export interface Season {
  id: string;
  year: number;
  competitions: SeasonCompetition[];
  currentWeek: number;
  isFinished: boolean;
}

export interface SeasonSummary {
  year: number;
  competitionResults: {
    competitionId: string;
    competitionName: string;
    championId: string;
    standings: TeamStanding[];
  }[];
}

// 1. Create season
export function createSeason(year: number): Season {
  return {
    id: `season_${year}`,
    year,
    competitions: [],
    currentWeek: 1,
    isFinished: false,
  };
}

// 2. Register clubs and generate calendar
export function registerLeagueCompetition(
  season: Season, 
  competitionId: string, 
  competitionName: string, 
  teamIds: string[]
): Season {
  const newCompetition: Competition = {
    id: competitionId,
    name: competitionName,
    type: 'LEAGUE'
  };

  const fixtures = scheduleRoundRobin(competitionId, teamIds, 1);

  const seasonComp: SeasonCompetition = {
    competition: newCompetition,
    teams: teamIds,
    fixtures,
    standings: calculateStandings(teamIds, []),
    isFinished: false,
  };

  return {
    ...season,
    competitions: [...season.competitions, seasonComp]
  };
}

// 3. Control current round - next match for a club
export function getNextFixtureForClub(season: Season, clubId: string): CompetitionFixture | null {
  for (const comp of season.competitions) {
    if (comp.isFinished) continue;
    
    // Look for unplayed fixtures for this team in the current week or any week
    const teamFixtures = comp.fixtures
      .filter(f => (f.homeTeamId === clubId || f.awayTeamId === clubId) && !f.isPlayed)
      .sort((a, b) => a.week - b.week);
    
    if (teamFixtures.length > 0) {
      const currentWeekFix = teamFixtures.find(f => f.week === season.currentWeek);
      if (currentWeekFix) return currentWeekFix;
    }
  }
  return null;
}

// 4. Register results and update table
export function registerMatchResult(
  season: Season,
  fixtureId: string,
  homeScore: number,
  awayScore: number
): Season {
  const newCompetitions = season.competitions.map(comp => {
    const fixIndex = comp.fixtures.findIndex(f => f.id === fixtureId);
    if (fixIndex === -1) return comp;

    const newFixtures = [...comp.fixtures];
    newFixtures[fixIndex] = {
      ...newFixtures[fixIndex],
      isPlayed: true,
      homeScore,
      awayScore
    };

    const newStandings = comp.competition.type === 'LEAGUE' 
      ? calculateStandings(comp.teams, newFixtures)
      : comp.standings;

    return {
      ...comp,
      fixtures: newFixtures,
      standings: newStandings
    };
  });

  return {
    ...season,
    competitions: newCompetitions
  };
}

// 5. Identify important matches
export type MatchImportance = 'LOW' | 'MEDIUM' | 'HIGH' | 'DERBY' | 'FINAL';

export function getMatchImportance(season: Season, fixtureId: string): MatchImportance {
  for (const comp of season.competitions) {
    const fixture = comp.fixtures.find(f => f.id === fixtureId);
    if (!fixture) continue;

    if (comp.competition.type === 'CUP' || comp.competition.type === 'CONTINENTAL') {
      if (fixture.phaseId === 'KNOCKOUT_2') return 'FINAL';
      if (fixture.phaseId === 'KNOCKOUT_4' || fixture.phaseId === 'KNOCKOUT_8') return 'HIGH';
    }
    
    if (comp.competition.type === 'LEAGUE') {
      const maxWeek = Math.max(...comp.fixtures.map(f => f.week));
      // Last 5 rounds
      if (fixture.week >= maxWeek - 5) {
        const homeStanding = comp.standings.findIndex(s => s.teamId === fixture.homeTeamId);
        const awayStanding = comp.standings.findIndex(s => s.teamId === fixture.awayTeamId);
        
        if (homeStanding !== -1 && awayStanding !== -1) {
          if (Math.abs(homeStanding - awayStanding) <= 3 && (homeStanding < 5 || awayStanding < 5)) {
            return 'HIGH';
          }
          if (Math.abs(homeStanding - awayStanding) <= 3 && (homeStanding >= comp.teams.length - 4 || awayStanding >= comp.teams.length - 4)) {
            return 'HIGH';
          }
        }
      }
    }
  }

  return 'MEDIUM';
}

// 6. Advance week
export function advanceSeasonWeek(season: Season): Season {
  return {
    ...season,
    currentWeek: season.currentWeek + 1
  };
}

// 7. Finish competition
export function finishCompetition(season: Season, competitionId: string): Season {
  const newCompetitions = season.competitions.map(comp => {
    if (comp.competition.id !== competitionId) return comp;
    
    let championId = undefined;
    if (comp.competition.type === 'LEAGUE') {
      championId = getLeagueChampion(comp.standings) || undefined;
    } else {
      championId = getKnockoutChampion(comp.fixtures) || undefined;
    }
    
    return {
      ...comp,
      isFinished: true,
      championId
    };
  });

  return {
    ...season,
    competitions: newCompetitions
  };
}

// 8. Finish season
export function finishSeason(season: Season): Season {
  let finishedSeason = season;
  for (const comp of season.competitions) {
    if (!comp.isFinished) {
      finishedSeason = finishCompetition(finishedSeason, comp.competition.id);
    }
  }
  return {
    ...finishedSeason,
    isFinished: true
  };
}

// 9. Produce final summary
export function generateSeasonSummary(season: Season): SeasonSummary {
  return {
    year: season.year,
    competitionResults: season.competitions.map(comp => ({
      competitionId: comp.competition.id,
      competitionName: comp.competition.name,
      championId: comp.championId || 'None',
      standings: comp.standings
    }))
  };
}
