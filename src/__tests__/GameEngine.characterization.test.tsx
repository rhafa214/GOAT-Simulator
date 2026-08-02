import { GAME_EVENTS } from '../data/events';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { GameProvider, useGameEngine } from '../engine/GameEngine';
import { rng } from '../utils/rng';

describe('GameEngine Characterization', () => {
  let rngSpy: any;

  beforeEach(() => {
    // Make tests deterministic by overriding the RNG
    rngSpy = vi.spyOn(rng, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setup = () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );
    return renderHook(() => useGameEngine(), { wrapper });
  };

  test('INITIAL_STATE has expected values', () => {
    const { result } = setup();
    const state = result.current.state;
    
    expect(state.phase).toBe('MAIN_MENU');
    expect(state.player.age).toBe(17);
    expect(state.player.technical.PAC).toBe(50);
    expect(state.finances.balance).toBe(0);
    expect(state.career.week).toBe(1);
    expect(state.career.year).toBe(2024);
  });

  test('INITIALIZE_PLAYER updates player info', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ 
        type: 'INITIALIZE_PLAYER', 
        payload: { name: 'Test Player', position: 'ST' } 
      });
    });
    
    expect(result.current.state.player.name).toBe('Test Player');
    expect(result.current.state.player.position).toBe('ST');
  });

  test('SET_DRAFT_LENGTH updates draftLength', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ type: 'SET_DRAFT_LENGTH', payload: 'COMPLETE' });
    });
    
    expect(result.current.state.draftLength).toBe('COMPLETE');
  });

  test('SETUP_CAREER sets club, weekly wage, nextMatch and changes phase to HUB', () => {
    const { result } = setup();
    const mockClub = {
      id: 'of_eng_arsenalfc',
      name: 'Arsenal FC',
      tier: 1,
      league: 'Premier League (Inglaterra)',
      baseSalary: 15000,
      primaryColor: '#e53238',
      reputation: 80,
    };
    
    // Control random for generateNextMatch: > 0.5 means home match
    vi.spyOn(rng, 'pick').mockReturnValue('Time X'); vi.spyOn(rng, 'chance').mockReturnValue(true);
    
    act(() => {
      result.current.dispatch({ type: 'SETUP_CAREER', payload: { club: mockClub } });
    });
    
    const state = result.current.state;
    expect(state.phase).toBe('HUB');
    expect(state.career.currentClub).toEqual(mockClub);
    expect(state.finances.weeklyWage).toBe(15000);
    expect(state.career.nextMatch).toBeDefined();
    expect(state.career.nextMatch?.isHome).toBeDefined();
  });

  test('CHANGE_PHASE updates the game phase', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ type: 'CHANGE_PHASE', payload: 'DRAFT_CLUB' });
    });
    
    expect(result.current.state.phase).toBe('DRAFT_CLUB');
  });

  test('SET_TRAINING_PLAN updates the training plan', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ type: 'SET_TRAINING_PLAN', payload: { focus: 'FINISHING', intensity: 'HIGH' } });
    });
    
    const state = result.current.state;
    expect(state.player.trainingPlan).toBeDefined();
    expect(state.player.trainingPlan?.focus).toBe('FINISHING');
    expect(state.player.trainingPlan?.intensity).toBe('HIGH');
  });

  test('ADD_NEWS appends a news item', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ 
        type: 'ADD_NEWS', 
        payload: { headline: 'Test News', summary: 'This is a test', date: 'Semana 1, 2024', week: 1, year: 2024, category: 'rumor', relatedEntities: [], importance: 1, source: 'Test' } 
      });
    });
    
    expect(result.current.state.narrative.news.length).toBe(1);
    expect(result.current.state.narrative.news[0].headline).toBe('Test News');
  });

  describe('ADVANCE_WEEK mechanics', () => {
    test('Simulates a match if scheduled, pays salary, restores fitness', () => {
      const { result } = setup();
      
      const mockClub = {
        id: 'of_br_corinthianssp',
        name: 'Corinthians SP',
        tier: 1,
        league: 'Série A (Brasil)',
        baseSalary: 1000,
        primaryColor: '#000',
        reputation: 50
      };
      
      // Setup club to have a match
      act(() => {
        result.current.dispatch({ type: 'SETUP_CAREER', payload: { club: mockClub } });
      });

      const initialBalance = result.current.state.finances.balance;
      
      // Ensure match triggers
      // Sequence of randoms in advanceWeekLogic:
      // playedMin, goals, assists, shots, passes, passAcc, rating part 1, rating part 2, motm, injured
      rngSpy.mockReturnValue(0.5);
      
      act(() => {
        result.current.dispatch({ type: 'ADVANCE_WEEK' });
      });
      
      const state = result.current.state;
      // Balance should increase by weeklyWage
      expect(state.finances.balance).toBe(initialBalance + 1000);
      
      // Since a match happened (POST_MATCH phase), the week number does NOT immediately increase in the UI if it stops at POST_MATCH?
      // Wait, advanceWeekLogic always increments nextWeek and sets it in the return object before returning POST_MATCH.
      expect(state.career.week).toBe(2);
      expect(state.phase).toBe('POST_MATCH');
      expect(state.career.matches.length).toBe(1);
    });

    test('Advances year and age after week 52', () => {
      const { result } = setup();
      
      // We need to artificially fast-forward to week 52. 
      // Instead of calling ADVANCE_WEEK 52 times (which triggers matches and stops at POST_MATCH),
      // let's manually advance weeks until week 52.
      // Wait, ADVANCE_WEEK stops simulation if a match is played or event triggered.
      
      // Let's remove nextMatch to avoid stopping at POST_MATCH
      // Actually we can't easily remove nextMatch with existing actions unless we resolve POST_MATCH, but we don't have an action to clear match yet.
      // Let's use ADVANCE_WEEK and just let it happen, but we need to bypass POST_MATCH.
      // We'll write a test that loops, and if it hits POST_MATCH or EVENT, we dispatch CHANGE_PHASE to 'HUB'.
      
      act(() => {
         // Clear the club so no matches are generated, or set random to 0.1 so nextMatch is never generated
         rngSpy.mockReturnValue(0.1); 
      });

      for(let i = 1; i <= 52; i++) {
        act(() => {
          result.current.dispatch({ type: 'ADVANCE_WEEK' });
        });
      }

      const state = result.current.state;
      expect(state.career.week).toBe(1);
      expect(state.career.year).toBe(2025);
      expect(state.player.age).toBe(18); // 17 + 1
      expect(state.career.history.length).toBe(1); // One season archived
    });
  });

  test('RESOLVE_EVENT processes event effects and clears active event', () => {
    const { result } = setup();
    
    // We need to force an event to trigger
    const mockClub = {
        id: 'of_br_corinthianssp',
        name: 'Corinthians SP',
        tier: 1,
        league: 'Série A (Brasil)',
        baseSalary: 1000,
        primaryColor: '#000',
        reputation: 50
      };
    act(() => {
      result.current.dispatch({ type: 'SETUP_CAREER', payload: { club: mockClub } });
    });
    rngSpy.mockReturnValue(0.002); // Trigger large event (Treinador Demitido needs currentClub != null), as historic might have conditions not met
    
    act(() => {
      result.current.dispatch({ type: 'ADVANCE_WEEK' });
    });
    
    const state = result.current.state;
    expect(state.phase).toBe('EVENT');
    expect(state.narrative.activeEvents.length).toBeGreaterThan(0);
    
    const event = GAME_EVENTS.find(e => e.id === state.narrative.activeEvents[0]);
    const option = event.options[0];
    
    act(() => {
      result.current.dispatch({ 
        type: 'RESOLVE_EVENT', 
        payload: { eventId: event.id, optionId: option.id } 
      });
    });
    
    expect(result.current.state.phase).toBe('HUB');
    expect(result.current.state.narrative.activeEvents.length).toBe(0);
  });
});
