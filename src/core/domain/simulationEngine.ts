import { GAME_EVENTS } from '../../data/events';
import { GameState } from '../../types';
import { advanceWeekLogic } from '../state/reducers/advanceWeek';
import { getMatchImportance } from './seasonEngine';

export type SimulationMode = 
  | 'NEXT_MATCH'
  | 'ONE_MONTH'
  | 'THREE_MONTHS'
  | 'SIX_MONTHS'
  | 'TRANSFER_WINDOW'
  | 'END_OF_SEASON';

export type SimulationStopReason =
  | 'REACHED_TARGET'
  | 'FINAL_MATCH'
  | 'HIGH_IMPORTANCE_MATCH'
  | 'TRANSFER_OFFER'
  | 'URGENT_EVENT'
  | 'SEVERE_INJURY'
  | 'NATIONAL_CALL_UP'
  | 'IMPORTANT_AWARD'
  | 'RELEVANT_RECORD'
  | 'END_OF_SEASON'
  | 'CANCELLED'
  | 'MAX_ITERATIONS_REACHED';

export interface SimulationRequest {
  mode: SimulationMode;
  cancelToken?: { cancelled: boolean };
  maxIterations?: number;
}

export interface SimulationSummary {
  weeksSimulated: number;
  matchesPlayed: number;
  goalsScored: number;
  assistsProvided: number;
  eventsTriggered: number;
  injuries: number;
}

export interface SimulationResult {
  finalState: GameState;
  stopReason: SimulationStopReason;
  summary: SimulationSummary;
}

export interface SimulationCheckpoint {
  currentState: GameState;
  progressPercentage: number;
  summarySoFar: SimulationSummary;
}

function calculateTarget(startWeek: number, startYear: number, mode: SimulationMode): { targetWeek: number, targetYear: number } {
  let targetWeek = startWeek;
  let targetYear = startYear;

  switch (mode) {
    case 'ONE_MONTH':
      targetWeek = startWeek + 4;
      break;
    case 'THREE_MONTHS':
      targetWeek = startWeek + 13;
      break;
    case 'SIX_MONTHS':
      targetWeek = startWeek + 26;
      break;
    case 'END_OF_SEASON':
      targetWeek = 52;
      break;
    case 'TRANSFER_WINDOW':
      if (startWeek < 4) targetWeek = 4;
      else if (startWeek < 26) targetWeek = 26;
      else if (startWeek < 52) { targetWeek = 4; targetYear = startYear + 1; }
      else targetWeek = 4; // fallback
      break;
    case 'NEXT_MATCH':
      targetWeek = 52; 
      targetYear = startYear + 100;
      break;
  }

  if (targetWeek > 52) {
      targetYear += Math.floor((targetWeek - 1) / 52);
      targetWeek = ((targetWeek - 1) % 52) + 1;
  }

  return { targetWeek, targetYear };
}

function isTargetReached(currentWeek: number, currentYear: number, targetWeek: number, targetYear: number): boolean {
  if (currentYear > targetYear) return true;
  if (currentYear === targetYear && currentWeek >= targetWeek) return true;
  return false;
}

export function* runSimulation(
  initialState: GameState, 
  request: SimulationRequest
): Generator<SimulationCheckpoint, SimulationResult, void> {
  let currentState = initialState;
  const maxIterations = request.maxIterations || 100;
  let iterations = 0;
  let stopReason: SimulationStopReason = 'MAX_ITERATIONS_REACHED';
  
  const summary: SimulationSummary = {
    weeksSimulated: 0,
    matchesPlayed: 0,
    goalsScored: 0,
    assistsProvided: 0,
    eventsTriggered: 0,
    injuries: 0
  };

  const { targetWeek, targetYear } = calculateTarget(currentState.career.week, currentState.career.year, request.mode);
  
  // Calculate total weeks for progress
  const totalWeeksTarget = ((targetYear - currentState.career.year) * 52) + (targetWeek - currentState.career.week);

  while (iterations < maxIterations) {
    if (request.cancelToken?.cancelled) {
      stopReason = 'CANCELLED';
      break;
    }

    // 1. Check Pre-conditions (Matches)
    if (currentState.career.nextMatch) {
      const importance = currentState.career.currentSeason && currentState.career.nextMatch.fixtureId 
            ? getMatchImportance(currentState.career.currentSeason, currentState.career.nextMatch.fixtureId) 
            : 'MEDIUM';
            
      if (importance === 'FINAL') {
        stopReason = 'FINAL_MATCH';
        break;
      }
      if (importance === 'HIGH') {
        stopReason = 'HIGH_IMPORTANCE_MATCH';
        break;
      }
      if (request.mode === 'NEXT_MATCH') {
        stopReason = 'REACHED_TARGET';
        break;
      }
    }

    // 2. Advance State
    let nextState = advanceWeekLogic(currentState);
    iterations++;
    summary.weeksSimulated++;

    // 3. Process outcomes
    if (nextState.phase === 'POST_MATCH') {
      const lastMatch = nextState.career.matches[0];
      if (lastMatch) {
        summary.matchesPlayed++;
        summary.goalsScored += lastMatch.goals;
        summary.assistsProvided += lastMatch.assists;
        if (lastMatch.injured) summary.injuries++;
      }
      // Auto-resolve to HUB for continuous simulation
      nextState = { ...nextState, phase: 'HUB' };
    }

    
    if (nextState.phase === 'TRANSFERS') {
      stopReason = 'TRANSFER_OFFER';
      currentState = nextState;
      break;
    }

    if (nextState.phase === 'EVENT') {

      summary.eventsTriggered++;
      const eventId = nextState.narrative.activeEvents[0];
      const activeEvent = GAME_EVENTS.find(e => e.id === eventId);
      if (activeEvent) {
        const id = activeEvent.id.toUpperCase();
        if (id.includes('TRANSFER')) stopReason = 'TRANSFER_OFFER';
        else if (id.includes('INJUR') || activeEvent.imageType === 'injury') stopReason = 'SEVERE_INJURY';
        else if (id.includes('CALL_UP') || id.includes('NATIONAL')) stopReason = 'NATIONAL_CALL_UP';
        else if (id.includes('AWARD')) stopReason = 'IMPORTANT_AWARD';
        else if (id.includes('RECORD')) stopReason = 'RELEVANT_RECORD';
        else stopReason = 'URGENT_EVENT';
      } else {
        stopReason = 'URGENT_EVENT';
      }
      currentState = nextState;
      break;
    }

    // 4. Check End of Season
    if (nextState.career.year > currentState.career.year || (currentState.career.week === 52 && nextState.career.week === 1)) {
      stopReason = 'END_OF_SEASON';
      currentState = nextState;
      break;
    }

    currentState = nextState;

    // 5. Check Target Reached
    if (isTargetReached(currentState.career.week, currentState.career.year, targetWeek, targetYear)) {
      stopReason = 'REACHED_TARGET';
      break;
    }

    // Yield checkpoint
    const progress = totalWeeksTarget > 0 ? Math.min(100, Math.round((summary.weeksSimulated / totalWeeksTarget) * 100)) : 100;
    yield {
      currentState,
      progressPercentage: progress,
      summarySoFar: { ...summary }
    };
  }

  return {
    finalState: currentState,
    stopReason,
    summary
  };
}
