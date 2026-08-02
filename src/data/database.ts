import { Club } from '../types';
import { FootballDataRepository } from './FootballDataRepository';

export const LEAGUES = FootballDataRepository.getLeagues().map(l => ({
  id: l.id,
  name: l.name,
  tier: l.tier
}));

export const ALL_CLUBS: Club[] = FootballDataRepository.getAllClubs();

export const STARTER_CLUBS: Club[] = FootballDataRepository.getValidatedClubs();
export const MOCK_STARTER_CLUBS: Club[] = STARTER_CLUBS;

export const COMPETITIONS = FootballDataRepository.getCompetitions();
