import { useMemo } from 'react';
import { useGameSelector } from '../engine/selectors';
import { LegacyEngine } from '../core/domain/legacyEngine';
import { SeasonRecord } from '../types';

export function useMuseumData() {
  const player = useGameSelector(state => state.player);
  const career = useGameSelector(state => state.career);
  const { history, transfers, matches } = career;

  return useMemo(() => {
    const legacyState = LegacyEngine.calculateLegacy(history);
    
    const uniqueClubs = Array.from(new Set(history.map(h => h.clubName).filter(Boolean)));
    const uniqueShirts = Array.from(new Set(history.map(h => h.shirtNumber).filter(Boolean)));
    
    const allTrophies = history.flatMap(h => h.trophies.map(t => ({ year: h.year, name: t, clubName: h.clubName })));
    const allAwards = history.flatMap(h => h.awards.map(a => ({ year: h.year, name: a, clubName: h.clubName })));
    
    const historicMatches = matches.filter(m => m.motm || m.rating >= 9.0).sort((a, b) => b.year - a.year || b.week - a.week);

    return {
      player,
      career,
      legacyState,
      uniqueClubs,
      uniqueShirts,
      allTrophies,
      allAwards,
      historicMatches
    };
  }, [player, career, history, transfers, matches]);
}
