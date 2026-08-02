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

export interface ImportedClub {
  external_id: string;
  official_name?: string;
  short_name?: string;
  abbreviation?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  stadium_name?: string | null;
  stadium_capacity?: number | null;
  foundation_year?: number | null;
  colors?: string[];
  logo_url?: string | null;
  league_id?: string | null;
  league_name?: string | null;
  division?: number | string | null;
  tier?: number | null;
  season?: string | null;
  validation_status?: 'VALIDATED' | 'UNCLASSIFIED' | 'FLAGGED' | null;
  data_source?: string | null;
}

export interface ValidationIssue {
  type:
    | 'DUPLICATE_ID'
    | 'DUPLICATE_NAME'
    | 'DUPLICATE_ABBREVIATION'
    | 'INCONSISTENT_COUNTRY'
    | 'INVALID_TIER'
    | 'NONEXISTENT_LEAGUE'
    | 'MISSING_ID'
    | 'MISSING_NAME'
    | 'EMPTY_LOGO'
    | 'RESERVE_TEAM_FLAG'
    | 'UNCLASSIFIED_LEAGUE';
  clubId?: string;
  clubName?: string;
  league?: string;
  message: string;
  severity: 'WARNING' | 'ERROR';
}

export interface ValidationReport {
  isValid: boolean;
  totalClubs: number;
  validatedClubsCount: number;
  unclassifiedClubsCount: number;
  issues: ValidationIssue[];
  summary: {
    duplicateIds: number;
    duplicateNamesInLeague: number;
    missingNamesOrIds: number;
    emptyLogosNormalized: number;
    reserveTeamsFlagged: number;
    unclassifiedClubs: number;
  };
}

// Map of 20 English clubs whose participation in Premier League 2023-24 is explicitly validated
// from data/raw/football_data_uk_e0_2324.json match logs.
const VALIDATED_PREMIER_LEAGUE_IDS = new Set([
  'of_eng_burnleyfc',
  'of_eng_arsenalfc',
  'of_eng_afcbournemouth',
  'of_eng_brightonhovealbionfc',
  'of_eng_evertonfc',
  'of_eng_sheffieldunitedfc',
  'of_eng_newcastleunitedfc',
  'of_eng_brentfordfc',
  'of_eng_chelseafc',
  'of_eng_manchesterunitedfc',
  'of_eng_nottinghamforestfc',
  'of_eng_fulhamfc',
  'of_eng_liverpoolfc',
  'of_eng_wolverhamptonwanderersfc',
  'of_eng_tottenhamhotspurfc',
  'of_eng_manchestercityfc',
  'of_eng_astonvillafc',
  'of_eng_westhamunitedfc',
  'of_eng_crystalpalacefc',
  'of_eng_lutontownfc'
]);

class FootballDataRepositoryImpl {
  private clubsMap: Map<string, Club> = new Map();
  private validationReportCache: ValidationReport | null = null;

  private leagues: League[] = [
    { id: 'bra_a', name: 'Série A (Brasil)', country: 'Brasil', tier: 1 },
    { id: 'bra_b', name: 'Série B (Brasil)', country: 'Brasil', tier: 2 },
    { id: 'eng_1', name: 'Premier League (Inglaterra)', country: 'Inglaterra', tier: 1 },
    { id: 'eng_2', name: 'Championship (Inglaterra)', country: 'Inglaterra', tier: 2 },
    { id: 'eng_3', name: 'League One (Inglaterra)', country: 'Inglaterra', tier: 3 },
    { id: 'eng_4', name: 'League Two (Inglaterra)', country: 'Inglaterra', tier: 4 },
    { id: 'eng_5', name: 'National League (Inglaterra)', country: 'Inglaterra', tier: 5 }
  ];

  private countries: Country[] = [
    { id: 'bra', name: 'Brasil', code: 'BR' },
    { id: 'eng', name: 'Inglaterra', code: 'EN' }
  ];

  private competitions: CompetitionData[] = [
    { id: 'cup_nat', name: 'Copa Nacional', prestige: 50 },
    { id: 'league_nat', name: 'Liga Nacional', prestige: 70 },
    { id: 'cup_cont', name: 'Liga Continental', prestige: 100 }
  ];

  constructor() {
    this.normalizeAndLoad();
  }

  private normalizeAndLoad() {
    this.clubsMap.clear();

    const parseClub = (c: ImportedClub, countryDefault: string, defaultColor: string): Club => {
      const name = (c.official_name || c.short_name || '').trim() || 'Unknown Club';
      
      // Normalize empty logo_url strings to null
      let logo: string | null = null;
      if (c.logo_url && c.logo_url.trim().length > 0) {
        logo = c.logo_url.trim();
      }

      const isValidatedPL = VALIDATED_PREMIER_LEAGUE_IDS.has(c.external_id);

      const leagueName = isValidatedPL ? 'Premier League (Inglaterra)' : 'Unclassified';
      const leagueId = isValidatedPL ? 'eng_1' : null;
      const tier = isValidatedPL ? 1 : 0;
      const validationStatus: 'VALIDATED' | 'UNCLASSIFIED' = isValidatedPL ? 'VALIDATED' : 'UNCLASSIFIED';
      const dataSource = isValidatedPL ? 'football_data_uk_e0_2324.json' : 'openfootball_raw';
      const reputation = isValidatedPL ? 85 : 50;

      return {
        id: c.external_id,
        name,
        tier,
        league: leagueName,
        baseSalary: 10000,
        primaryColor: c.colors && c.colors.length > 0 ? c.colors[0] : defaultColor,
        reputation,
        logo,
        leagueId,
        leagueName,
        division: isValidatedPL ? 1 : null,
        season: isValidatedPL ? '2023-24' : null,
        validationStatus,
        dataSource
      };
    };

    (englandClubs as ImportedClub[]).forEach((c) => {
      const club = parseClub(c, 'Inglaterra', '#e53238');
      this.clubsMap.set(club.id, club);
    });

    (brazilClubs as ImportedClub[]).forEach((c) => {
      const club = parseClub(c, 'Brasil', '#00d2ff');
      this.clubsMap.set(club.id, club);
    });

    this.runValidationAudit();
  }

  private runValidationAudit(): ValidationReport {
    const issues: ValidationIssue[] = [];
    const seenIds = new Set<string>();
    const seenNamesInLeague = new Set<string>();
    const seenAbbrevsInLeague = new Set<string>();

    let duplicateIds = 0;
    let duplicateNamesInLeague = 0;
    let missingNamesOrIds = 0;
    let emptyLogosNormalized = 0;
    let reserveTeamsFlagged = 0;
    let unclassifiedClubs = 0;
    let validatedClubsCount = 0;

    const reserveRegex = /\b(B|U21|U23|Reserves?|Youth|Academy|Feminino|Women)\b/i;

    this.clubsMap.forEach((club) => {
      // Check ID missing/duplicate
      if (!club.id) {
        missingNamesOrIds++;
        issues.push({
          type: 'MISSING_ID',
          message: `Club "${club.name}" lacks a valid ID`,
          severity: 'ERROR'
        });
      } else if (seenIds.has(club.id)) {
        duplicateIds++;
        issues.push({
          type: 'DUPLICATE_ID',
          clubId: club.id,
          clubName: club.name,
          message: `Duplicate club ID detected: ${club.id}`,
          severity: 'ERROR'
        });
      } else {
        seenIds.add(club.id);
      }

      // Check Name missing
      if (!club.name || club.name === 'Unknown Club') {
        missingNamesOrIds++;
        issues.push({
          type: 'MISSING_NAME',
          clubId: club.id,
          message: `Club ID ${club.id} is missing an official name`,
          severity: 'ERROR'
        });
      }

      // Check duplicate name within the same league
      const leagueNameKey = `${club.league}_${club.name.toLowerCase()}`;
      if (seenNamesInLeague.has(leagueNameKey)) {
        duplicateNamesInLeague++;
        issues.push({
          type: 'DUPLICATE_NAME',
          clubId: club.id,
          clubName: club.name,
          league: club.league,
          message: `Duplicate club name "${club.name}" within league "${club.league}"`,
          severity: 'WARNING'
        });
      } else {
        seenNamesInLeague.add(leagueNameKey);
      }

      // Check logo empty / null
      if (!club.logo) {
        emptyLogosNormalized++;
        issues.push({
          type: 'EMPTY_LOGO',
          clubId: club.id,
          clubName: club.name,
          message: `Club "${club.name}" logo is null (normalized, UI fallback enabled)`,
          severity: 'WARNING'
        });
      }

      // Check Reserve / B-team flags
      if (reserveRegex.test(club.name)) {
        reserveTeamsFlagged++;
        issues.push({
          type: 'RESERVE_TEAM_FLAG',
          clubId: club.id,
          clubName: club.name,
          message: `Club "${club.name}" flagged as possible Reserve/Youth team`,
          severity: 'WARNING'
        });
      }

      // Check classification
      if (club.validationStatus === 'VALIDATED') {
        validatedClubsCount++;
      } else {
        unclassifiedClubs++;
        issues.push({
          type: 'UNCLASSIFIED_LEAGUE',
          clubId: club.id,
          clubName: club.name,
          message: `Club "${club.name}" lacks explicit division/league metadata`,
          severity: 'WARNING'
        });
      }
    });

    const report: ValidationReport = {
      isValid: missingNamesOrIds === 0 && duplicateIds === 0,
      totalClubs: this.clubsMap.size,
      validatedClubsCount,
      unclassifiedClubsCount: unclassifiedClubs,
      issues,
      summary: {
        duplicateIds,
        duplicateNamesInLeague,
        missingNamesOrIds,
        emptyLogosNormalized,
        reserveTeamsFlagged,
        unclassifiedClubs
      }
    };

    this.validationReportCache = report;
    return report;
  }

  getCountry(id: string): Country | undefined {
    return this.countries.find((c) => c.id === id);
  }

  getLeagues(countryId?: string): League[] {
    if (countryId) {
      const country = this.getCountry(countryId);
      if (!country) return [];
      return this.leagues.filter((l) => l.country === country.name);
    }
    return this.leagues;
  }

  getLeague(id: string): League | undefined {
    return this.leagues.find((l) => l.id === id);
  }

  getClubsByLeague(leagueName: string): Club[] {
    return Array.from(this.clubsMap.values()).filter(
      (c) => c.league === leagueName && c.validationStatus === 'VALIDATED'
    );
  }

  getClub(id: string): Club | undefined {
    return this.clubsMap.get(id);
  }

  getAllClubs(): Club[] {
    return Array.from(this.clubsMap.values());
  }

  getValidatedClubs(): Club[] {
    return Array.from(this.clubsMap.values()).filter(
      (c) => c.validationStatus === 'VALIDATED'
    );
  }

  getUnclassifiedClubs(): Club[] {
    return Array.from(this.clubsMap.values()).filter(
      (c) => c.validationStatus === 'UNCLASSIFIED'
    );
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

  getValidationReport(): ValidationReport {
    if (!this.validationReportCache) {
      return this.runValidationAudit();
    }
    return this.validationReportCache;
  }

  validateDataset(): boolean {
    const report = this.getValidationReport();
    if (!report.isValid && process.env.NODE_ENV !== 'production') {
      console.warn(
        `[FootballDataRepository] Dataset validation warning: ${report.issues.length} issues found.`
      );
    }
    return report.isValid;
  }
}

export const FootballDataRepository = new FootballDataRepositoryImpl();
