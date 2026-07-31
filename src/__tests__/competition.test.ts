import { describe, it, expect } from 'vitest';
import {
  createEmptyStanding,
  updateStanding,
  sortStandings,
  calculateStandings,
  getLeagueChampion,
  scheduleRoundRobin,
  createKnockoutFixtures,
  advanceKnockout,
  getKnockoutChampion,
  CompetitionFixture
} from '../core/domain/competition';

describe('Competition Domain v1', () => {
  describe('League Standings', () => {
    it('creates an empty standing correctly', () => {
      const standing = createEmptyStanding('T1');
      expect(standing.teamId).toBe('T1');
      expect(standing.points).toBe(0);
      expect(standing.goalDifference).toBe(0);
    });

    it('updates standing for a win correctly', () => {
      let standing = createEmptyStanding('T1');
      standing = updateStanding(standing, 3, 1);
      expect(standing.played).toBe(1);
      expect(standing.wins).toBe(1);
      expect(standing.points).toBe(3);
      expect(standing.goalsFor).toBe(3);
      expect(standing.goalsAgainst).toBe(1);
      expect(standing.goalDifference).toBe(2);
    });

    it('updates standing for a draw and loss', () => {
      let standing = createEmptyStanding('T1');
      standing = updateStanding(standing, 1, 1); // Draw
      expect(standing.points).toBe(1);
      expect(standing.draws).toBe(1);
      
      standing = updateStanding(standing, 0, 2); // Loss
      expect(standing.points).toBe(1);
      expect(standing.losses).toBe(1);
      expect(standing.played).toBe(2);
      expect(standing.goalDifference).toBe(-2);
    });

    it('sorts standings by tiebreaker rules', () => {
      const standings = [
        { ...createEmptyStanding('T3'), points: 10, goalDifference: 5, goalsFor: 10 },
        { ...createEmptyStanding('T1'), points: 10, goalDifference: 5, goalsFor: 12 }, // More goals
        { ...createEmptyStanding('T2'), points: 12, goalDifference: 2, goalsFor: 5 },  // More points
        { ...createEmptyStanding('T4'), points: 10, goalDifference: 3, goalsFor: 15 }, // Worse GD
      ];

      const sorted = sortStandings(standings);
      expect(sorted[0].teamId).toBe('T2'); // 12 pts
      expect(sorted[1].teamId).toBe('T1'); // 10 pts, +5 GD, 12 GF
      expect(sorted[2].teamId).toBe('T3'); // 10 pts, +5 GD, 10 GF
      expect(sorted[3].teamId).toBe('T4'); // 10 pts, +3 GD
    });

    it('calculates the whole table from fixtures', () => {
      const fixtures: CompetitionFixture[] = [
        { id: '1', competitionId: 'C1', week: 1, homeTeamId: 'T1', awayTeamId: 'T2', isPlayed: true, homeScore: 2, awayScore: 0 },
        { id: '2', competitionId: 'C1', week: 1, homeTeamId: 'T3', awayTeamId: 'T4', isPlayed: true, homeScore: 1, awayScore: 1 },
        { id: '3', competitionId: 'C1', week: 2, homeTeamId: 'T2', awayTeamId: 'T3', isPlayed: true, homeScore: 1, awayScore: 0 },
      ];

      const table = calculateStandings(['T1', 'T2', 'T3', 'T4'], fixtures);
      
      expect(table[0].teamId).toBe('T1'); // 3 pts, +2
      expect(table[1].teamId).toBe('T2'); // 3 pts, -1
      expect(table[2].teamId).toBe('T4'); // 1 pt, 0 GD
      expect(table[3].teamId).toBe('T3'); // 1 pt, -1 GD
    });
    
    it('returns the champion correctly', () => {
      const table = [
         { ...createEmptyStanding('CHAMP'), points: 90 },
         { ...createEmptyStanding('LOSER'), points: 40 },
      ];
      expect(getLeagueChampion(table)).toBe('CHAMP');
    });
  });

  describe('League Scheduling', () => {
    it('generates double round robin for 4 teams', () => {
      const fixtures = scheduleRoundRobin('L1', ['T1', 'T2', 'T3', 'T4'], 1);
      expect(fixtures.length).toBe(12);
      
      const weeks = [...new Set(fixtures.map(f => f.week))];
      expect(weeks).toEqual([1, 2, 3, 4, 5, 6]);

      const t1t2 = fixtures.find(f => f.homeTeamId === 'T1' && f.awayTeamId === 'T2');
      const t2t1 = fixtures.find(f => f.homeTeamId === 'T2' && f.awayTeamId === 'T1');
      expect(t1t2).toBeDefined();
      expect(t2t1).toBeDefined();
    });
  });

  describe('Knockout System', () => {
    it('creates a proper bracket for 8 teams', () => {
      const fixtures = createKnockoutFixtures('CUP1', ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'], 10);
      
      expect(fixtures.length).toBe(7);
      
      const quarters = fixtures.filter(f => f.phaseId === 'KNOCKOUT_8');
      expect(quarters.length).toBe(4);
      expect(quarters[0].homeTeamId).toBe('T1');
      expect(quarters[0].awayTeamId).toBe('T2');
      
      const semis = fixtures.filter(f => f.phaseId === 'KNOCKOUT_4');
      expect(semis.length).toBe(2);
      
      expect(quarters[0].nextMatchupId).toBe(semis[0].id);
      expect(quarters[1].nextMatchupId).toBe(semis[0].id);
    });

    it('advances a winner to the next round', () => {
      let fixtures = createKnockoutFixtures('CUP1', ['T1', 'T2', 'T3', 'T4'], 10);
      
      const semi1 = fixtures[0]; // Semifinal 1 (T1 vs T2), slot is 'home' for the final
      fixtures = fixtures.map(f => f.id === semi1.id ? { ...f, isPlayed: true, homeScore: 2, awayScore: 0 } : f);
      
      fixtures = advanceKnockout(fixtures, semi1.id);
      
      const final = fixtures.find(f => f.phaseId === 'KNOCKOUT_2');
      expect(final?.homeTeamId).toBe('T1'); 
      expect(final?.awayTeamId).toBe('TBD_2_1'); // Second semi isn't played yet
    });

    it('handles penalty wins correctly', () => {
      let fixtures = createKnockoutFixtures('CUP1', ['T1', 'T2', 'T3', 'T4'], 10);
      
      const semi2 = fixtures[1]; // Semifinal 2 (T3 vs T4), slot is 'away' for the final
      fixtures = fixtures.map(f => f.id === semi2.id ? { ...f, isPlayed: true, homeScore: 1, awayScore: 1, homePenalties: 4, awayPenalties: 5 } : f);
      
      fixtures = advanceKnockout(fixtures, semi2.id);
      
      const final = fixtures.find(f => f.phaseId === 'KNOCKOUT_2');
      expect(final?.awayTeamId).toBe('T4');
    });

    it('identifies the knockout champion', () => {
      let fixtures = createKnockoutFixtures('CUP1', ['T1', 'T2'], 10);
      fixtures[0].isPlayed = true;
      fixtures[0].homeScore = 0;
      fixtures[0].awayScore = 1;
      
      const champ = getKnockoutChampion(fixtures);
      expect(champ).toBe('T2');
    });
  });
});
