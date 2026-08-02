import { Club } from '../types';
import { FootballDataRepository } from './FootballDataRepository';

export const LEAGUES = FootballDataRepository.getLeagues().map(l => ({
  id: l.id,
  name: l.name,
  tier: l.tier
}));

export const ALL_CLUBS: Club[] = FootballDataRepository.getAllClubs();

export const MOCK_STARTER_CLUBS: Club[] = ALL_CLUBS.filter(c => c.logo).slice(0, 50);

export const COMPETITIONS = FootballDataRepository.getCompetitions();

export const OPPONENTS = [
   'Real FC', 'City United', 'Sporting', 'Athletic', 'Dragons', 'Lions', 'Eagles', 'Wolves',
   'Stallions', 'Panthers', 'Tigers', 'Sharks'
];
