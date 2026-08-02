import { GameState, GameAction } from '../../../types';
import { ALL_CLUBS, STARTER_CLUBS } from "../../../data/database";
import { createSeason, registerLeagueCompetition, getNextFixtureForClub } from '../../domain/seasonEngine';

export function careerReducer(state: GameState["career"], action: GameAction): GameState["career"] {
  switch (action.type) {
    case 'SETUP_CAREER': {
      const currentClub = action.payload.club;
      let season = createSeason(state.year);
      
      // Filter clubs from the same league, or fallback to STARTER_CLUBS if league has < 2 clubs
      const matchingClubs = ALL_CLUBS.filter(c => c.league === currentClub.league);
      const effectiveClubs = matchingClubs.length >= 2 ? matchingClubs : STARTER_CLUBS;
      
      // Ensure current club is included in effectiveClubs if not already present
      if (!effectiveClubs.some(c => c.id === currentClub.id)) {
        effectiveClubs.push(currentClub);
      }
      
      const teamIds = effectiveClubs.map(c => c.id);
      
      // Register league
      const compId = 'nat_league';
      season = registerLeagueCompetition(season, compId, currentClub.league || 'Premier League (Inglaterra)', teamIds);

      // Get next match
      const nextFix = getNextFixtureForClub(season, currentClub.id);
      let nextMatchInfo = null;
      if (nextFix) {
        const isHome = nextFix.homeTeamId === currentClub.id;
        const oppId = isHome ? nextFix.awayTeamId : nextFix.homeTeamId;
        const oppClub = ALL_CLUBS.find(c => c.id === oppId);
        nextMatchInfo = {
          opponent: oppClub ? oppClub.name : oppId,
          opponentLogo: oppClub?.logo,
          isHome,
          competition: currentClub.league,
          fixtureId: nextFix.id
        };
      }

      return { 
        ...state, 
        currentClub: currentClub, 
        currentSeason: season,
        nextMatch: nextMatchInfo as NonNullable<GameState["career"]["nextMatch"]> 
      };
    }

    case 'PLAY_MATCH': {
      const match = action.payload;
      const updatedMatches = [...state.matches, match];
      const stats = { ...state.currentSeasonStats };
      stats.matchesPlayed += 1;
      stats.minutesPlayed += match.minutesPlayed;
      stats.goals += match.goals;
      stats.assists += match.assists;
      stats.shots += match.shots;
      stats.passes += match.passes;
      stats.passAccuracySum += match.passAccuracy;
      stats.avgRating = updatedMatches.reduce((acc, m) => acc + m.rating, 0) / updatedMatches.length;
      if (match.motm) stats.motm += 1;
      if (match.wasCaptain) stats.captaincies += 1;
      if (match.injured) stats.injuries += 1;

      return {
        ...state,
        matches: updatedMatches,
        currentSeasonStats: stats
      };
    }

    case 'SAVE_HISTORIC_MATCH': {
      const matchId = action.payload.matchId;
      const updatedMatches = state.matches.map(m => 
        m.id === matchId ? { ...m, isSavedInMuseum: true, isHistoric: true } : m
      );
      return {
        ...state,
        matches: updatedMatches
      };
    }

    default:
      return state;
  }
}
