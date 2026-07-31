import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import FlowController from '../components/FlowController';
import { GameProvider } from '../engine/GameEngine';

// Mock matchMedia and ResizeObserver
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('FlowController', () => {
  test('renders initial creation screen', () => {
    render(
      <GameProvider>
        <FlowController />
      </GameProvider>
    );
    
    // We expect the CreationBasicInfo component to render initially.
    // We can just check for the header or title text that should exist.
    expect(screen.getByText(/GOAT Simulator/i)).toBeInTheDocument();
  });
});
