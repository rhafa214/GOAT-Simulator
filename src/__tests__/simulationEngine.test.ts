import { describe, it, expect, vi } from 'vitest';
import { runSimulation, SimulationRequest, SimulationResult } from '../core/domain/simulationEngine';
import { GameState } from '../types';
import { createInitialGameState } from '../core/state/initialState';

// We can mock advanceWeekLogic and getMatchImportance to control the simulation easily
vi.mock('../core/state/reducers/advanceWeek', () => ({
  advanceWeekLogic: vi.fn((state: GameState) => {
    // Default mock behavior: just increment week
    const nextWeek = state.career.week + 1;
    const nextYear = nextWeek > 52 ? state.career.year + 1 : state.career.year;
    return {
      ...state,
      career: {
        ...state.career,
        week: nextWeek > 52 ? 1 : nextWeek,
        year: nextYear,
        nextMatch: null // by default no match
      },
      phase: 'HUB'
    };
  })
}));

vi.mock('../core/domain/seasonEngine', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    getMatchImportance: vi.fn(() => 'MEDIUM')
  };
});

import { advanceWeekLogic } from '../core/state/reducers/advanceWeek';
import { getMatchImportance } from '../core/domain/seasonEngine';

describe('simulationEngine', () => {
  const getBaseState = (): GameState => {
    const state = createInitialGameState();
    state.career.week = 1;
    state.career.year = 2024;
    state.career.currentClub = { id: 'c1', name: 'C1', tier: 1, reputation: 50, baseSalary: 1000, league: 'L1', primaryColor: 'red' };
    return state;
  };

  const runToCompletion = (generator: Generator<any, SimulationResult, void>): SimulationResult => {
    let step = generator.next();
    while (!step.done) {
      step = generator.next();
    }
    return step.value;
  };

  it('runs until reaching the target month', () => {
    const initialState = getBaseState();
    const request: SimulationRequest = { mode: 'ONE_MONTH' }; // +4 weeks
    
    const generator = runSimulation(initialState, request);
    const result = runToCompletion(generator);
    
    expect(result).toBeDefined();
    expect(result.stopReason).toBe('REACHED_TARGET');
    expect(result.summary.weeksSimulated).toBe(4);
    expect(result.finalState.career.week).toBe(5);
  });

  it('stops if max iterations is reached', () => {
    const initialState = getBaseState();
    const request: SimulationRequest = { mode: 'SIX_MONTHS', maxIterations: 5 }; 
    
    const generator = runSimulation(initialState, request);
    const result = runToCompletion(generator);
    
    expect(result.stopReason).toBe('MAX_ITERATIONS_REACHED');
    expect(result.summary.weeksSimulated).toBe(5);
  });

  it('stops if cancellation token is true', () => {
    const initialState = getBaseState();
    const token = { cancelled: false };
    const request: SimulationRequest = { mode: 'SIX_MONTHS', cancelToken: token };
    
    const generator = runSimulation(initialState, request);
    generator.next(); // 1 week
    generator.next(); // 2 weeks
    
    token.cancelled = true; // user cancels
    const result = generator.next().value as SimulationResult;
    
    expect(result.stopReason).toBe('CANCELLED');
    expect(result.summary.weeksSimulated).toBe(2);
  });

  it('stops at HIGH_IMPORTANCE_MATCH', () => {
    const initialState = getBaseState();
    // mock nextMatch and importance
    initialState.career.nextMatch = { opponent: 'Rival', isHome: true, competition: 'L1', fixtureId: 'f1' };
    initialState.career.currentSeason = {} as any; // to satisfy importance check
    
    (getMatchImportance as any).mockReturnValueOnce('HIGH');
    
    const request: SimulationRequest = { mode: 'THREE_MONTHS' };
    const generator = runSimulation(initialState, request);
    
    const result = generator.next().value as SimulationResult; // stops BEFORE simulating
    
    expect(result.stopReason).toBe('HIGH_IMPORTANCE_MATCH');
    expect(result.summary.weeksSimulated).toBe(0);
  });
  
  it('stops at FINAL_MATCH', () => {
    const initialState = getBaseState();
    initialState.career.nextMatch = { opponent: 'Rival', isHome: true, competition: 'L1', fixtureId: 'f1' };
    initialState.career.currentSeason = {} as any; 
    
    (getMatchImportance as any).mockReturnValueOnce('FINAL');
    
    const request: SimulationRequest = { mode: 'SIX_MONTHS' };
    const generator = runSimulation(initialState, request);
    
    const result = generator.next().value as SimulationResult;
    
    expect(result.stopReason).toBe('FINAL_MATCH');
  });

  it('stops if NEXT_MATCH mode and a match is present', () => {
    const initialState = getBaseState();
    initialState.career.nextMatch = { opponent: 'Rival', isHome: true, competition: 'L1', fixtureId: 'f1' };
    
    const request: SimulationRequest = { mode: 'NEXT_MATCH' };
    const generator = runSimulation(initialState, request);
    
    const result = generator.next().value as SimulationResult;
    
    expect(result.stopReason).toBe('REACHED_TARGET');
    expect(result.summary.weeksSimulated).toBe(0);
  });

  it('stops on SEVERE_INJURY when an event pops up', () => {
    const initialState = getBaseState();
    
    // Setup advanceWeekLogic to return an injury event on the first call
    (advanceWeekLogic as any).mockImplementationOnce((state: GameState) => {
      return {
        ...state,
        phase: 'EVENT',
        narrative: {
          activeEvents: ['EV_INJURY_1']
        }
      };
    });

    const request: SimulationRequest = { mode: 'ONE_MONTH' };
    const generator = runSimulation(initialState, request);
    
    const result = runToCompletion(generator);
    
    expect(result.stopReason).toBe('URGENT_EVENT');
    expect(result.summary.eventsTriggered).toBe(1);
    expect(result.finalState.phase).toBe('EVENT');
  });
  
  it('stops on TRANSFER_OFFER', () => {
    const initialState = getBaseState();
    
    (advanceWeekLogic as any).mockImplementationOnce((state: GameState) => {
      return {
        ...state,
        phase: 'EVENT',
        narrative: {
          activeEvents: ['EV_TRANSFER_OFFER']
        }
      };
    });

    const request: SimulationRequest = { mode: 'ONE_MONTH' };
    const generator = runSimulation(initialState, request);
    
    const result = runToCompletion(generator);
    
    expect(result.stopReason).toBe('URGENT_EVENT');
  });

  it('handles END_OF_SEASON when advancing to a new year', () => {
    const initialState = getBaseState();
    initialState.career.week = 51;
    
    (advanceWeekLogic as any).mockImplementation((state: GameState) => {
      const nextWeek = state.career.week + 1;
      return {
        ...state,
        career: {
          ...state.career,
          week: nextWeek > 52 ? 1 : nextWeek,
          year: nextWeek > 52 ? state.career.year + 1 : state.career.year
        }
      };
    });

    const request: SimulationRequest = { mode: 'SIX_MONTHS' };
    const generator = runSimulation(initialState, request);
    
    const result = runToCompletion(generator);
    
    expect(result.stopReason).toBe('END_OF_SEASON');
    expect(result.finalState.career.year).toBe(2025);
    expect(result.finalState.career.week).toBe(1);
  });
});
