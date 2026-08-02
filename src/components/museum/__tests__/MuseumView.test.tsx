import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MuseumView from '../MuseumView';
import * as useMuseumDataModule from '../../../hooks/useMuseumData';
import { AvatarManagerProvider } from '../../3d/AvatarManager';

// Mock the hook
vi.mock('../../../hooks/useMuseumData', () => ({
  useMuseumData: vi.fn()
}));

// Mock 3D components which can cause issues in tests
vi.mock('../../ui/PlayerPortrait', () => ({
  PlayerPortrait: () => <div data-testid="mock-player-portrait" />
}));

const mockData = {
  player: { name: 'Pele' },
  career: { history: [], transfers: [], matches: [] },
  legacyState: { 
    events: [],
    score: { clubLegend: 10, nationalHero: 20, globalIcon: 30, eraDominator: 40, totalGoatScore: 100 },
    summary: { totalGoals: 100, totalAssists: 50, totalMatches: 200, totalTrophies: 10, ballonDors: 3, yearsActive: 10 },
    records: [],
    milestones: [],
    hallOfFameLevel: 'LEGEND'
  },
  uniqueClubs: ['Santos'],
  uniqueShirts: [10],
  allTrophies: [{ year: 1960, name: 'Paulista', clubName: 'Santos' }],
  allAwards: [{ year: 1962, name: 'Best Player', clubName: 'Santos' }],
  historicMatches: []
};

describe('MuseumView', () => {
  it('renders correctly with empty data', () => {
    vi.spyOn(useMuseumDataModule, 'useMuseumData').mockReturnValue(mockData as any);
    render(<MuseumView />);
    
    // Check if player name is rendered
    expect(screen.getByText('Pele')).toBeDefined();
    
    // Check if timeline is active by default
    expect(screen.getByText('Página em Branco')).toBeDefined();
  });
  
  it('switches tabs correctly', async () => {
    vi.spyOn(useMuseumDataModule, 'useMuseumData').mockReturnValue(mockData as any);
    render(<MuseumView />);
    
    // Click on Stats tab
    fireEvent.click(screen.getByText('Estatísticas'));
    
    // Check if stats are rendered
    await waitFor(() => {
      expect(screen.getByText('Gols na Carreira')).toBeDefined();
      expect(screen.getByText('100')).toBeDefined();
    });
  });
});
