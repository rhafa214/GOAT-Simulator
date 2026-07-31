import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEngine } from '../core/domain/eventEngine';
import { GameEvent, GameState } from '../types';
import { IRNG, DefaultRNG } from '../utils/rng';

vi.mock('../data/events', () => ({
  GAME_EVENTS: [
    {
      id: 'EVT_TEST_SMALL',
      title: 'Small',
      description: '...',
      condition: () => true,
      options: [],
      weight: 10,
      rarity: 'small',
      isUrgent: false,
      cooldown: 4
    },
    {
      id: 'EVT_TEST_MEDIUM',
      title: 'Medium',
      description: '...',
      condition: () => true,
      options: [],
      weight: 10,
      rarity: 'medium',
      isUrgent: false,
      cooldown: 4
    },
    {
      id: 'EVT_TEST_URGENT',
      title: 'Urgent',
      description: '...',
      condition: () => true,
      options: [],
      weight: 10,
      rarity: 'large',
      isUrgent: true,
      priority: 10,
      cooldown: 4
    },
    {
      id: 'EVT_IMPOSSIBLE',
      title: 'Impossible',
      description: '...',
      condition: () => false,
      options: [],
      weight: 1000,
      rarity: 'historic',
      isUrgent: false,
      cooldown: 0
    }
  ] as GameEvent[]
}));

describe('EventEngine', () => {
  let engine: EventEngine;
  let mockState: GameState;
  
  beforeEach(() => {
    engine = new EventEngine({
      baseProbabilities: {
        small: 1, // 100% chance for test
        medium: 1,
        large: 1,
        historic: 1
      }
    });
    
    mockState = {
      narrative: {
        eventHistory: {},
        activeEvents: [],
        flags: {},
        news: []
      },
      career: {
        year: 2024,
        week: 10,
      }
    } as any;
  });

  it('filters out ineligible events', () => {
    const rng = new DefaultRNG();
    
    // Set prob to historic only
    engine = new EventEngine({
      baseProbabilities: { small: 0, medium: 0, large: 0, historic: 1 }
    });

    const events = engine.evaluateEvents(mockState, rng);
    
    // EVT_IMPOSSIBLE is historic but condition is false
    expect(events.length).toBe(0);
  });

  it('selects based on rarity probabilities', () => {
    const rng = new DefaultRNG();
    
    engine = new EventEngine({
      baseProbabilities: { small: 0, medium: 0, large: 1, historic: 0 }
    });

    const events = engine.evaluateEvents(mockState, rng);
    
    expect(events.length).toBe(1);
    expect(events[0].id).toBe('EVT_TEST_URGENT');
  });

  it('respects cooldowns', () => {
    const rng = new DefaultRNG();
    
    engine = new EventEngine({
      baseProbabilities: { small: 1, medium: 0, large: 0, historic: 0 }
    });

    // Event occurred at week 8, current week 10. Cooldown is 4.
    mockState.narrative.eventHistory = {
      'EVT_TEST_SMALL': (2024 * 52) + 8
    };

    const events = engine.evaluateEvents(mockState, rng);
    
    // Should be filtered out by cooldown
    expect(events.length).toBe(0);
    
    // Fast forward time
    mockState.career.week = 13;
    const events2 = engine.evaluateEvents(mockState, rng);
    expect(events2.length).toBe(1);
  });
});
