import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import { GameProvider, useGameEngine } from '../engine/GameEngine';

describe('GameEngine', () => {
  test('provides initial state correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );
    const { result } = renderHook(() => useGameEngine(), { wrapper });
    
    expect(result.current.state).toBeDefined();
    expect(result.current.state.phase).toBe('CREATION_BASIC_INFO');
    expect(result.current.state.player).toBeDefined();
  });

  test('can dispatch state updates', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameProvider>{children}</GameProvider>
    );
    const { result } = renderHook(() => useGameEngine(), { wrapper });
    
    act(() => {
      result.current.dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_POSITION' });
    });
    
    expect(result.current.state.phase).toBe('CREATION_POSITION');
  });
});
