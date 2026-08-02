import englandClubs from './imported_england.json';
import brazilClubs from './imported_brazil.json';
import { Club } from '../types';

export interface League {
  id: string;
  name: string;
  country: string;
  tier: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface CompetitionData {
  id: string;
  name: string;
  prestige: number;
}

class FootballDataRepositoryImpl {
  private clubsMap: Map<string, Club> = new Map();
  private leagues: League[] = [
    { id: 'bra_a', name: 'Série A (Brasil)', country: 'Brasil', tier: 1 },
    { id: 'bra_b', name: 'Série B (Brasil)', country: 'Brasil', tier: 2 },
    { id: 'eng_1', name: 'Premier League (Inglaterra)', country: 'Inglaterra', tier: 1 },
    { id: 'eng_2', name: 'Championship (Inglaterra)', country: 'Inglaterra', tier: 2 },
    { id: 'eng_3', name: 'League One (Inglaterra)', country: 'Inglaterra', tier: 3 },
    { id: 'eng_4', name: 'League Two (Inglaterra)', country: 'Inglaterra', tier: 4 },
    { id: 'eng_5', name: 'National League (Inglaterra)', country: 'Inglaterra', tier: 5 },
  ];

  private countries: Country[] = [
    { id: 'bra', name: 'Brasil', code: 'BR' },
    { id: 'eng', name: 'Inglaterra', code: 'EN' },
  ];

  private competitions: CompetitionData[] = [
    { id: 'cup_nat', name: 'Copa Nacional', prestige: 50 },
    { id: 'league_nat', name: 'Liga Nacional', prestige: 70 },
    { id: 'cup_cont', name: 'Liga Continental', prestige: 100 },
  ];
  
  constructor() {
    this.normalizeAndLoad();
  }

  private normalizeAndLoad() {
    // We shouldn't use external logos if they are not explicitly clear about license,
    // but the importer provided them from a GitHub source. 
    // Fallback logic implemented:
    
    type ImportedClub = { official_name?: string, short_name?: string, logo_url?: string, external_id: string, colors?: string[] };
    const parseClub = (c: ImportedClub, defaultLeague: string, defaultColor: string, defaultRep: number): Club => {
      const name = c.official_name || c.short_name || 'Unknown Club';
      const logo = c.logo_url || null; 
      
      // If we don't have a logo, we should fallback to a safe option. 
      // A placeholder shield or color initials would be best, but for now we leave it null 
      // or handle it in the UI as requested (UI already handles missing logos with <Shield/>).
      
      return {
        id: c.external_id,
        name: name,
        tier: 1, 
        league: defaultLeague,
        baseSalary: 10000,
        primaryColor: (c.colors && c.colors.length > 0) ? c.colors[0] : defaultColor,
        reputation: defaultRep,
        logo: logo
      };
    };

    englandClubs.forEach((c: ImportedClub) => {
      const club = parseClub(c, 'Premier League (Inglaterra)', '#e53238', 80);
      this.clubsMap.set(club.id, club);
    });

    brazilClubs.forEach((c: ImportedClub) => {
      const club = parseClub(c, 'Série A (Brasil)', '#00d2ff', 75);
      this.clubsMap.set(club.id, club);
    });
  }

  getCountry(id: string): Country | undefined {
    return this.countries.find(c => c.id === id);
  }

  getLeagues(countryId?: string): League[] {
    if (countryId) {
       const country = this.getCountry(countryId);
       if (!country) return [];
       return this.leagues.filter(l => l.country === country.name);
    }
    return this.leagues;
  }

  getLeague(id: string): League | undefined {
    return this.leagues.find(l => l.id === id);
  }

  getClubsByLeague(leagueName: string): Club[] {
    return Array.from(this.clubsMap.values()).filter(c => c.league === leagueName);
  }

  getClub(id: string): Club | undefined {
    return this.clubsMap.get(id);
  }

  getCompetitions(): CompetitionData[] {
    return this.competitions;
  }
  
  getAssetReference(clubId: string, assetType: 'logo' | 'kit'): string | null {
    const club = this.clubsMap.get(clubId);
    if (!club) return null;
    
    if (assetType === 'logo') {
      return club.logo || null;
    }
    return null;
  }

  validateDataset(): boolean {
    let isValid = true;
    this.clubsMap.forEach((club, id) => {
      if (!club.name || !club.league || !id) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[FootballDataRepository] Invalid club data for ID: ${id}`);
        }
        isValid = false;
      }
    });
    return isValid;
  }

  getAllClubs(): Club[] {
    return Array.from(this.clubsMap.values());
  }
}

export const FootballDataRepository = new FootballDataRepositoryImpl();
