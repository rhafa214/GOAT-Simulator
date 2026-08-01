import { describe, it, expect } from 'vitest';
import { LegacyEngine } from '../core/domain/legacyEngine';
import { SeasonRecord } from '../types';

describe('LegacyEngine', () => {
  it('calculates legacy correctly for an average career', () => {
    const history: SeasonRecord[] = [
      {
        year: 2024, clubId: 'club1', clubName: 'Club 1', shirtNumber: 10, salary: 100, matchesPlayed: 30, minutesPlayed: 2000,
        goals: 5, assists: 5, shots: 10, passes: 100, passAccuracySum: 80, avgRating: 6.8, injuries: 0, motm: 1, captaincies: 0,
        competitions: ['Liga'], trophies: [], awards: []
      },
      {
        year: 2025, clubId: 'club1', clubName: 'Club 1', shirtNumber: 10, salary: 100, matchesPlayed: 40, minutesPlayed: 3000,
        goals: 10, assists: 8, shots: 20, passes: 200, passAccuracySum: 85, avgRating: 7.2, injuries: 0, motm: 3, captaincies: 0,
        competitions: ['Liga'], trophies: ['Liga Nacional'], awards: []
      }
    ];

    const result = LegacyEngine.calculateLegacy(history);
    
    expect(result.summary.totalGoals).toBe(15);
    expect(result.summary.totalMatches).toBe(70);
    expect(result.events.some(e => e.name === 'Liga Nacional')).toBe(true);
    // 200 pts for Liga Nacional
    expect(result.score.clubLegend).toBe(200);
    expect(result.hallOfFameLevel).toBe('NONE');
  });

  it('calculates legacy for a GOAT career', () => {
    const history: SeasonRecord[] = [];
    for (let i = 0; i < 15; i++) {
      const year = 2020 + i;
      history.push({
        year, clubId: 'fcb', clubName: 'FCB', shirtNumber: 10, salary: 10000, matchesPlayed: 50, minutesPlayed: 4500,
        goals: 60, assists: 25, shots: 100, passes: 1000, passAccuracySum: 85, avgRating: 8.5, injuries: 0, motm: 20, captaincies: 50,
        competitions: ['Liga', 'Champions League'], trophies: ['Liga Nacional', 'Champions League'], awards: ['Ballon d\'Or', 'Golden Boot']
      });
    }
    
    // Add a World Cup
    history[2].trophies.push('World Cup');

    const result = LegacyEngine.calculateLegacy(history);
    
    expect(result.summary.totalGoals).toBe(900); // 15 * 60
    expect(result.summary.ballonDors).toBe(15);
    expect(result.summary.championsLeagues).toBe(15);
    expect(result.summary.worldCups).toBe(1);
    
    // Check milestones
    expect(result.milestones).toContain('500_GOALS');
    
    // Check records
    expect(result.records).toContain('50_GOALS_SEASON');
    
    // Captaincy bonus applied to trophies
    const uclEvent = result.events.find(e => e.name === 'Champions League');
    // base 400 * 1.5 = 600
    expect(uclEvent?.points).toBe(600);

    expect(result.hallOfFameLevel).toBe('GOAT');
    
    // Synergy applied
    // expect(result.events.some(e => e.name === 'Carreira Completa')).toBe(true);
  });

  it('detects 90 goals record', () => {
    const history: SeasonRecord[] = [
      {
        year: 2024, clubId: 'club1', clubName: 'Club 1', shirtNumber: 10, salary: 100, matchesPlayed: 60, minutesPlayed: 5000,
        goals: 92, assists: 20, shots: 10, passes: 100, passAccuracySum: 80, avgRating: 9.0, injuries: 0, motm: 30, captaincies: 0,
        competitions: [], trophies: [], awards: []
      }
    ];

    const result = LegacyEngine.calculateLegacy(history);
    expect(result.records).toContain('90_GOALS_SEASON');
    expect(result.events.some(e => e.name === 'Mais de 90 Gols no Ano')).toBe(true);
  });
});
