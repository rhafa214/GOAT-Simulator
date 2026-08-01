import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TransferHub from './TransferHub';
import { useGameEngine } from '../../../engine/GameEngine';

// Mock dependencies
vi.mock('../../../engine/GameEngine', () => ({
  useGameState: vi.fn(),
  useGameEngine: vi.fn()
}));

vi.mock('../../../data/database', () => ({
  ALL_CLUBS: [{ id: 'c1', name: 'Test Club', logo: '', reputation: 50, tier: 1, league: '' }]
}));

const mockDispatch = vi.fn();

describe('TransferHub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Sem propostas" when activeProposals is empty', () => {
    (useGameEngine as any).mockReturnValue({
      state: {
        career: {
          transferState: { activeProposals: [] }
        }
      },
      dispatch: mockDispatch
    });

    render(<TransferHub />);
    expect(screen.getByText('Sem propostas ativas')).toBeInTheDocument();
  });

  it('renders proposals and can accept', () => {
    (useGameEngine as any).mockReturnValue({
      state: {
        finances: { weeklyWage: 1000 },
        career: {
          year: 2024,
          week: 1,
          transfers: [],
          transferState: {
            activeProposals: [{
              id: 'p1',
              clubId: 'c1',
              clubName: 'Test Club',
              offerSalary: 10000,
              offerDuration: 2,
              transferFee: 1000,
              status: 'generated',
              weekGenerated: 1,
              yearGenerated: 2024,
              negotiationRounds: 0,
              expectedRole: 'Titular'
            }]
          }
        },
        player: { technical: { PAC: 80 }, rpg: { fame: 50 } }
      },
      dispatch: mockDispatch
    });

    render(<TransferHub />);
    expect(screen.getAllByText('Test Club')[0]).toBeInTheDocument();
    
    // Accept
    const acceptBtn = screen.getByText('Aceitar Proposta');
    fireEvent.click(acceptBtn);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_STATE' }));
  });
});
