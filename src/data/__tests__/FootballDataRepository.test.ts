import { describe, it, expect } from 'vitest';
import { FootballDataRepository } from '../FootballDataRepository';

describe('FootballDataRepository', () => {
  it('loads clubs correctly', () => {
    const clubs = FootballDataRepository.getAllClubs();
    expect(clubs.length).toBeGreaterThan(0);

    const arsenal = clubs.find((c) => c.name.includes('Arsenal'));
    expect(arsenal).toBeDefined();
    expect(arsenal?.league).toBe('Premier League (Inglaterra)');
    expect(arsenal?.validationStatus).toBe('VALIDATED');
  });

  it('separates validated and unclassified clubs', () => {
    const validated = FootballDataRepository.getValidatedClubs();
    const unclassified = FootballDataRepository.getUnclassifiedClubs();

    expect(validated.length).toBe(20);
    expect(unclassified.length).toBeGreaterThan(0);
    expect(validated.every((c) => c.validationStatus === 'VALIDATED')).toBe(true);
    expect(unclassified.every((c) => c.validationStatus === 'UNCLASSIFIED')).toBe(true);
    expect(unclassified.every((c) => c.league === 'Unclassified')).toBe(true);
  });

  it('generates a comprehensive validation report', () => {
    const report = FootballDataRepository.getValidationReport();
    expect(report.totalClubs).toBe(FootballDataRepository.getAllClubs().length);
    expect(report.validatedClubsCount).toBe(20);
    expect(report.unclassifiedClubsCount).toBe(report.totalClubs - 20);
    expect(report.summary.duplicateIds).toBe(0);
    expect(report.summary.missingNamesOrIds).toBe(0);
    expect(report.summary.emptyLogosNormalized).toBe(232);
    expect(report.isValid).toBe(true);
  });

  it('validates dataset boolean check', () => {
    const isValid = FootballDataRepository.validateDataset();
    expect(isValid).toBe(true);
  });

  it('returns competitions', () => {
    const comps = FootballDataRepository.getCompetitions();
    expect(comps.length).toBeGreaterThan(0);
  });

  it('returns asset references', () => {
    const clubs = FootballDataRepository.getAllClubs();
    const clubWithLogo = clubs.find((c) => c.logo !== null);

    if (clubWithLogo) {
      const logo = FootballDataRepository.getAssetReference(
        clubWithLogo.id,
        'logo'
      );
      expect(logo).toBeDefined();
    }
  });

  it('filters clubs by league', () => {
    const plClubs = FootballDataRepository.getClubsByLeague(
      'Premier League (Inglaterra)'
    );
    expect(plClubs.length).toBe(20);
    expect(
      plClubs.every((c) => c.league === 'Premier League (Inglaterra)')
    ).toBe(true);
  });
});
