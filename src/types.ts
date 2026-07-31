/**
 * GOAT Simulator - Core Types & Architecture
 * 
 * Arquitetura projetada para escalabilidade. O estado do jogo é dividido em:
 * 1. Player (Atributos técnicos e físicos, RPG stats)
 * 2. Career (Tempo, Clube atual, Histórico, Troféus)
 * 3. Narrative (Eventos pendentes, Relacionamentos, Fama)
 */

export type TechnicalStat = 'PAC' | 'SHO' | 'PAS' | 'DRI' | 'DEF' | 'PHY' | 'HEA' | 'VIS' | 'WF' | 'SM' | 'CON' | 'ACC' | 'STA' | 'JUM' | 'FK' | 'PEN' | 'CRE';
export type RPGStat = 'morale' | 'fitness' | 'fame' | 'fans' | 'LDR' | 'DET' | 'COM';
export type RelationshipTarget = 'fans' | 'manager' | 'press' | 'squad';

export type GamePhase = 
  | 'CREATION_BASIC_INFO'
  | 'CREATION_POSITION'
  | 'CREATION_APPEARANCE'
  | 'CREATION_DRAFT_LENGTH'
  | 'CREATION_ATTRIBUTES'
  | 'CREATION_PERSONALITY'
  | 'DRAFT_CLUB'
  | 'PRE_SEASON'
  | 'HUB'
  | 'MATCH'
  | 'POST_MATCH'
  | 'EVENT'
  | 'END_OF_SEASON'
  | 'RETIREMENT';

export type PersonalityTrait = 
  | 'HUMBLE' 
  | 'ARROGANT' 
  | 'LEADER' 
  | 'MERCENARY' 
  | 'HOMEBODY' 
  | 'PARTY_ANIMAL' 
  | 'PROFESSIONAL' 
  | 'TEMPERAMENTAL' 
  | 'CHARISMATIC' 
  | 'INTROVERTED';

export type Position = 'ST' | 'LW' | 'RW' | 'CAM' | 'CM' | 'CDM' | 'LB' | 'CB' | 'RB' | 'GK';

export interface PhysicalAppearance {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  facialHairColor: string;
  eyes: string;
  mouth: string;
  nose: string;
  accessories: string;
  tattoos: string;
  height: number;
  weight: number;
  physique: 'Magra' | 'Atlética' | 'Musculosa' | 'Pesada';
  boots: string;
  sleeves: 'Curtas' | 'Longas' | 'Térmica';
  gloves: boolean;
  celebration: string;
}

export interface PlayerAttributes {
  technical: Record<TechnicalStat, number>;
  rpg: Record<RPGStat, number>;
  relationships: Record<RelationshipTarget, number>;
  age: number;
  name: string;
  avatarUrl: string;
  appearance: PhysicalAppearance;
  position: Position | '';
  nationality: string;
  personality: PersonalityTrait | '';
}

export interface Club {
  id: string;
  name: string;
  tier: number; // 1 (World Class) to 5 (Amateur)
  reputation: number; // 0-100
  baseSalary: number;
  league: string;
  primaryColor: string;
  logo?: string;
}

export interface MatchStats {
  id: string;
  week: number;
  year: number;
  competition: string;
  opponent: string;
  opponentLogo?: string;
  home: boolean;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  passes: number;
  passAccuracy: number;
  rating: number; // 0.0 to 10.0
  motm: boolean;
  injured: boolean;
  wasCaptain: boolean;
}

export interface SeasonRecord {
  year: number;
  clubId: string;
  clubName: string;
  shirtNumber: number;
  salary: number;
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  passes: number;
  passAccuracySum: number; // to calculate average
  avgRating: number;
  injuries: number;
  motm: number;
  captaincies: number;
  competitions: string[];
  trophies: string[];
  awards: string[]; // e.g. Ballon d'Or, Golden Boot
}

export interface TransferRecord {
  year: number;
  week: number;
  fromClub: string;
  toClub: string;
  fee: number;
  salary: number;
}

export interface Financials {
  balance: number;
  weeklyWage: number;
  sponsors: string[];
  assets: string[]; // Cars, Mansions (can unlock events)
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: number; // week number
  type: 'match' | 'transfer' | 'gossip' | 'interview';
}

export interface GameState {
  phase: GamePhase;
  draftLength?: 'SHORT' | 'LONG';
  player: PlayerAttributes;
  career: {
    currentClub: Club | null;
    nationalTeam: string | null;
    shirtNumber: number;
    isCaptain: boolean;
    week: number; // 1 to 52
    season: number; // 1 (Starts at age 17 typically)
    year: number;
    history: SeasonRecord[];
    currentSeasonStats: SeasonRecord;
    transfers: TransferRecord[];
    matches: MatchStats[];
    nextMatch: { opponent: string; opponentLogo?: string; isHome: boolean; competition: string } | null;
    awards: {
      ballonDor: number;
      goldenBoot: number;
      toty: number;
      motm: number;
    };
  };
  finances: Financials;
  narrative: {
    activeEvents: GameEvent[];
    flags: Record<string, boolean | number | string>; // For long-term narrative memory (e.g., 'betrayed_real_madrid': true)
    news: NewsItem[];
  };
}

/**
 * Event System Architecture
 * 
 * Eventos são modulares. Eles verificam se podem acontecer (condition)
 * e aplicam efeitos complexos (Effect) na árvore de estado.
 */
export interface EventEffect {
  moraleModifier?: number;
  fitnessModifier?: number;
  fameModifier?: number;
  financeModifier?: number;
  technicalModifiers?: Partial<Record<TechnicalStat, number>>;
  relationshipModifiers?: Partial<Record<RelationshipTarget, number>>;
  customFlag?: { key: string; value: boolean | number | string | ((state: GameState) => boolean | number | string) };
  triggerNextEvent?: string; // ID of an event to queue
  newsFeedText?: string;
}

export interface EventOption {
  id: string;
  label: string;
  description?: string;
  effect: EventEffect;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  imageType?: 'press' | 'training' | 'party' | 'match' | 'injury';
  condition: (state: GameState) => boolean;
  options: EventOption[];
  weight: number; // Probabilidade de acontecer dentro de sua raridade
  rarity?: 'small' | 'medium' | 'large' | 'historic';
  isUrgent: boolean; // Se true, interrompe a simulação (ex: Lesão grave)
}
