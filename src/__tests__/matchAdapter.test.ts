import { describe, it, expect } from 'vitest';
import { toLegacyMatchStats, fromLegacyMatchStats } from '../core/domain/matchAdapter';
import { MatchAggregate } from '../core/domain/match';
import { MatchStats } from '../types';

describe('matchAdapter', () => {
  it('converts MatchAggregate to legacy MatchStats', () => {
    const aggregate: MatchAggregate = {
      fixture: {
        id: 'match_123',
        date: { week: 10, year: 2024 },
        homeTeam: { id: 'team_a', name: 'Team A' },
        awayTeam: { id: 'team_b', name: 'Team B', logo: 'logo.png' },
        context: {
          competition: 'Liga',
          isNationalTeam: false,
          importance: 'HIGH',
        },
        status: 'FINISHED',
      },
      playerPerformance: {
        started: true,
        substitutedIn: false,
        substitutedOut: false,
        minutesPlayed: 90,
        position: 'ST',
        goals: 2,
        assists: 1,
        yellowCards: 0,
        redCards: 0,
        injured: false,
        rating: 9.5,
        isCaptain: true,
        isMotm: true,
        shots: 5,
        passes: 20,
        passAccuracy: 85,
      }
    };

    const legacy = toLegacyMatchStats(aggregate, 'Team A');

    expect(legacy).toEqual({
      id: 'match_123',
      week: 10,
      year: 2024,
      competition: 'Liga',
      opponent: 'Team B',
      opponentLogo: 'logo.png',
      home: true,
      minutesPlayed: 90,
      goals: 2,
      assists: 1,
      shots: 5,
      passes: 20,
      passAccuracy: 85,
      rating: 9.5,
      motm: true,
      injured: false,
      wasCaptain: true,
    });
  });

  it('converts legacy MatchStats to MatchAggregate', () => {
    const legacy: MatchStats = {
      id: 'match_456',
      week: 5,
      year: 2025,
      competition: 'Copa',
      opponent: 'Rivals',
      opponentLogo: 'rivals.png',
      home: false,
      minutesPlayed: 45,
      goals: 1,
      assists: 0,
      shots: 2,
      passes: 15,
      passAccuracy: 90,
      rating: 7.5,
      motm: false,
      injured: true,
      wasCaptain: false,
    };

    const aggregate = fromLegacyMatchStats(legacy, 'my_team', 'My Team', 'my_logo.png');

    expect(aggregate.fixture.homeTeam.name).toBe('Rivals');
    expect(aggregate.fixture.awayTeam.name).toBe('My Team');
    expect(aggregate.fixture.awayTeam.logo).toBe('my_logo.png');
    expect(aggregate.playerPerformance?.minutesPlayed).toBe(45);
    expect(aggregate.playerPerformance?.goals).toBe(1);
    expect(aggregate.playerPerformance?.injured).toBe(true);
    expect(aggregate.fixture.context.competition).toBe('Copa');
  });
});
