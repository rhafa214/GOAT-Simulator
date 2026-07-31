import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { GameProvider } from '../engine/GameEngine';
import { usePlayer, useOverall, useCareer, useGamePhase } from '../engine/selectors';
import { useGameActions } from '../engine/actions';

describe('Selectors and Actions', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GameProvider>{children}</GameProvider>
  );

  it('provides the default player and phase', () => {
    const { result } = renderHook(() => ({ phase: useGamePhase(), player: usePlayer() }), { wrapper });
    expect(result.current.phase).toBe('CREATION_BASIC_INFO');
    expect(result.current.player.name).toBe('');
  });

  it('actions.initializePlayer updates player and overall', () => {
    const { result } = renderHook(() => ({ actions: useGameActions(), player: usePlayer() }), { wrapper });

    act(() => {
      result.current.actions.initializePlayer({ name: 'Pelé', nationality: 'BR' });
    });

    expect(result.current.player.name).toBe('Pelé');
    expect(result.current.player.nationality).toBe('BR');
  });

  it('actions.advancePhase changes the phase', () => {
    const { result } = renderHook(() => ({ actions: useGameActions(), phase: useGamePhase() }), { wrapper });

    act(() => {
      result.current.actions.advancePhase('HUB');
    });

    expect(result.current.phase).toBe('HUB');
  });
});
