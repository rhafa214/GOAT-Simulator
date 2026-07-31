import { simulateMatch, SimulateMatchParams } from '../../domain/matchEngine';
import { toLegacyMatchStats } from '../../domain/matchAdapter';
import { ALL_CLUBS } from '../../../data/database';
import { GameState, GameEvent, MatchStats } from '../../../types';
import { rng } from '../../../utils/rng';
import { eventEngine } from '../../domain/eventEngine';
import { newsEngine } from '../../domain/newsEngine';
// from '../../domain/eventEngine';
import { registerMatchResult, getNextFixtureForClub, advanceSeasonWeek, getMatchImportance, finishSeason, createSeason, registerLeagueCompetition } from '../../domain/seasonEngine';

export function advanceWeekLogic(state: GameState): GameState {
  const nextWeek = state.career.week + 1;
  let nextSeason = state.career.season;
  let nextYear = state.career.year;
  const nextHistory = [...state.career.history];
  const nextSeasonStats = { ...state.career.currentSeasonStats };
  let currentSeasonState = state.career.currentSeason;
  
  let newPlayer = { ...state.player };
  let newBalance = state.finances.balance;
  
  // Salary payment
  if (state.career.currentClub) {
     newBalance += state.finances.weeklyWage;
  }
  
  // Weekly fitness recovery (up to 100)
  newPlayer.rpg.fitness = Math.min(100, newPlayer.rpg.fitness + 15);
  
  if (nextWeek > 52) {
     nextSeason++;
     nextYear++;
     nextHistory.push({
        ...nextSeasonStats,
        year: state.career.year,
        clubId: state.career.currentClub?.id || ''
     });
     
     // reset season stats
     Object.assign(nextSeasonStats, {
        matchesPlayed: 0,
        minutesPlayed: 0,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 0,
        passAccuracySum: 0,
        avgRating: 0,
        injuries: 0,
        motm: 0,
        captaincies: 0,
     });
     newPlayer.age++;
     
     
     if (currentSeasonState) {
         currentSeasonState = finishSeason(currentSeasonState);
     }
     
     // Create a new season for the new year (migrates old saves too)
     if (state.career.currentClub) {
         currentSeasonState = createSeason(nextYear);
         const leagueClubs = ALL_CLUBS.filter(c => c.league === state.career.currentClub!.league);
         const teamIds = leagueClubs.map(c => c.id);
         currentSeasonState = registerLeagueCompetition(currentSeasonState, 'nat_league', state.career.currentClub.league, teamIds);
     }
  }

  // Handle Match
  let matchLog: MatchStats | null = null;
  if (state.career.nextMatch && state.career.currentClub !== null) {
     const opponentName = state.career.nextMatch.opponent;
     const oppClub = ALL_CLUBS.find(c => c.name === opponentName);
     const oppLevel = oppClub ? (6 - oppClub.tier) * 10 + 40 : 70;
     const oppId = oppClub ? oppClub.id : `opp_${opponentName}`;
     const myLevel = state.career.currentClub ? (6 - state.career.currentClub.tier) * 10 + 40 : 70;
     const myClubId = state.career.currentClub?.id || 'my_team';
     const myClubName = state.career.currentClub?.name || 'My Team';
     const avgTechnical = Object.values(state.player.technical).reduce((a, b) => a + b, 0) / 17;
     
     let importance: any = 'MEDIUM';
     if (currentSeasonState && state.career.nextMatch.fixtureId) {
         importance = getMatchImportance(currentSeasonState, state.career.nextMatch.fixtureId);
     }
     
     const params: SimulateMatchParams = {
       player: {
         id: 'player_1',
         name: state.player.name,
         position: state.player.position || 'CM',
         overall: avgTechnical,
         fitness: state.player.rpg.fitness,
         morale: state.player.rpg.morale
       },
       team: {
         id: myClubId,
         name: myClubName,
         level: myLevel,
         logo: state.career.currentClub?.logo
       },
       opponent: {
         id: oppId,
         name: opponentName,
         level: oppLevel,
         logo: state.career.nextMatch.opponentLogo
       },
       context: {
         competition: state.career.nextMatch.competition,
         isNationalTeam: false,
         isHome: state.career.nextMatch.isHome,
         importance
       },
       participation: {
         started: true,
         minutesPlayed: rng.integer(45, 90)
       },
       date: {
         week: state.career.week,
         year: state.career.year
       }
     };
     
     const { aggregate, fitnessImpact } = simulateMatch(params, rng);
     
     // Deduct fitness
     newPlayer.rpg.fitness = Math.max(0, newPlayer.rpg.fitness - fitnessImpact);
     matchLog = toLegacyMatchStats(aggregate, myClubId);

     // Stat accumulation
     nextSeasonStats.matchesPlayed++;
     nextSeasonStats.minutesPlayed += matchLog.minutesPlayed;
     nextSeasonStats.goals += matchLog.goals;
     nextSeasonStats.assists += matchLog.assists;
     nextSeasonStats.shots += matchLog.shots;
     nextSeasonStats.passes += matchLog.passes;
     nextSeasonStats.passAccuracySum += matchLog.passAccuracy;
     nextSeasonStats.avgRating = ((nextSeasonStats.avgRating * (nextSeasonStats.matchesPlayed - 1)) + matchLog.rating) / nextSeasonStats.matchesPlayed;
     if (matchLog.injured) nextSeasonStats.injuries++;
     if (matchLog.motm) nextSeasonStats.motm++;
     if (matchLog.wasCaptain) nextSeasonStats.captaincies++;
     
     if (currentSeasonState && state.career.nextMatch.fixtureId) {
         currentSeasonState = registerMatchResult(currentSeasonState, state.career.nextMatch.fixtureId, aggregate.result.homeScore, aggregate.result.awayScore);
     }
  }

  const newMatches = matchLog ? [matchLog, ...state.career.matches] : state.career.matches;

  if (currentSeasonState) {
      currentSeasonState = advanceSeasonWeek(currentSeasonState);
  }

  // Generate next match for the upcoming week
  let nextMatchInfo = null;
  if (currentSeasonState && state.career.currentClub !== null) {
      const nextFix = getNextFixtureForClub(currentSeasonState, state.career.currentClub.id);
      if (nextFix) {
          const isHome = nextFix.homeTeamId === state.career.currentClub.id;
          const oppId = isHome ? nextFix.awayTeamId : nextFix.homeTeamId;
          const oppClub = ALL_CLUBS.find(c => c.id === oppId);
          nextMatchInfo = {
            opponent: oppClub ? oppClub.name : oppId,
            opponentLogo: oppClub?.logo,
            isHome,
            competition: state.career.currentClub.league,
            fixtureId: nextFix.id
          };
      }
  } else if (!currentSeasonState && state.career.currentClub !== null && rng.chance(70)) {
     const possibleOpponents = ALL_CLUBS.filter(c => c.tier === state.career.currentClub!.tier && c.id !== state.career.currentClub!.id);
     const opp = possibleOpponents.length > 0 ? rng.pick(possibleOpponents) : { name: 'Rival FC', logo: undefined };
     nextMatchInfo = {
       opponent: opp.name,
       opponentLogo: opp.logo,
       isHome: rng.chance(50),
       competition: state.career.currentClub.league
     };
  }

  // Trigger events using Event Engine
  const triggeredEvents = eventEngine.evaluateEvents(state, rng);
  const triggeredEvent = triggeredEvents.length > 0 ? triggeredEvents[0] : null;

  const nextState: GameState = { 
     ...state, 
     player: newPlayer, 
     career: {
        ...state.career,
        week: nextWeek > 52 ? 1 : nextWeek,
        year: nextYear,
        season: nextSeason,
        history: nextHistory,
        currentSeasonStats: nextSeasonStats,
        matches: newMatches,
        nextMatch: nextMatchInfo as any,
        currentSeason: currentSeasonState
     },
     finances: { ...state.finances, balance: newBalance }
  };

  if (triggeredEvent) {
    const currentAbsWeek = (state.career.year * 52) + state.career.week;
    return {
      ...nextState,
      phase: 'EVENT',
      narrative: {
        ...state.narrative,
        activeEvents: [triggeredEvent],
        eventHistory: {
           ...(state.narrative.eventHistory || {}),
           [triggeredEvent.id]: currentAbsWeek
        }
      }
    };
  }

  if (matchLog) {
     const matchNews = newsEngine.generateNews(state, rng, { type: 'match', stats: matchLog });
     const nextNews = matchNews ? [matchNews, ...nextState.narrative.news].slice(0, 50) : nextState.narrative.news;
     
     return {
        ...nextState,
        phase: 'POST_MATCH',
        narrative: {
           ...nextState.narrative,
           news: nextNews
        }
     };
  }

  return nextState;
}
