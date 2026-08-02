
export type TrainingSessionType = 
  | 'FINISHING' 
  | 'CREATION' 
  | 'DRIBBLING' 
  | 'PHYSICAL' 
  | 'DEFENDING' 
  | 'SET_PIECES' 
  | 'RECOVERY' 
  | 'CHEMISTRY' 
  | 'POSITIONAL' 
  | 'REST' 
  | 'GENERAL';

export interface TrainingPlan {
  focus: TrainingSessionType;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
}
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

export type GamePhase = 'MAIN_MENU'
  | 'TRANSFERS'
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


export interface PlayerDNA {
  id: string;
  type: 'TRAIT' | 'TENDENCY' | 'MODIFIER' | 'SYNERGY' | 'CONFLICT';
  name: string;
  description: string;
  rarity: 'COMMON' | 'EPIC' | 'LEGENDARY';
  originId: string;
}


export interface PlayerAttributes {
  progression?: ProgressionState;
  trainingPlan?: TrainingPlan;
  dna?: PlayerDNA[];
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
  logo?: string | null;
  leagueId?: string | null;
  leagueName?: string | null;
  division?: number | string | null;
  season?: string | null;
  validationStatus?: 'VALIDATED' | 'UNCLASSIFIED' | 'FLAGGED';
  dataSource?: string | null;
}

export interface MatchEventSummary {
  id: string;
  minute: number;
  type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'INJURY' | 'SUB_IN' | 'SUB_OUT';
  player: string;
  isUser?: boolean;
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
  homeScore?: number;
  awayScore?: number;
  yellowCards?: number;
  redCards?: number;
  events?: MatchEventSummary[];
  importance?: 'LOW' | 'MEDIUM' | 'HIGH' | 'DERBY' | 'FINAL';
  isHistoric?: boolean;
  isSavedInMuseum?: boolean;
  milestone?: string;
  trophyWon?: string;
  headline?: string;
  decisiveMoment?: string;
  historicNarrative?: string;
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

export type NewsCategory = 'partida' | 'transferência' | 'lesão' | 'prêmio' | 'recorde' | 'convocação' | 'título' | 'entrevista' | 'rumor';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  date: string;
  week: number;
  year: number;
  category: NewsCategory;
  relatedEntities: string[];
  importance: number;
  source: string;
  read?: boolean;
}



export interface PlayerContract {
  salary: number;
  duration: number;
  bonuses: number;
  marketValue: number;
  expirationYear: number;
}

export interface Agent {
  name: string;
  level: number; // 1-100 or 1-5
  negotiationSkill: number; // 1-100
}

export type ProposalStatus = 'generated' | 'presented' | 'negotiating' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export interface TransferProposal {
  id: string;
  clubId: string;
  clubName: string;
  offerSalary: number;
  offerDuration: number;
  expectedRole: string;
  negotiationRounds: number;
  transferFee: number;
  status: ProposalStatus;
  weekGenerated: number;
  yearGenerated: number;
}

export interface TransferState {
  isTransferRequested: boolean;
  isListed: boolean;
  activeProposals: TransferProposal[];
}


export type DraftMode = 'QUICK' | 'COMPLETE';

export interface DraftOption {
  idolId: string;
  name: string;
  nationality: string;
  positionOrEra: string;
  photoUrl?: string;
  attributeValue: number;
  dna?: PlayerDNA;
}

export interface DraftRound {
  attributeId: TechnicalStat;
  options: DraftOption[];
  selectedOptionId?: string; // Idol id
}

export interface DraftState {
  mode: DraftMode;
  seed: number;
  currentRoundIndex: number;
  rounds: DraftRound[];
  acquiredDNA: PlayerDNA[];
  usedIdols: string[]; // Track to avoid duplication
}

export interface GameState {
  draftState?: DraftState;
  saveSlot?: string;
  phase: GamePhase;
  draftLength?: 'QUICK' | 'COMPLETE';
  player: PlayerAttributes;
  career: {
    currentClub: Club | null;
    contract?: PlayerContract;
    agent?: Agent;
    transferState?: TransferState;
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
    nextMatch: { opponent: string; opponentLogo?: string; isHome: boolean; competition: string; fixtureId?: string } | null;
    currentSeason?: Season;
    awards: {
      ballonDor: number;
      goldenBoot: number;
      toty: number;
      motm: number;
    };
  };
  finances: Financials;
  narrative: {
    activeEvents: string[];
    flags: Record<string, boolean | number | string>;
    news: NewsItem[];
    eventHistory: Record<string, number>;
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
  category?: string;
  imageType?: 'press' | 'training' | 'party' | 'match' | 'injury';
  condition: (state: GameState) => boolean;
  options: EventOption[];
  weight: number; // Base probability weight
  rarity?: 'small' | 'medium' | 'large' | 'historic';
  isUrgent: boolean;
  cooldown?: number; // In weeks
  expiresIn?: number; // In weeks
  tags?: string[];
  priority?: number;
  interruptSimulation?: boolean;
}

export type GameAction = 
  | { type: 'INIT_DRAFT'; payload: { mode: DraftMode; seed?: number } }
  | { type: 'SELECT_DRAFT_OPTION'; payload: string }
  | { type: 'COMPLETE_DRAFT' }
  | { type: 'SET_STATE'; payload: GameState } 
  | { type: 'CHANGE_PHASE'; payload: GameState['phase'] }
  | { type: 'SETUP_CAREER'; payload: { club: Club } }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'SET_DRAFT_LENGTH'; payload: 'QUICK' | 'COMPLETE' }
  | { type: 'ADVANCE_MONTH' }
  | { type: 'PLAY_MATCH'; payload: MatchStats }
  | { type: 'RESOLVE_EVENT'; payload: { eventId: string; optionId: string } }
  | { type: 'INITIALIZE_PLAYER'; payload: Partial<GameState['player']> }
  | { type: 'TRAIN_ATTRIBUTE'; payload: 'SHO' | 'PAS' | 'DRI' | 'DEF' }
  | { type: 'SET_TRAINING_PLAN'; payload: TrainingPlan }
  | { type: 'ADD_NEWS'; payload: Omit<NewsItem, 'id'> }
  | { type: 'SAVE_HISTORIC_MATCH'; payload: { matchId: string } };

import { Competition, CompetitionFixture, TeamStanding } from './core/domain/competition';

export interface ProgressionState {
  developmentPoints: Partial<Record<TechnicalStat, number>>;
  temporaryForm: number; // -10 to 10
  potential: number; // 1-99
  consistency: number; // 1-20
  growthCurve: 'EARLY_PEAK' | 'NORMAL' | 'LATE_BLOOMER';
  peakAge: number;
  declineAge: number;
  milestones: string[];
}

export interface SeasonCompetition {
  competition: Competition;
  teams: string[]; // Club IDs
  fixtures: CompetitionFixture[];
  standings: TeamStanding[];
  isFinished: boolean;
  championId?: string;
}

export interface Season {
  id: string;
  year: number;
  competitions: SeasonCompetition[];
  currentWeek: number;
  isFinished: boolean;
}

export interface SeasonSummary {
  year: number;
  competitionResults: {
    competitionId: string;
    competitionName: string;
    championId: string;
    standings: TeamStanding[];
  }[];
}
