import { GameState, GameAction, Club } from '../../../types';
import { ALL_CLUBS } from "../../../data/database";
import { createSeason, registerLeagueCompetition, getNextFixtureForClub } from '../../domain/seasonEngine';

export function careerReducer(state: GameState["career"], action: GameAction): GameState["career"] {
  switch (action.type) {
    case 'SETUP_CAREER': {
      const currentClub = action.payload.club;
      let season = createSeason(state.year);
      
      // Filter clubs from the same league
      const leagueClubs = ALL_CLUBS.filter(c => c.league === currentClub.league);
      const teamIds = leagueClubs.map(c => c.id);
      
      // Register league
      const compId = 'nat_league';
      season = registerLeagueCompetition(season, compId, currentClub.league, teamIds);

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
    default:
      return state;
  }
}
