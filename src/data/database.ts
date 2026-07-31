import { Club } from '../types';
import englandClubs from './imported_england.json';
import brazilClubs from './imported_brazil.json';

export const LEAGUES = [
   { id: 'bra_a', name: 'Série A (Brasil)', tier: 1 },
   { id: 'bra_b', name: 'Série B (Brasil)', tier: 2 },
   { id: 'eng_1', name: 'Premier League (Inglaterra)', tier: 1 },
   { id: 'eng_2', name: 'Championship (Inglaterra)', tier: 2 },
   { id: 'eng_3', name: 'League One (Inglaterra)', tier: 3 },
   { id: 'eng_4', name: 'League Two (Inglaterra)', tier: 4 },
   { id: 'eng_5', name: 'National League (Inglaterra)', tier: 5 },
];

export const ALL_CLUBS: Club[] = [
  ...englandClubs.map(c => ({
    id: c.external_id,
    name: c.official_name,
    tier: 1, // Defaulting to 1, in a real app this would map from competition
    league: 'Premier League (Inglaterra)',
    baseSalary: 10000,
    primaryColor: '#e53238',
    reputation: 80,
    logo: c.logo_url
  })),
  ...brazilClubs.map(c => ({
    id: c.external_id,
    name: c.official_name,
    tier: 1,
    league: 'Série A (Brasil)',
    baseSalary: 8000,
    primaryColor: '#00d2ff',
    reputation: 75,
    logo: c.logo_url
  }))
];

export const MOCK_STARTER_CLUBS: Club[] = ALL_CLUBS.filter(c => c.logo).slice(0, 50); // Get clubs with logos as starters for now

export const COMPETITIONS = [
   { id: 'cup_nat', name: 'Copa Nacional', prestige: 50 },
   { id: 'league_nat', name: 'Liga Nacional', prestige: 70 },
   { id: 'cup_cont', name: 'Liga Continental', prestige: 100 },
];

export const OPPONENTS = [
   'Real FC', 'City United', 'Sporting', 'Athletic', 'Dragons', 'Lions', 'Eagles', 'Wolves',
   'Stallions', 'Panthers', 'Tigers', 'Sharks'
];
