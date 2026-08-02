import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { detectPostMatchStoryLevel, generateMatchStory, countWords } from '../components/postMatch/postMatchStoryEngine';
import { MatchStats, GameState } from '../types';
import PostMatchScreen from '../components/hub/PostMatchScreen';
import { createInitialGameState } from '../core/state/initialState';

const baseMatch: MatchStats = {
  id: 'm1',
  week: 1,
  year: 2026,
  competition: 'Premier League',
  opponent: 'Arsenal',
  home: true,
  minutesPlayed: 90,
  goals: 0,
  assists: 0,
  shots: 2,
  passes: 25,
  passAccuracy: 85,
  rating: 6.5,
  motm: false,
  injured: false,
  wasCaptain: false,
};

vi.mock('../engine/GameEngine', () => ({
  useGameEngine: () => ({
    state: {
      ...createInitialGameState(),
      phase: 'POST_MATCH',
      career: {
        ...createInitialGameState().career,
        matches: [baseMatch]
      }
    },
    dispatch: vi.fn()
  })
}));

describe('Post-Match Story Engine & Screen', () => {
  it('detects COMPACT level for regular matches', () => {
    const level = detectPostMatchStoryLevel(baseMatch);
    expect(level).toBe('COMPACT');
  });

  it('detects COMPLETE level for derby or high rating/goals', () => {
    const derbyMatch: MatchStats = { ...baseMatch, importance: 'DERBY', opponent: 'Palmeiras (Clássico)' };
    expect(detectPostMatchStoryLevel(derbyMatch)).toBe('COMPLETE');

    const multiGoalMatch: MatchStats = { ...baseMatch, goals: 2, rating: 8.5 };
    expect(detectPostMatchStoryLevel(multiGoalMatch)).toBe('COMPLETE');
  });

  it('detects HISTORIC level for finals or record performances', () => {
    const finalMatch: MatchStats = { ...baseMatch, importance: 'FINAL', trophyWon: 'Copa do Brasil' };
    expect(detectPostMatchStoryLevel(finalMatch)).toBe('HISTORIC');

    const hatTrickMatch: MatchStats = { ...baseMatch, goals: 3, rating: 9.9 };
    expect(detectPostMatchStoryLevel(hatTrickMatch)).toBe('HISTORIC');
  });

  it('enforces word limits on headline, summary, and historic narrative', () => {
    const dummyState: GameState = createInitialGameState();
    const story = generateMatchStory(dummyState, baseMatch);

    expect(countWords(story.headline)).toBeLessThanOrEqual(12);
    expect(countWords(story.decisiveMoment)).toBeLessThanOrEqual(45);
    expect(countWords(story.historicNarrative)).toBeLessThanOrEqual(80);
  });

  it('renders PostMatchScreen and allows level override switching', async () => {
    const { getByTestId, findByTestId } = render(<PostMatchScreen />);

    // Screen loads correctly
    expect(getByTestId('post-match-screen')).toBeDefined();

    // Switch to Level 2 (Completo)
    const level2Btn = getByTestId('level-complete-btn');
    fireEvent.click(level2Btn);

    // Switch to Level 3 (Histórico)
    const level3Btn = getByTestId('level-historic-btn');
    fireEvent.click(level3Btn);

    // Save to museum button exists
    const saveBtn = await findByTestId('save-to-museum-button');
    expect(saveBtn).toBeDefined();
  });
});
