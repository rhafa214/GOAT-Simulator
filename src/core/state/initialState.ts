import { GameState, PhysicalAppearance, PlayerAttributes } from '../../types';

export const DEFAULT_APPEARANCE: PhysicalAppearance = {
  skinColor: 'f8d2b9',
  hairStyle: 'short',
  hairColor: '000000',
  facialHair: 'none',
  facialHairColor: '000000',
  eyes: 'normal',
  mouth: 'smile',
  nose: 'Pequeno',
  accessories: 'none',
  tattoos: 'none',
  height: 180,
  weight: 75,
  physique: 'Atlética',
  boots: 'Pretas Clássicas',
  sleeves: 'Curtas',
  gloves: false,
  celebration: 'Salto e Soco no Ar'
};

export const DEFAULT_TECHNICAL_ATTRIBUTES = {
  PAC: 50, SHO: 50, PAS: 50, DRI: 50, DEF: 30, PHY: 50,
  HEA: 50, VIS: 50, WF: 3, SM: 3, CON: 50, ACC: 50,
  STA: 50, JUM: 50, FK: 50, PEN: 50, CRE: 50
};

export const DEFAULT_RPG_STATS = {
  morale: 100, fitness: 100, fame: 0, fans: 0, LDR: 50, DET: 50, COM: 50
};

export const DEFAULT_RELATIONSHIPS = {
  fans: 50, manager: 50, press: 50, squad: 50
};

export const DEFAULT_SEASON_STATS = {
  year: 2024,
  clubId: '',
  clubName: '',
  shirtNumber: 99,
  salary: 0,
  matchesPlayed: 0,
  minutesPlayed: 0,
  goals: 0,
  assists: 0,
  shots: 0,
  passes: 0,
  passAccuracySum: 0,
  avgRating: 0,
  injuries: 0,
  motm: 0,
  captaincies: 0,
  competitions: [],
  trophies: [],
  awards: []
};

export function createInitialGameState(options?: Partial<GameState>): GameState {
  const baseState: GameState = {
    phase: 'CREATION_BASIC_INFO',
    player: {
      name: '',
      avatarUrl: '',
      age: 17,
      position: '',
      nationality: 'BR',
      personality: '',
      appearance: { ...DEFAULT_APPEARANCE },
      technical: { ...DEFAULT_TECHNICAL_ATTRIBUTES },
      rpg: { ...DEFAULT_RPG_STATS },
      relationships: { ...DEFAULT_RELATIONSHIPS },
    },
    career: {
      currentClub: null,
      nationalTeam: null,
      shirtNumber: 99,
      isCaptain: false,
      week: 1,
      season: 1,
      year: 2024,
      history: [],
      transfers: [],
      matches: [],
      nextMatch: { opponent: 'Rival FC', isHome: true, competition: 'Liga Nacional' },
      awards: {
        ballonDor: 0,
        goldenBoot: 0,
        toty: 0,
        motm: 0,
      },
      currentSeasonStats: { ...DEFAULT_SEASON_STATS }
    },
    finances: {
      balance: 0,
      weeklyWage: 0,
      sponsors: [],
      assets: []
    },
    narrative: {
      activeEvents: [],
      flags: {},
      news: [], eventHistory: {}
    }
  };

  if (options) {
    return { ...baseState, ...options };
  }

  return baseState;
}
