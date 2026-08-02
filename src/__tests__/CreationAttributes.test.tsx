import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreationAttributes from '../components/creation/CreationAttributes';
import * as GameEngine from '../engine/GameEngine';

vi.mock('../engine/GameEngine', () => ({
  useGameEngine: vi.fn(),
  GameProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
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

  it('renders DraftExperience component correctly', () => {
    render(<CreationAttributes />);
    expect(screen.getByText(/Draft Rápido/i)).toBeInTheDocument();
    expect(screen.getByText(/Blind Draft/i)).toBeInTheDocument();
    expect(screen.getByText(/Atributo Alvo — Rodada 1/i)).toBeInTheDocument();
  });

  it('allows card inspection and confirmation', () => {
    render(<CreationAttributes />);
    const card1 = screen.getByLabelText(/Carta 1/i);
    fireEvent.click(card1);

    expect(screen.getByRole('button', { name: /Confirmar Escolha/i })).toBeInTheDocument();
  });
});
