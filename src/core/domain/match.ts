export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'POSTPONED';

export type MatchImportance = 'LOW' | 'MEDIUM' | 'HIGH' | 'DERBY' | 'FINAL';

export interface MatchTeam {
  id: string;
  name: string;
  logo?: string;
  score?: number;
  penaltiesScore?: number;
}

export interface MatchContext {
  competition: string;
  phase?: string; // e.g., 'Group Stage', 'Semi-Final', 'Final'
  isNationalTeam: boolean;
  importance: MatchImportance;
}

export interface MatchFixture {
  id: string;
  date: {
    week: number;
    year: number;
  };
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  context: MatchContext;
  status: MatchStatus;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  wentToExtraTime?: boolean;
  wentToPenalties?: boolean;
  homePenaltiesScore?: number;
  awayPenaltiesScore?: number;
}

export type MatchEventType = 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'SUB_IN' | 'SUB_OUT' | 'INJURY';

export interface MatchEvent {
  id: string;
  minute: number;
  type: MatchEventType;
  player: {
    id: string;
    name: string;
    isUser: boolean;
  };
  details?: string;
}

export interface PlayerMatchPerformance {
  started: boolean;
  substitutedIn: boolean;
  substitutedOut: boolean;
  minutesPlayed: number;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  injured: boolean;
  rating: number;
  isCaptain: boolean;
  isMotm: boolean;
  shots: number;
  passes: number;
  passAccuracy: number;
}

export interface MatchAggregate {
  fixture: MatchFixture;
  result?: MatchResult;
  playerPerformance?: PlayerMatchPerformance;
  events?: MatchEvent[];
}
