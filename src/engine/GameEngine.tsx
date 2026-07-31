import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameEvent, EventOption, MatchStats, Club, NewsItem } from '../types';
import { GAME_EVENTS } from '../data/events';
import { OPPONENTS, COMPETITIONS, ALL_CLUBS } from '../data/database';

// Initial State Stub (Will be hydrated on character creation)
const INITIAL_STATE: GameState = {
  phase: 'CREATION_BASIC_INFO',
  player: {
    name: '',
    avatarUrl: '',
    age: 17,
    position: '',
    nationality: 'BR',
    personality: '',
    appearance: {
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
    },
    technical: { 
      PAC: 50, SHO: 50, PAS: 50, DRI: 50, DEF: 30, PHY: 50, 
      HEA: 50, VIS: 50, WF: 3, SM: 3, CON: 50, ACC: 50, 
      STA: 50, JUM: 50, FK: 50, PEN: 50, CRE: 50 
    },
    rpg: { morale: 100, fitness: 100, fame: 0, fans: 0, LDR: 50, DET: 50, COM: 50 },
    relationships: { fans: 50, manager: 50, press: 50, squad: 50 },
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
    currentSeasonStats: {
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
    }
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
    news: []
  }
};

export type GameAction = 
  | { type: 'CHANGE_PHASE'; payload: GameState['phase'] }
  | { type: 'SETUP_CAREER'; payload: { club: Club } }
  | { type: 'ADVANCE_WEEK' }
  | { type: 'SET_DRAFT_LENGTH'; payload: 'SHORT' | 'LONG' }
  | { type: 'ADVANCE_MONTH' }
  | { type: 'PLAY_MATCH'; payload: MatchStats }
  | { type: 'RESOLVE_EVENT'; payload: { eventId: string; optionId: string } }
  | { type: 'INITIALIZE_PLAYER'; payload: Partial<GameState['player']> }
  | { type: 'TRAIN_ATTRIBUTE'; payload: 'SHO' | 'PAS' | 'DRI' | 'DEF' }
  | { type: 'ADD_NEWS'; payload: Omit<NewsItem, 'id'> };


function generateNextMatch(currentClub: Club | null) {
  if (!currentClub) return null;
  
  // Find clubs in the same league
  const possibleOpponents = ALL_CLUBS.filter(c => c.league === currentClub.league && c.id !== currentClub.id);
  
  let opponentName = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
  let logo = undefined;
  
  if (possibleOpponents.length > 0) {
    const opp = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
    opponentName = opp.name;
    logo = opp.logo;
  }
  
  let competition = currentClub.league;
  
  if (competition === 'Série A (Brasil)') competition = 'Brasileirão Série A';
  if (competition === 'Série B (Brasil)') competition = 'Brasileirão Série B';
  if (competition === 'Premier League (Inglaterra)') competition = 'Premier League';
  if (competition === 'Championship (Inglaterra)') competition = 'Championship';
  if (competition === 'League One (Inglaterra)') competition = 'League One';
  if (competition === 'League Two (Inglaterra)') competition = 'League Two';
  if (competition === 'National League (Inglaterra)') competition = 'National League';
  
  // 20% chance for a Cup match
  if (Math.random() > 0.8) {
    if (currentClub.league.includes('Brasil')) {
      competition = Math.random() > 0.5 ? 'Copa do Brasil' : 'Copa Libertadores';
    } else if (currentClub.league.includes('Inglaterra')) {
      competition = Math.random() > 0.5 ? 'FA Cup' : 'Carabao Cup';
    }
  }

  return {
    opponent: opponentName,
    opponentLogo: logo,
    isHome: Math.random() > 0.5,
    competition: competition
  };
}

function advanceWeekLogic(state: GameState): GameState {
   const nextWeek = state.career.week + 1;
   let nextYear = state.career.year;
   let nextSeason = state.career.season;
   
   let nextHistory = state.career.history;
   let nextSeasonStats = state.career.currentSeasonStats;
   
   let nextPlayerAge = state.player.age;
   
   if (nextWeek > 52) {
      nextHistory = [...nextHistory, nextSeasonStats];
      nextSeasonStats = {
         year: state.career.year + 1,
         clubId: state.career.currentClub?.id || '',
         clubName: state.career.currentClub?.name || '',
         shirtNumber: state.career.shirtNumber,
         salary: state.finances.weeklyWage,
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
      nextYear++;
      nextSeason++;
      nextPlayerAge++;
   }

   const nextFitness = Math.min(100, state.player.rpg.fitness + 15);
   const newBalance = state.finances.balance + state.finances.weeklyWage;
   
   // Simulate the scheduled match if it exists
   let hasMatch = state.career.nextMatch !== null;
   let currentMatchInfo = state.career.nextMatch;
   
   let matchLog: MatchStats | null = null;
   let newPlayer = { ...state.player, age: nextPlayerAge, rpg: { ...state.player.rpg, fitness: nextFitness } };

   if (hasMatch && currentMatchInfo && newPlayer.rpg.fitness > 30) {
      const playedMin = Math.floor(Math.random() * 90) + 1;
      const goals = Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0;
      const assists = Math.random() > 0.8 ? Math.floor(Math.random() * 2) : 0;
      const shots = goals + Math.floor(Math.random() * 5);
      const passes = Math.floor(Math.random() * 40) + 10;
      const passAcc = Math.floor(Math.random() * 30) + 70;
      const rating = 6.0 + (goals * 1.5) + (assists * 1.0) + (Math.random() * 1.5) - (Math.random() * 1.0);
      const finalRating = Math.min(10.0, Math.max(0.0, rating));
      const motm = finalRating > 8.5 && Math.random() > 0.5;
      const injured = Math.random() > 0.95; // 5% chance of injury
      
      matchLog = {
         id: `match_${nextYear}_${state.career.week}`, // log for the current week
         week: state.career.week,
         year: state.career.year,
         competition: currentMatchInfo.competition,
         opponent: currentMatchInfo.opponent,
         opponentLogo: currentMatchInfo.opponentLogo,
         home: currentMatchInfo.isHome,
         minutesPlayed: playedMin,
         goals,
         assists,
         shots,
         passes,
         passAccuracy: passAcc,
         rating: finalRating,
         motm,
         injured,
         wasCaptain: state.career.isCaptain
      };

      // Attribute Evolution based on match performance
      const ageMultiplier = state.player.age < 23 ? 1.5 : (state.player.age > 30 ? 0.5 : 1.0);
      
      // Base growth for playing
      newPlayer.technical.PHY = Math.min(99, newPlayer.technical.PHY + (0.01 * ageMultiplier));
      newPlayer.technical.PAC = Math.min(99, newPlayer.technical.PAC + (0.01 * ageMultiplier));
      
      // Performance based growth
      if (goals > 0) {
         newPlayer.technical.SHO = Math.min(99, newPlayer.technical.SHO + (0.05 * goals * ageMultiplier));
         newPlayer.technical.HEA = Math.min(99, newPlayer.technical.HEA + (0.02 * goals * ageMultiplier));
      }
      
      if (assists > 0) {
         newPlayer.technical.PAS = Math.min(99, newPlayer.technical.PAS + (0.05 * assists * ageMultiplier));
         newPlayer.technical.VIS = Math.min(99, newPlayer.technical.VIS + (0.03 * assists * ageMultiplier));
      }
      
      if (passes > 25 && passAcc > 80) {
         newPlayer.technical.PAS = Math.min(99, newPlayer.technical.PAS + (0.02 * ageMultiplier));
         newPlayer.technical.DRI = Math.min(99, newPlayer.technical.DRI + (0.01 * ageMultiplier));
      }

      if (motm) {
         newPlayer.technical.DRI = Math.min(99, newPlayer.technical.DRI + (0.03 * ageMultiplier));
         newPlayer.technical.DEF = Math.min(99, newPlayer.technical.DEF + (0.02 * ageMultiplier));
      }

      // Age decay for older players (e.g. over 32, physical stats start dropping slowly)
      if (state.player.age >= 32) {
         newPlayer.technical.PAC = Math.max(1, newPlayer.technical.PAC - 0.05);
         newPlayer.technical.PHY = Math.max(1, newPlayer.technical.PHY - 0.03);
      }

      newPlayer.rpg.fitness -= Math.floor(Math.random() * 30) + 20;
      if (injured) {
         newPlayer.rpg.fitness = 10;
         newPlayer.rpg.morale -= 20;
      }
      
      if (goals > 0) newPlayer.rpg.fame += goals;
      if (motm) newPlayer.rpg.morale += 10;
      
      // Update season stats
      nextSeasonStats.matchesPlayed++;
      nextSeasonStats.minutesPlayed += playedMin;
      nextSeasonStats.goals += goals;
      nextSeasonStats.assists += assists;
      nextSeasonStats.shots += shots;
      nextSeasonStats.passes += passes;
      nextSeasonStats.passAccuracySum += passAcc;
      nextSeasonStats.avgRating = ((nextSeasonStats.avgRating * (nextSeasonStats.matchesPlayed - 1)) + finalRating) / nextSeasonStats.matchesPlayed;
      if (injured) nextSeasonStats.injuries++;
      if (motm) nextSeasonStats.motm++;
      if (state.career.isCaptain) nextSeasonStats.captaincies++;
   }
   
   const newMatches = matchLog ? [matchLog, ...state.career.matches] : state.career.matches;
   
   // Generate next match for the upcoming week
   let nextMatchInfo = null;
   if (state.career.currentClub !== null && Math.random() > 0.3) {
      nextMatchInfo = generateNextMatch(state.career.currentClub);
   }
   
   // Check for random events intelligently
   let triggeredEvent: GameEvent | null = null;
   
   const rand = Math.random();
   let targetRarity: 'small' | 'medium' | 'large' | 'historic' | null = null;
   
   if (rand < 0.0005) {
      targetRarity = 'historic';
   } else if (rand < 0.0030) {
      targetRarity = 'large';
   } else if (rand < 0.0155) {
      targetRarity = 'medium';
   } else if (rand < 0.0555) {
      targetRarity = 'small';
   }
   
   if (targetRarity) {
      const possibleEvents = GAME_EVENTS.filter(e => 
         e.rarity === targetRarity && 
         e.condition(state) && 
         !state.narrative.activeEvents.find(ae => ae.id === e.id)
      );
      
      if (possibleEvents.length > 0) {
        const totalWeight = possibleEvents.reduce((sum, e) => sum + e.weight, 0);
        let roll = Math.random() * totalWeight;
        
        for (const e of possibleEvents) {
          if (roll < e.weight) {
            triggeredEvent = e;
            break;
          }
          roll -= e.weight;
        }
      }
   }

   const nextState: GameState = {
      ...state,
      player: newPlayer,
      career: { 
         ...state.career, 
         week: nextWeek > 52 ? 1 : nextWeek,
         year: nextYear,
         season: nextSeason,
         history: nextHistory,
         currentSeasonStats: nextSeasonStats,
         matches: newMatches,
         nextMatch: nextMatchInfo
      },
      finances: { ...state.finances, balance: newBalance }
   };

   if (triggeredEvent) {
     return {
       ...nextState,
       phase: 'EVENT',
       narrative: {
         ...state.narrative,
         activeEvents: [triggeredEvent]
       }
     };
   }
   
   if (matchLog) {
      return {
         ...nextState,
         phase: 'POST_MATCH'
      };
   }

   return nextState;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CHANGE_PHASE':
      return { ...state, phase: action.payload };

    case 'SET_DRAFT_LENGTH':
      return { ...state, draftLength: action.payload };


    case 'INITIALIZE_PLAYER':
      return { ...state, player: { ...state.player, ...action.payload } };
    case 'SETUP_CAREER':
      return { 
        ...state, 
        phase: 'HUB',
        career: { ...state.career, currentClub: action.payload.club, nextMatch: generateNextMatch(action.payload.club) },
        finances: { ...state.finances, weeklyWage: action.payload.club.baseSalary }
      };
    
    case 'ADVANCE_WEEK': {
      return advanceWeekLogic(state);
    }

    case 'ADVANCE_MONTH': {
       let currentState = state;
       // Simulate 4 weeks
       for (let i = 0; i < 4; i++) {
          currentState = advanceWeekLogic(currentState);
          // If an event triggered, stop the simulation and let the user handle it
          if (currentState.phase === 'EVENT' || currentState.phase === 'POST_MATCH') {
             break;
          }
       }
       return currentState;
    }

    case 'TRAIN_ATTRIBUTE': {
       if (state.player.rpg.fitness < 20) return state; // Not enough fitness
       
       const newTech = { ...state.player.technical };
       
       const ageMultiplier = state.player.age < 23 ? 1.5 : (state.player.age > 30 ? 0.5 : 1.0);
       const growth = 0.5 * ageMultiplier;
       const secondaryGrowth = 0.2 * ageMultiplier;
       
       switch(action.payload) {
          case 'SHO':
             newTech.SHO = Math.min(99, newTech.SHO + growth);
             newTech.HEA = Math.min(99, newTech.HEA + secondaryGrowth);
             break;
          case 'PAS':
             newTech.PAS = Math.min(99, newTech.PAS + growth);
             newTech.VIS = Math.min(99, newTech.VIS + secondaryGrowth);
             break;
          case 'DRI':
             newTech.DRI = Math.min(99, newTech.DRI + growth);
             newTech.PAC = Math.min(99, newTech.PAC + secondaryGrowth);
             break;
          case 'DEF':
             newTech.DEF = Math.min(99, newTech.DEF + growth);
             newTech.PHY = Math.min(99, newTech.PHY + secondaryGrowth);
             break;
       }
       
       return {
          ...state,
          player: {
             ...state.player,
             technical: newTech,
             rpg: {
                ...state.player.rpg,
                fitness: state.player.rpg.fitness - 20
             }
          }
       };
    }

    case 'RESOLVE_EVENT': {
      const event = state.narrative.activeEvents.find(e => e.id === action.payload.eventId);
      if (!event) return state;

      const option = event.options.find(o => o.id === action.payload.optionId);
      if (!option) return state;

      const effect = option.effect;
      
      let newPlayer = { ...state.player };
      let newFinances = { ...state.finances };
      let newFlags = { ...state.narrative.flags };

      if (effect.moraleModifier) newPlayer.rpg.morale = Math.max(0, Math.min(100, newPlayer.rpg.morale + effect.moraleModifier));
      if (effect.fitnessModifier) newPlayer.rpg.fitness = Math.max(0, Math.min(100, newPlayer.rpg.fitness + effect.fitnessModifier));
      if (effect.fameModifier) newPlayer.rpg.fame = Math.max(0, Math.min(100, newPlayer.rpg.fame + effect.fameModifier));
      
      if (effect.financeModifier) newFinances.balance += effect.financeModifier;
      
      if (effect.relationshipModifiers) {
        newPlayer.relationships = { ...newPlayer.relationships };
        for (const [key, val] of Object.entries(effect.relationshipModifiers)) {
           newPlayer.relationships[key as keyof typeof newPlayer.relationships] = Math.max(0, Math.min(100, newPlayer.relationships[key as keyof typeof newPlayer.relationships] + (val as number)));
        }
      }

      if (effect.technicalModifiers) {
        newPlayer.technical = { ...newPlayer.technical };
        for (const [key, val] of Object.entries(effect.technicalModifiers)) {
           newPlayer.technical[key as keyof typeof newPlayer.technical] = Math.max(1, Math.min(99, newPlayer.technical[key as keyof typeof newPlayer.technical] + (val as number)));
        }
      }

      if (effect.customFlag) {
        newFlags[effect.customFlag.key] = typeof effect.customFlag.value === 'function' ? effect.customFlag.value(state) : effect.customFlag.value;
      }

      // Check if another event is triggered by this one
      let nextPhase = state.phase;
      let nextEvents: GameEvent[] = [];
      if (effect.triggerNextEvent) {
        const next = GAME_EVENTS.find(e => e.id === effect.triggerNextEvent);
        if (next) nextEvents = [next];
      } else {
        nextPhase = 'HUB';
      }

      return {
        ...state,
        phase: nextPhase,
        player: newPlayer,
        finances: newFinances,
        narrative: {
          ...state.narrative,
          activeEvents: nextEvents,
          flags: newFlags
        }
      };
    }

    case 'PLAY_MATCH':
      return state;

    case 'ADD_NEWS':
      return {
        ...state,
        narrative: {
          ...state.narrative,
          news: [{ id: Date.now().toString(), ...action.payload }, ...state.narrative.news]
        }
      };

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({ state: INITIAL_STATE, dispatch: () => null });

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameEngine() {
  return useContext(GameContext);
}
