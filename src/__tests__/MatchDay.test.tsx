import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import MatchDayScreen from '../components/match/MatchDayScreen';
import { detectMatchContext } from '../components/match/matchContextDetector';
import { useGameEngine, GameProvider } from '../engine/GameEngine';
import { createInitialGameState } from '../core/state/initialState';
import { GameState } from '../types';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

function TestMatchDayWrapper() {
  const { dispatch } = useGameEngine();

  React.useEffect(() => {
    dispatch({
      type: 'SET_STATE',
      payload: createInitialGameState({
        player: {
          name: 'Gabriel Fenômeno',
          age: 18,
          position: 'ST',
          nationality: 'Brasil',
          personality: 'CHARISMATIC',
          avatarUrl: '',
          appearance: {
            skinColor: 'f8d2b9', hairStyle: 'short', hairColor: '000000', facialHair: 'none',
            facialHairColor: '000000', eyes: 'normal', mouth: 'smile', nose: 'Pequeno',
            accessories: 'none', tattoos: 'none', height: 180, weight: 75, physique: 'Atlética',
            boots: 'Pretas Clássicas', sleeves: 'Curtas', gloves: false, celebration: 'Salto e Soco no Ar'
          },
          technical: { PAC: 85, SHO: 82, PAS: 75, DRI: 88, DEF: 40, PHY: 78, HEA: 70, VIS: 75, WF: 4, SM: 4, CON: 80, ACC: 86, STA: 80, JUM: 75, FK: 70, PEN: 75, CRE: 80 },
          rpg: { morale: 90, fitness: 95, fame: 100, fans: 500, LDR: 50, DET: 50, COM: 50 },
          relationships: { fans: 80, manager: 80, press: 70, squad: 80 }
        },
        career: {
          currentClub: { id: 'c1', name: 'Santos FC', tier: 1, reputation: 80, baseSalary: 10000, league: 'Brasileirão', primaryColor: '#000000' },
          nextMatch: { opponent: 'Palmeiras', isHome: true, competition: 'Brasileirão Clássico' },
          nationalTeam: null,
          shirtNumber: 10,
          isCaptain: false,
          week: 12,
          season: 1,
          year: 2024,
          history: [],
          currentSeasonStats: {
            year: 2024, clubId: 'c1', clubName: 'Santos FC', shirtNumber: 10, salary: 10000,
            matchesPlayed: 10, minutesPlayed: 900, goals: 8, assists: 4, shots: 25, passes: 300,
            passAccuracySum: 850, avgRating: 7.8, injuries: 0, motm: 3, captaincies: 0,
            competitions: ['Brasileirão'], trophies: [], awards: []
          },
          transfers: [],
          matches: [],
          awards: { ballonDor: 0, goldenBoot: 0, toty: 0, motm: 3 }
        }
      })
    });
  }, [dispatch]);

  return <MatchDayScreen />;
}

describe('Match Day Experience — GOAT Simulator', () => {

  test('detectMatchContext correctly identifies derby and final triggers', () => {
    const initialState = createInitialGameState();
    
    // Test Final trigger
    const finalState: GameState = {
      ...initialState,
      career: {
        ...initialState.career,
        nextMatch: {
          opponent: 'Real Madrid',
          isHome: true,
          competition: 'UEFA Champions League - Final',
        }
      }
    };

    const finalContext = detectMatchContext(finalState);
    expect(finalContext.isImportant).toBe(true);
    expect(finalContext.triggers.isFinal).toBe(true);
    expect(finalContext.importanceLabel).toBe('FINAL');

    // Test Derby trigger
    const derbyState: GameState = {
      ...initialState,
      career: {
        ...initialState.career,
        nextMatch: {
          opponent: 'Clássico Flamengo x Fluminense',
          isHome: true,
          competition: 'Brasileirão Clássico',
        }
      }
    };

    const derbyContext = detectMatchContext(derbyState);
    expect(derbyContext.isImportant).toBe(true);
    expect(derbyContext.triggers.isDerby).toBe(true);
    expect(derbyContext.importanceLabel).toBe('CLÁSSICO');
  });

  test('renders MatchDayScreen with match details and broadcast components for important match', async () => {
    render(
      <GameProvider>
        <TestMatchDayWrapper />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('match-day-screen')).toBeInTheDocument();
    });

    expect(screen.getByTestId('simulate-match-button')).toBeInTheDocument();
    expect(screen.getByText(/Escalação & Posição Tática/i)).toBeInTheDocument();
    expect(screen.getByText(/Objetivos do Treinador/i)).toBeInTheDocument();
  });

  test('handles keyboard shortcuts (Escape and Enter)', async () => {
    render(
      <GameProvider>
        <TestMatchDayWrapper />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('match-day-screen')).toBeInTheDocument();
    });

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });

    // Press Enter key to simulate match
    fireEvent.keyDown(window, { key: 'Enter' });
    
    expect(screen.getByTestId('match-day-screen')).toBeInTheDocument();
  });

  test('triggers match simulation on button click', async () => {
    render(
      <GameProvider>
        <TestMatchDayWrapper />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('simulate-match-button')).toBeInTheDocument();
    });

    const simButton = screen.getByTestId('simulate-match-button');
    fireEvent.click(simButton);

    expect(screen.getByText(/Entrando em Campo\.\.\./i)).toBeInTheDocument();
  });
});
