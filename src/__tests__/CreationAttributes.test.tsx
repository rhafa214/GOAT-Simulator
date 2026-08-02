import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreationAttributes from '../components/creation/CreationAttributes';
import * as GameEngine from '../engine/GameEngine';

vi.mock('../engine/GameEngine', () => ({
  useGameEngine: vi.fn(),
}));

describe('CreationAttributes', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockState: any;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockState = {
      player: { position: 'ST' },
      draftLength: 'QUICK'
    };
    (GameEngine.useGameEngine as any).mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });
  });

  it('renders mode selection initially', () => {
    render(<CreationAttributes />);
    expect(screen.getByText('Estratégico')).toBeDefined();
    expect(screen.getByText('Scout (Às Cegas)')).toBeDefined();
  });

  it('starts draft when a mode is selected', () => {
    render(<CreationAttributes />);
    fireEvent.click(screen.getByText('Scout (Às Cegas)'));
    // Should now render the first category title
    expect(screen.getByText('Escolha um atributo')).toBeDefined();
  });
});
