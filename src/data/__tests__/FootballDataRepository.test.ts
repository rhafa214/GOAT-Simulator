import { describe, it, expect } from 'vitest';
import { FootballDataRepository } from '../FootballDataRepository';

describe('FootballDataRepository', () => {
  it('loads clubs correctly', () => {
    const clubs = FootballDataRepository.getAllClubs();
    expect(clubs.length).toBeGreaterThan(0);
    
    // Check if we have Arsenal and Flamengo or similar known clubs from the mock data
    const arsenal = clubs.find(c => c.name.includes('Arsenal'));
    expect(arsenal).toBeDefined();
    expect(arsenal?.league).toBe('Premier League (Inglaterra)');
  });

  it('validates dataset', () => {
    const isValid = FootballDataRepository.validateDataset();
    expect(isValid).toBe(true);
  });

  it('returns competitions', () => {
    const comps = FootballDataRepository.getCompetitions();
    expect(comps.length).toBeGreaterThan(0);
  });

  it('returns assets references', () => {
    const clubs = FootballDataRepository.getAllClubs();
    const clubWithLogo = clubs.find(c => c.logo !== null);
    
    if (clubWithLogo) {
      const logo = FootballDataRepository.getAssetReference(clubWithLogo.id, 'logo');
      expect(logo).toBeDefined();
    }
  });
  
  it('filters clubs by league', () => {
     const plClubs = FootballDataRepository.getClubsByLeague('Premier League (Inglaterra)');
     expect(plClubs.length).toBeGreaterThan(0);
     expect(plClubs.every(c => c.league === 'Premier League (Inglaterra)')).toBe(true);
  });
});
