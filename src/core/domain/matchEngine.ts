import { IRNG } from '../../utils/rng';
import { MatchAggregate, MatchImportance, MatchEvent, MatchFixture, MatchResult, PlayerMatchPerformance, MatchTeam } from './match';

export interface SimulateMatchParams {
  player: {
    id: string;
    name: string;
    position: string;
    overall: number;
    fitness: number;
    morale: number;
  };
  team: {
    id: string;
    name: string;
    level: number;
    logo?: string;
  };
  opponent: {
    id: string;
    name: string;
    level: number;
    logo?: string;
  };
  context: {
    competition: string;
    phase?: string;
    isNationalTeam: boolean;
    isHome: boolean;
    importance: MatchImportance;
  };
  participation: {
    started: boolean;
    minutesPlayed: number;
  };
  date?: {
    week: number;
    year: number;
  };
}

export interface MatchSimulationResult {
  aggregate: MatchAggregate;
  fitnessImpact: number;
}

// Poisson generator for goals
function poisson(lambda: number, rng: IRNG): number {
  let L = Math.exp(-lambda);
  let p = 1.0;
  let k = 0;
  do {
    k++;
    p *= rng.random();
  } while (p > L);
  return k - 1;
}

export function simulateMatch(params: SimulateMatchParams, rng: IRNG): MatchSimulationResult {
  const { player, team, opponent, context, participation } = params;
  
  // 1. Calculate Team Strengths & Goals
  const myTeamStrength = team.level;
  const oppTeamStrength = opponent.level;

  // Player's influence on the team (1/11th impact) + morale/fitness modifiers
  const playerFactor = ((player.overall - myTeamStrength) * 0.1) 
    + ((player.morale - 50) * 0.05) 
    + ((player.fitness - 80) * 0.05);
  
  const adjustedMyStrength = Math.max(1, myTeamStrength + playerFactor);

  const homeAdvantage = 1.2;
  const myExpected = (context.isHome ? homeAdvantage : 1.0) * Math.pow(adjustedMyStrength / oppTeamStrength, 1.3) * 1.2;
  const oppExpected = (context.isHome ? 1.0 : homeAdvantage) * Math.pow(oppTeamStrength / adjustedMyStrength, 1.3) * 1.2;

  const myGoals = poisson(myExpected, rng);
  const oppGoals = poisson(oppExpected, rng);

  const homeScore = context.isHome ? myGoals : oppGoals;
  const awayScore = context.isHome ? oppGoals : myGoals;

  // 2. Player Performance
  const positionGoalProb: Record<string, number> = {
    'ST': 0.35, 'LW': 0.20, 'RW': 0.20, 'CAM': 0.15, 'CM': 0.08, 'LM': 0.10, 'RM': 0.10, 'CDM': 0.03, 'LWB': 0.04, 'RWB': 0.04, 'LB': 0.02, 'RB': 0.02, 'CB': 0.03, 'GK': 0.001
  };
  const positionAssistProb: Record<string, number> = {
    'CAM': 0.25, 'LW': 0.20, 'RW': 0.20, 'LM': 0.15, 'RM': 0.15, 'CM': 0.15, 'ST': 0.10, 'LWB': 0.12, 'RWB': 0.12, 'LB': 0.08, 'RB': 0.08, 'CDM': 0.05, 'CB': 0.01, 'GK': 0.001
  };

  const minutesRatio = participation.minutesPlayed / 90;
  const goalProb = (positionGoalProb[player.position] || 0.05) * minutesRatio;
  const assistProb = (positionAssistProb[player.position] || 0.05) * minutesRatio;

  let playerGoals = 0;
  let playerAssists = 0;

  for (let i = 0; i < myGoals; i++) {
    const roll = rng.random();
    if (roll < goalProb) {
      playerGoals++;
    } else if (roll < goalProb + assistProb) {
      playerAssists++;
    }
  }

  // 3. Cards
  const cardMultiplier = (context.importance === 'DERBY' || context.importance === 'FINAL') ? 1.5 : 1.0;
  const positionCardProb: Record<string, number> = {
    'CB': 0.20, 'CDM': 0.20, 'LB': 0.15, 'RB': 0.15, 'CM': 0.15, 'CAM': 0.05, 'LW': 0.05, 'RW': 0.05, 'ST': 0.05, 'GK': 0.02
  };
  const baseYellowProb = (positionCardProb[player.position] || 0.10) * minutesRatio * cardMultiplier;

  let yellowCards = 0;
  let redCards = 0;

  if (rng.random() < baseYellowProb) {
    yellowCards = 1;
    if (rng.random() < 0.1) {
      redCards = 1;
    }
  } else if (rng.random() < 0.01 * cardMultiplier * minutesRatio) {
    redCards = 1;
  }

  // 4. Injuries
  let injuryProb = 0.015;
  if (player.fitness < 70) {
    injuryProb += (70 - player.fitness) * 0.001;
  }
  injuryProb *= minutesRatio;
  const injured = rng.random() < injuryProb;

  // 5. Rating
  let rating = 6.0;
  rating += (player.overall - oppTeamStrength) * 0.02;
  
  if (myGoals > oppGoals) rating += 0.5;
  else if (myGoals < oppGoals) rating -= 0.5;

  rating += playerGoals * 1.0;
  rating += playerAssists * 0.5;

  if (oppGoals === 0 && (['CB', 'LB', 'RB', 'CDM', 'GK'].includes(player.position))) {
    rating += 0.5;
  }

  rating -= yellowCards * 0.5;
  rating -= redCards * 1.5;

  rating += (rng.random() * 0.6) - 0.3; // noise
  rating = Math.max(3.0, Math.min(10.0, rating));
  rating = Math.round(rating * 10) / 10;

  // 6. MOTM
  let isMotm = false;
  if (rating >= 8.5 && myGoals >= oppGoals) {
    isMotm = rng.random() < 0.6;
  } else if (rating >= 7.5 && playerGoals > 0) {
    isMotm = rng.random() < 0.2;
  }

  // 7. Flavor stats
  const isAttacker = ['ST', 'LW', 'RW', 'CAM'].includes(player.position);
  const isMid = ['CM', 'CDM', 'LM', 'RM'].includes(player.position);
  const shots = isAttacker ? Math.floor(rng.random() * 4) + playerGoals : (rng.random() < 0.3 ? 1 : 0) + playerGoals;
  const passes = Math.floor(20 + rng.random() * 30 + (isMid ? 20 : 0)) * minutesRatio;
  const passAccuracy = 70 + Math.floor(rng.random() * 25);

  // 8. Fitness Impact
  let fitnessDrop = 15 + rng.random() * 5;
  if (context.importance === 'FINAL' || context.importance === 'DERBY') {
    fitnessDrop += 5;
  }
  fitnessDrop *= minutesRatio;

  // Assemble Objects
  const homeTeam: MatchTeam = {
    id: context.isHome ? team.id : opponent.id,
    name: context.isHome ? team.name : opponent.name,
    logo: context.isHome ? team.logo : opponent.logo,
  };

  const awayTeam: MatchTeam = {
    id: !context.isHome ? team.id : opponent.id,
    name: !context.isHome ? team.name : opponent.name,
    logo: !context.isHome ? team.logo : opponent.logo,
  };

  const fixture: MatchFixture = {
    id: `fixture_${Date.now()}_${Math.floor(rng.random() * 1000)}`,
    date: params.date || { week: 1, year: 2024 },
    homeTeam,
    awayTeam,
    context: {
      competition: context.competition,
      phase: context.phase,
      isNationalTeam: context.isNationalTeam,
      importance: context.importance,
    },
    status: 'FINISHED'
  };

  const result: MatchResult = { homeScore, awayScore };

  const playerPerformance: PlayerMatchPerformance = {
    started: participation.started,
    substitutedIn: !participation.started && participation.minutesPlayed > 0,
    substitutedOut: participation.minutesPlayed < 90 && participation.started,
    minutesPlayed: Math.round(participation.minutesPlayed),
    position: player.position,
    goals: playerGoals,
    assists: playerAssists,
    yellowCards,
    redCards,
    injured,
    rating,
    isCaptain: false, // Could add logic for this later
    isMotm,
    shots,
    passes,
    passAccuracy
  };

  // Events
  const events: MatchEvent[] = [];
  
  const addEvent = (type: MatchEvent['type'], qty: number) => {
    for (let i = 0; i < qty; i++) {
      events.push({
        id: `ev_${type}_${events.length}`,
        minute: Math.floor(rng.random() * participation.minutesPlayed) + 1,
        type,
        player: { id: player.id, name: player.name, isUser: true }
      });
    }
  };

  addEvent('GOAL', playerGoals);
  addEvent('ASSIST', playerAssists);
  addEvent('YELLOW_CARD', yellowCards);
  addEvent('RED_CARD', redCards);
  
  if (injured) {
    events.push({
      id: `ev_INJ_${events.length}`,
      minute: participation.minutesPlayed, // usually injured at the end of their stint
      type: 'INJURY',
      player: { id: player.id, name: player.name, isUser: true }
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  const aggregate: MatchAggregate = {
    fixture,
    result,
    playerPerformance,
    events
  };

  return { aggregate, fitnessImpact: fitnessDrop };
}
