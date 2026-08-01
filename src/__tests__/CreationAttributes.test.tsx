import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreationAttributes from '../components/creation/CreationAttributes';
import * as GameEngine from '../engine/GameEngine';
import { DraftState } from '../types';

vi.mock('../engine/GameEngine', () => ({
  useGameEngine: vi.fn(),
}));

// Mock framer-motion to avoid animation delays in tests
vi.mock('motion/react', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, onClick, onDoubleClick, tabIndex, onKeyDown, className }: any, ref: any) => (
        <div 
          ref={ref} 
          onClick={onClick} 
          onDoubleClick={onDoubleClick} 
          tabIndex={tabIndex} 
          onKeyDown={onKeyDown} 
          className={className}
          data-testid="motion-div"
        >
          {children}
        </div>
      )),
      h1: ({ children, className }: any) => <h1 className={className}>{children}</h1>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('CreationAttributes (Visual Draft)', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockState: any;
  
  beforeEach(() => {
    mockDispatch = vi.fn();
    vi.useFakeTimers();

    const mockDraftState: DraftState = {
      mode: 'QUICK',
      seed: 123,
      currentRoundIndex: 0,
      acquiredDNA: [],
      usedIdols: [],
      rounds: [
        {
          attributeId: 'PAC',
          options: [
            { idolId: 'r9', name: 'Ronaldo', nationality: 'BR', positionOrEra: 'ST', attributeValue: 95 },
            { idolId: 'messi', name: 'Messi', nationality: 'AR', positionOrEra: 'RW', attributeValue: 92, dna: { id: 'dna1', type: 'TRAIT', name: 'Bola Colada', description: '', rarity: 'LEGENDARY', originId: 'messi' } },
            { idolId: 'cr7', name: 'Ronaldo', nationality: 'PT', positionOrEra: 'LW', attributeValue: 93 },
          ]
        },
        { attributeId: 'SHO', options: [] }
      ]
    };

    mockState = {
      player: { position: 'ST' },
      draftState: mockDraftState
    };

    (GameEngine.useGameEngine as any).mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders cards as blind draft (shows ??? initially)', () => {
    render(<CreationAttributes />);
    
    // Check title
    expect(screen.getAllByText('PAC')[0]).toBeDefined();
    
    // Check that we have 3 options (mock has 3)
    const cards = screen.getAllByTestId('motion-div').filter(el => el.className.includes('cursor-pointer'));
    expect(cards.length).toBe(3);

    // "???" should be visible
    expect(screen.getAllByText('???').length).toBe(3);
  });

  it('reveals the card and dispatches SELECT_DRAFT_OPTION after delay', () => {
    render(<CreationAttributes />);
    
    const cards = screen.getAllByTestId('motion-div').filter(el => el.className.includes('cursor-pointer'));
    
    fireEvent.click(cards[0]);

    // Fast-forward animation delay (2000ms)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DRAFT_OPTION',
      payload: 'r9'
    });
  });

  it('allows quick selection via double click', () => {
    render(<CreationAttributes />);
    
    const cards = screen.getAllByTestId('motion-div').filter(el => el.className.includes('cursor-pointer'));
    
    fireEvent.doubleClick(cards[1]);

    // Should dispatch immediately
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DRAFT_OPTION',
      payload: 'messi'
    });
  });
  
  it('allows selection via keyboard', () => {
    render(<CreationAttributes />);
    
    const cards = screen.getAllByTestId('motion-div').filter(el => el.className.includes('cursor-pointer'));
    
    fireEvent.keyDown(cards[2], { key: 'Enter', code: 'Enter' });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SELECT_DRAFT_OPTION',
      payload: 'cr7'
    });
  });
  
  it('displays DNA if acquired', () => {
    mockState.draftState.acquiredDNA = [
       { id: 'test', type: 'TRAIT', name: 'Finesse Shot', description: '', rarity: 'COMMON', originId: 'test' }
    ];
    render(<CreationAttributes />);
    expect(screen.getByText('Finesse Shot')).toBeDefined();
  });
  
  it('dispatches COMPLETE_DRAFT when all rounds are done', () => {
    mockState.draftState.currentRoundIndex = 2; // rounds length is 2, so it's complete
    
    render(<CreationAttributes />);
    
    expect(screen.getByText('Draft Concluído')).toBeDefined();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'COMPLETE_DRAFT'
    });
  });
});
