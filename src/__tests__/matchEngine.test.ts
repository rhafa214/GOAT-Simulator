import { describe, it, expect } from 'vitest';
import { simulateMatch, SimulateMatchParams } from '../core/domain/matchEngine';
import { SeededRNG } from '../utils/rng';

describe('matchEngine v1', () => {
  const getBaseParams = (): SimulateMatchParams => ({
    player: {
      id: 'p1', name: 'Ronaldo', position: 'ST', overall: 80, fitness: 100, morale: 80
    },
    team: { id: 't1', name: 'My Team', level: 75 },
    opponent: { id: 't2', name: 'Opponent', level: 70 },
    context: {
      competition: 'League',
      isNationalTeam: false,
      isHome: true,
      importance: 'MEDIUM'
    },
    participation: { started: true, minutesPlayed: 90 }
  });

  it('generates consistent results with the same seed', () => {
    const rng1 = new SeededRNG(123);
    const rng2 = new SeededRNG(123);
    
    const params = getBaseParams();
    
    const result1 = simulateMatch(params, rng1);
    const result2 = simulateMatch(params, rng2);
    
    expect(result1.aggregate.result?.homeScore).toEqual(result2.aggregate.result?.homeScore);
    expect(result1.aggregate.playerPerformance?.rating).toEqual(result2.aggregate.playerPerformance?.rating);
    expect(result1.fitnessImpact).toEqual(result2.fitnessImpact);
  });

  it('stronger team tends to score more goals over multiple tests', () => {
    const params = getBaseParams();
    params.team.level = 90;
    params.opponent.level = 50;
    
    let totalHome = 0;
    let totalAway = 0;
    
    // Simulate 50 matches
    for (let i = 0; i < 50; i++) {
      const rng = new SeededRNG(1000 + i);
      const result = simulateMatch(params, rng);
      totalHome += result.aggregate.result?.homeScore || 0;
      totalAway += result.aggregate.result?.awayScore || 0;
    }
    
    expect(totalHome).toBeGreaterThan(totalAway);
  });

  it('attackers score more goals than defenders', () => {
    let stGoals = 0;
    let cbGoals = 0;

    for (let i = 0; i < 100; i++) {
      const rng = new SeededRNG(2000 + i);
      
      const stParams = getBaseParams();
      stParams.player.position = 'ST';
      stGoals += simulateMatch(stParams, rng).aggregate.playerPerformance?.goals || 0;
      
      // Reset RNG with same seed to isolate positional difference
      const rng2 = new SeededRNG(2000 + i);
      const cbParams = getBaseParams();
      cbParams.player.position = 'CB';
      cbGoals += simulateMatch(cbParams, rng2).aggregate.playerPerformance?.goals || 0;
    }

    expect(stGoals).toBeGreaterThan(cbGoals);
  });

  it('playing 0 minutes yields 0 impact', () => {
    const params = getBaseParams();
    params.participation.started = false;
    params.participation.minutesPlayed = 0;
    
    const rng = new SeededRNG(9999);
    const result = simulateMatch(params, rng);
    
    expect(result.fitnessImpact).toBe(0);
    expect(result.aggregate.playerPerformance?.goals).toBe(0);
    expect(result.aggregate.playerPerformance?.minutesPlayed).toBe(0);
  });
});
