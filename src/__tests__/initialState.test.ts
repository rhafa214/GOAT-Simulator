import { expect, test, describe } from 'vitest';
import { createInitialGameState } from '../core/state/initialState';

describe('initialState', () => {
  test('creates a new independent object every call', () => {
    const state1 = createInitialGameState();
    const state2 = createInitialGameState();
    
    // Check they are separate objects
    expect(state1).not.toBe(state2);
    expect(state1.player.appearance).not.toBe(state2.player.appearance);
    expect(state1.career).not.toBe(state2.career);
    
    // Ensure mutation doesn't bleed
    state1.player.name = 'Test';
    expect(state2.player.name).toBe('');
    
    state1.player.appearance.hairColor = '123456';
    expect(state2.player.appearance.hairColor).toBe('000000');
  });

  test('accepts partial options', () => {
    const customState = createInitialGameState({ phase: 'HUB' });
    expect(customState.phase).toBe('HUB');
    expect(customState.player.age).toBe(17);
  });
});
