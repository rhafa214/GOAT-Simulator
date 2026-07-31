import { describe, it, expect } from 'vitest';
import {
  createSeason,
  registerLeagueCompetition,
  getNextFixtureForClub,
  registerMatchResult,
  getMatchImportance,
  advanceSeasonWeek,
  finishCompetition,
  finishSeason,
  generateSeasonSummary
} from '../core/domain/seasonEngine';

describe('Season Engine v1', () => {
  it('creates a season correctly', () => {
    const season = createSeason(2024);
    expect(season.year).toBe(2024);
    expect(season.currentWeek).toBe(1);
    expect(season.competitions.length).toBe(0);
    expect(season.isFinished).toBe(false);
  });

  it('registers a league competition', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR_SERIE_A', 'Brasileirão Série A', ['FLA', 'PAL', 'SAO', 'COR']);
    
    expect(season.competitions.length).toBe(1);
    const comp = season.competitions[0];
    expect(comp.competition.id).toBe('BR_SERIE_A');
    expect(comp.teams.length).toBe(4);
    expect(comp.fixtures.length).toBe(12);
    expect(comp.standings.length).toBe(4);
    expect(comp.isFinished).toBe(false);
  });

  it('gets next fixture for a club', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR', 'Brasileirão', ['FLA', 'PAL', 'SAO', 'COR']);
    
    const fix = getNextFixtureForClub(season, 'FLA');
    expect(fix).toBeDefined();
    expect(fix?.week).toBe(1);
    expect([fix?.homeTeamId, fix?.awayTeamId]).toContain('FLA');
  });

  it('registers match result and updates table', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR', 'Brasileirão', ['FLA', 'PAL', 'SAO', 'COR']);
    
    const fix = getNextFixtureForClub(season, 'FLA');
    expect(fix).toBeDefined();
    
    season = registerMatchResult(season, fix!.id, 3, 1);
    
    const comp = season.competitions[0];
    const playedFix = comp.fixtures.find(f => f.id === fix!.id);
    expect(playedFix?.isPlayed).toBe(true);
    expect(playedFix?.homeScore).toBe(3);
    
    const flaStanding = comp.standings.find(s => s.teamId === 'FLA');
    expect(flaStanding).toBeDefined();
    if (fix?.homeTeamId === 'FLA') {
      expect(flaStanding?.points).toBe(3);
    } else {
      expect(flaStanding?.points).toBe(0);
    }
  });

  it('identifies match importance', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR', 'Brasileirão', ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8']);
    
    const fix = getNextFixtureForClub(season, 'T1');
    expect(fix).toBeDefined();
    
    // In week 1 of 8 teams league (14 weeks), it is NOT the last 5 rounds, so it should be MEDIUM.
    const importance = getMatchImportance(season, fix!.id);
    expect(importance).toBe('MEDIUM');
    
    // Simulate being at week 12 (out of 14) and teams being close
    season = { ...season, currentWeek: 12 };
    const week12Fix = season.competitions[0].fixtures.find(f => f.week === 12);
    const importanceW12 = getMatchImportance(season, week12Fix!.id);
    expect(importanceW12).toBe('HIGH');
  });

  it('advances week', () => {
    let season = createSeason(2024);
    season = advanceSeasonWeek(season);
    expect(season.currentWeek).toBe(2);
  });

  it('finishes competition and identifies champion', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR', 'Brasileirão', ['FLA', 'PAL']);
    
    const comp = season.competitions[0];
    const f1 = comp.fixtures[0];
    const f2 = comp.fixtures[1];
    
    season = registerMatchResult(season, f1.id, 2, 0);
    season = registerMatchResult(season, f2.id, 1, 1);
    
    season = finishCompetition(season, 'BR');
    
    const finishedComp = season.competitions[0];
    expect(finishedComp.isFinished).toBe(true);
    expect(finishedComp.championId).toBe(f1.homeTeamId);
  });

  it('finishes season and generates summary', () => {
    let season = createSeason(2024);
    season = registerLeagueCompetition(season, 'BR', 'Brasileirão', ['FLA', 'PAL']);
    season = finishSeason(season);
    
    expect(season.isFinished).toBe(true);
    expect(season.competitions[0].isFinished).toBe(true);
    
    const summary = generateSeasonSummary(season);
    expect(summary.year).toBe(2024);
    expect(summary.competitionResults.length).toBe(1);
    expect(summary.competitionResults[0].competitionId).toBe('BR');
  });
});
