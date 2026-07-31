import { MatchStats } from '../../types';
import { MatchAggregate } from './match';

export function toLegacyMatchStats(aggregate: MatchAggregate, playerTeamIdOrName: string): MatchStats {
  const { fixture, playerPerformance } = aggregate;
  
  const isHome = fixture.homeTeam.name === playerTeamIdOrName || fixture.homeTeam.id === playerTeamIdOrName;
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;

  return {
    id: fixture.id,
    week: fixture.date.week,
    year: fixture.date.year,
    competition: fixture.context.competition,
    opponent: opponent.name,
    opponentLogo: opponent.logo,
    home: isHome,
    minutesPlayed: playerPerformance?.minutesPlayed || 0,
    goals: playerPerformance?.goals || 0,
    assists: playerPerformance?.assists || 0,
    shots: playerPerformance?.shots || 0,
    passes: playerPerformance?.passes || 0,
    passAccuracy: playerPerformance?.passAccuracy || 0,
    rating: playerPerformance?.rating || 6.0,
    motm: playerPerformance?.isMotm || false,
    injured: playerPerformance?.injured || false,
    wasCaptain: playerPerformance?.isCaptain || false,
  };
}

export function fromLegacyMatchStats(legacy: MatchStats, playerTeamId: string, playerTeamName: string, playerTeamLogo?: string): MatchAggregate {
  const playerTeam = {
    id: playerTeamId,
    name: playerTeamName,
    logo: playerTeamLogo,
  };
  
  const opponentTeam = {
    id: `opp_${legacy.opponent}`,
    name: legacy.opponent,
    logo: legacy.opponentLogo,
  };

  return {
    fixture: {
      id: legacy.id,
      date: {
        week: legacy.week,
        year: legacy.year,
      },
      homeTeam: legacy.home ? playerTeam : opponentTeam,
      awayTeam: legacy.home ? opponentTeam : playerTeam,
      context: {
        competition: legacy.competition,
        isNationalTeam: false,
        importance: 'MEDIUM',
      },
      status: 'FINISHED',
    },
    result: {
      homeScore: 0, // Legacy didn't store score
      awayScore: 0,
    },
    playerPerformance: {
      started: legacy.minutesPlayed > 0,
      substitutedIn: false,
      substitutedOut: false,
      minutesPlayed: legacy.minutesPlayed,
      position: 'Unknown',
      goals: legacy.goals,
      assists: legacy.assists,
      yellowCards: 0,
      redCards: 0,
      injured: legacy.injured,
      rating: legacy.rating,
      isCaptain: legacy.wasCaptain,
      isMotm: legacy.motm,
      shots: legacy.shots,
      passes: legacy.passes,
      passAccuracy: legacy.passAccuracy,
    },
    events: [],
  };
}
