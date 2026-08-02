const fs = require('fs');

// 1. types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace('import { ProgressionState } from "./core/domain/progressionEngine";\n', '');
types = types.replace('import { Season } from \'./core/domain/seasonEngine\';\n', '');

const toAppend = `
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
`;
fs.writeFileSync('src/types.ts', types + toAppend);

// 2. seasonEngine.ts
let season = fs.readFileSync('src/core/domain/seasonEngine.ts', 'utf8');
season = season.replace(/export interface SeasonCompetition \{[\s\S]*?\}\n/, '');
season = season.replace(/export interface Season \{[\s\S]*?\}\n/, '');
season = season.replace(/export interface SeasonSummary \{[\s\S]*?\}\n/, '');
season = `import { Season, SeasonCompetition, SeasonSummary } from '../../types';\n` + season;
fs.writeFileSync('src/core/domain/seasonEngine.ts', season);

// 3. progressionEngine.ts
let progression = fs.readFileSync('src/core/domain/progressionEngine.ts', 'utf8');
progression = progression.replace(/export interface ProgressionState \{[\s\S]*?\}\n/, '');
progression = progression.replace(/import \{ TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType \} from '\.\.\/\.\.\/types';/, `import { TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType, ProgressionState } from '../../types';`);
fs.writeFileSync('src/core/domain/progressionEngine.ts', progression);

console.log('Done');
