import { describe, expect, test, vi } from 'vitest';
import { newsEngine } from '../core/domain/newsEngine';
import { GameState } from '../types';
import { ALL_CLUBS } from '../data/database';
import { createInitialGameState } from '../core/state/initialState';
import { DefaultRNG } from '../utils/rng';

describe('NewsEngine', () => {
  const rng = new DefaultRNG();

  test('generateNews should return null if no templates eligible', () => {
    const state: GameState = { ...createInitialGameState(), player: { ...createInitialGameState().player, rpg: { ...createInitialGameState().player.rpg, morale: 0, fame: 0 } } };
    const result = newsEngine.generateNews(state, rng);
    expect(result).toBeNull();
  });

  test('generateNews should return match news when context is match', () => {
    const baseState = createInitialGameState();
    const state: GameState = {
      ...baseState,
      player: {
        ...baseState.player,
        name: 'John Doe',
        rpg: { ...baseState.player.rpg, morale: 0, fame: 0 }
      },
      career: {
        ...baseState.career,
        currentClub: ALL_CLUBS[0],
        week: 10,
        year: 2024,
      }
    };
    
    const context = { type: 'match', stats: { goals: 1 } };
    const news = newsEngine.generateNews(state, rng, context);
    
    expect(news).not.toBeNull();
    expect(news?.category).toBe('partida');
    expect(news?.week).toBe(10);
    expect(news?.year).toBe(2024);
    expect(news?.id).toMatch(/^news_2024_10_/);
    expect(news?.headline).toBeTruthy();
  });

  test('enhanceNews should use enhancer if set', async () => {
    const state: GameState = createInitialGameState();
    const baseNews = newsEngine.generateNews(state, rng, { type: 'match', stats: { goals: 1 } });
    expect(baseNews).not.toBeNull();
    
    const enhancedNews = { ...baseNews!, headline: 'Enhanced Headline' };
    
    newsEngine.setEnhancer({
      enhance: async (news, st) => enhancedNews,
    });
    
    const result = await newsEngine.enhanceNews(baseNews!, state);
    expect(result.headline).toBe('Enhanced Headline');
    
    // cleanup
    newsEngine.setEnhancer(null as any);
  });
});
