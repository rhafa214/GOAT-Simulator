import { describe, test, expect, beforeEach } from 'vitest';
import { GameState, DraftMode } from '../types';
import { createInitialGameState } from '../core/state/initialState';
import { gameReducer } from '../core/state/reducers';
import { DraftEngine } from '../core/domain/draftEngine';
import { TransferEngine } from '../core/domain/transferEngine';
import { SaveGameService, LocalStorageSaveRepository } from '../core/domain/saveSystem';
import { LegacyEngine } from '../core/domain/legacyEngine';
import { advanceWeekLogic } from '../core/state/reducers/advanceWeek';
import { runSimulation } from '../core/domain/simulationEngine';
import { STARTER_CLUBS, ALL_CLUBS } from '../data/database';
import { SeededRNG } from '../utils/rng';

// Helper to check for NaN or Infinity in any nested state object
function assertNoNaNOrInfinity(obj: unknown, path = 'state'): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === 'number') {
    expect(Number.isNaN(obj), `NaN found at ${path}`).toBe(false);
    expect(Number.isFinite(obj), `Infinity found at ${path}`).toBe(true);
    return;
  }
  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'function') continue;
      assertNoNaNOrInfinity(value, `${path}.${key}`);
    }
  }
}

// Helper to validate player attributes bounds
function assertValidPlayerAttributes(state: GameState): void {
  for (const [stat, val] of Object.entries(state.player.technical)) {
    expect(val, `Technical stat ${stat} out of bounds: ${val}`).toBeGreaterThanOrEqual(1);
    expect(val, `Technical stat ${stat} out of bounds: ${val}`).toBeLessThanOrEqual(99);
  }
  for (const [stat, val] of Object.entries(state.player.rpg)) {
    expect(val, `RPG stat ${stat} out of bounds: ${val}`).toBeGreaterThanOrEqual(0);
    expect(val, `RPG stat ${stat} out of bounds: ${val}`).toBeLessThanOrEqual(100);
  }
  for (const [target, val] of Object.entries(state.player.relationships)) {
    expect(val, `Relationship ${target} out of bounds: ${val}`).toBeGreaterThanOrEqual(0);
    expect(val, `Relationship ${target} out of bounds: ${val}`).toBeLessThanOrEqual(100);
  }
}

describe('Full Career Lifecycle & Stress Tests (GOAT Simulator)', () => {
  let saveService: SaveGameService;

  beforeEach(() => {
    localStorage.clear();
    saveService = new SaveGameService(new LocalStorageSaveRepository());
  });

  test('1. Quick Draft Lifecycle Scenario', () => {
    const draftEngine = new DraftEngine(12345);
    let draftState = draftEngine.initializeDraft('QUICK', 12345);

    expect(draftState.rounds.length).toBe(8); // QUICK_STATS has 8 stats

    while (draftState.currentRoundIndex < draftState.rounds.length) {
      draftState = draftEngine.generateOptionsForCurrentRound(draftState);
      const currentRound = draftState.rounds[draftState.currentRoundIndex];
      expect(currentRound.options.length).toBeGreaterThan(0);
      const chosenIdol = currentRound.options[0].idolId;
      draftState = {
        ...draftState,
        rounds: draftState.rounds.map((r, idx) =>
          idx === draftState.currentRoundIndex ? { ...r, selectedOptionId: chosenIdol } : r
        ),
        currentRoundIndex: draftState.currentRoundIndex + 1
      };
      draftState = draftEngine.generateOptionsForCurrentRound(draftState);
    }

    const appliedStats = draftEngine.applyToTechnicalStats(draftState);
    expect(Object.keys(appliedStats).length).toBe(17);
    for (const val of Object.values(appliedStats)) {
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(99);
    }
  });

  test('2. Complete Draft Lifecycle Scenario', () => {
    const draftEngine = new DraftEngine(67890);
    let draftState = draftEngine.initializeDraft('COMPLETE', 67890);

    expect(draftState.rounds.length).toBe(17); // COMPLETE_STATS has 17 stats

    while (draftState.currentRoundIndex < draftState.rounds.length) {
      draftState = draftEngine.generateOptionsForCurrentRound(draftState);
      const currentRound = draftState.rounds[draftState.currentRoundIndex];
      expect(currentRound.options.length).toBeGreaterThan(0);
      const chosenOption = currentRound.options[0];
      draftState = {
        ...draftState,
        rounds: draftState.rounds.map((r, idx) =>
          idx === draftState.currentRoundIndex ? { ...r, selectedOptionId: chosenOption.idolId } : r
        ),
        currentRoundIndex: draftState.currentRoundIndex + 1
      };
      draftState = draftEngine.generateOptionsForCurrentRound(draftState);
    }

    const appliedStats = draftEngine.applyToTechnicalStats(draftState);
    expect(Object.keys(appliedStats).length).toBe(17);
    assertNoNaNOrInfinity(appliedStats);
  });

  test('3. End-to-End Single Career Lifecycle (Creation -> Season -> Transfers -> Awards -> Save/Load -> Retirement)', () => {
    // Step 1: Initialize Career
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: 'INITIALIZE_PLAYER',
      payload: {
        name: 'Test Phenomenon',
        position: 'ST',
        nationality: 'Brasil',
        personality: 'PROFESSIONAL',
        age: 17
      }
    });

    expect(state.player.name).toBe('Test Phenomenon');
    expect(state.player.age).toBe(17);

    // Step 2: Choose Validated Club
    const chosenClub = STARTER_CLUBS[0];
    expect(chosenClub).toBeDefined();
    expect(chosenClub.id).toBeTruthy();

    state = gameReducer(state, {
      type: 'SETUP_CAREER',
      payload: { club: chosenClub }
    });

    expect(state.career.currentClub?.id).toBe(chosenClub.id);
    expect(state.career.currentSeason).toBeDefined();
    expect(state.career.currentSeason?.competitions.length).toBeGreaterThan(0);
    expect(state.career.nextMatch).toBeDefined();

    // Step 3: Training Plan
    state = gameReducer(state, {
      type: 'SET_TRAINING_PLAN',
      payload: { focus: 'FINISHING', intensity: 'HIGH' }
    });
    expect(state.player.trainingPlan?.focus).toBe('FINISHING');

    // Step 4: Advance Season (Week by Week) & Check Matches / Stats
    const initialSeason = state.career.season;
    let playedMatchesCount = 0;

    for (let w = 1; w <= 52; w++) {
      const weekBefore = state.career.week;
      state = advanceWeekLogic(state);

      if (state.phase === 'EVENT') {
        const activeEventId = state.narrative.activeEvents[0];
        state = gameReducer(state, {
          type: 'RESOLVE_EVENT',
          payload: { eventId: activeEventId, optionId: 'opt_1' }
        });
      }

      if (state.phase === 'POST_MATCH') {
        playedMatchesCount++;
        state = { ...state, phase: 'HUB' };
      }

      assertNoNaNOrInfinity(state);
      assertValidPlayerAttributes(state);
    }

    // Step 5: Verify Season Transition
    expect(state.career.season).toBe(initialSeason + 1);
    expect(state.career.history.length).toBe(1);
    const seasonRecord = state.career.history[0];
    expect(seasonRecord.year).toBe(2024);
    expect(seasonRecord.clubId).toBe(chosenClub.id);
    expect(seasonRecord.matchesPlayed).toBeGreaterThan(0);
    expect(seasonRecord.avgRating).toBeGreaterThanOrEqual(0);

    // Step 6: Transfer Scenarios (Accept & Reject)
    const transferEngine = new TransferEngine(999);
    
    // Scenario A: Reject Proposal
    const proposal1 = transferEngine.createProposal(state, ALL_CLUBS[1].id);
    if (proposal1) {
      state.career.transferState = {
        isTransferRequested: true,
        isListed: true,
        activeProposals: [proposal1]
      };
      state = transferEngine.rejectProposal(state, proposal1.id);
      expect(state.career.transferState.activeProposals[0].status).toBe('rejected');
      expect(state.career.currentClub?.id).toBe(chosenClub.id); // Unchanged
    }

    // Scenario B: Accept Proposal
    const proposal2 = transferEngine.createProposal(state, ALL_CLUBS[2].id);
    if (proposal2) {
      state.career.transferState = {
        isTransferRequested: true,
        isListed: true,
        activeProposals: [proposal2]
      };
      state = transferEngine.acceptProposal(state, proposal2.id);
      expect(state.career.currentClub?.id).toBe(ALL_CLUBS[2].id);
      expect(state.career.transfers.length).toBeGreaterThan(0);
      expect(state.career.contract?.salary).toBe(proposal2.offerSalary);
    }

    // Step 7: Save & Load Persistence
    const slotId = 'integration_slot_1';
    state.saveSlot = slotId;
    saveService.saveGame(slotId, state);

    const reloadedState = saveService.loadGame(slotId);
    expect(reloadedState).not.toBeNull();
    if (reloadedState) {
      expect(reloadedState.player.name).toBe('Test Phenomenon');
      expect(reloadedState.career.currentClub?.id).toBe(state.career.currentClub?.id);
      expect(reloadedState.career.history.length).toBe(state.career.history.length);
      assertNoNaNOrInfinity(reloadedState);
    }

    // Step 8: Retirement & Museum / Hall of Fame
    state = gameReducer(state, { type: 'CHANGE_PHASE', payload: 'RETIREMENT' });
    expect(state.phase).toBe('RETIREMENT');

    const legacyState = LegacyEngine.calculateLegacy(state.career.history);
    expect(legacyState.score.totalGoatScore).toBeGreaterThanOrEqual(0);
    expect(legacyState.summary.totalMatches).toBe(seasonRecord.matchesPlayed);
    expect(legacyState.summary.totalGoals).toBe(seasonRecord.goals);
    expect(legacyState.hallOfFameLevel).toBeDefined();
  });

  test('4. Stress Test: 5-Season Career Simulation with Multiple Save/Load Cycles', () => {
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: 'INITIALIZE_PLAYER',
      payload: { name: 'Five Season Pro', position: 'CAM', age: 17 }
    });
    state = gameReducer(state, {
      type: 'SETUP_CAREER',
      payload: { club: STARTER_CLUBS[0] }
    });

    const slotId = 'stress_5_seasons';
    state.saveSlot = slotId;

    const saveSizes: number[] = [];

    for (let season = 1; season <= 5; season++) {
      for (let week = 1; week <= 52; week++) {
        state = advanceWeekLogic(state);
        if (state.phase === 'EVENT') {
          state = gameReducer(state, {
            type: 'RESOLVE_EVENT',
            payload: { eventId: state.narrative.activeEvents[0], optionId: 'opt_1' }
          });
        }
        if (state.phase === 'POST_MATCH' || state.phase === 'TRANSFERS') {
          state = { ...state, phase: 'HUB' };
        }
      }

      // Save and reload every season
      saveService.saveGame(slotId, state);
      const exportedJson = saveService.exportSave(slotId);
      expect(exportedJson).not.toBeNull();
      if (exportedJson) {
        saveSizes.push(exportedJson.length);
      }

      const reloaded = saveService.loadGame(slotId);
      expect(reloaded).not.toBeNull();
      if (reloaded) {
        state = reloaded;
      }

      assertNoNaNOrInfinity(state);
      assertValidPlayerAttributes(state);
    }

    expect(state.career.history.length).toBe(5);
    expect(state.player.age).toBe(22); // Started 17 + 5 years

    // Memory / Save payload size check
    const avgSaveSize = saveSizes.reduce((a, b) => a + b, 0) / saveSizes.length;
    expect(avgSaveSize).toBeLessThan(1_000_000); // Must be reasonable (< 1MB)
  });

  test('5. Stress Test: 10-Season Full Career Simulation & Retirement Legacy', () => {
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: 'INITIALIZE_PLAYER',
      payload: { name: 'Decade GOAT', position: 'ST', age: 17 }
    });
    state = gameReducer(state, {
      type: 'SETUP_CAREER',
      payload: { club: STARTER_CLUBS[0] }
    });

    let totalWeeks = 0;
    const maxWeeks = 10 * 52;

    while (totalWeeks < maxWeeks) {
      state = advanceWeekLogic(state);
      totalWeeks++;

      if (state.phase === 'EVENT') {
        state = gameReducer(state, {
          type: 'RESOLVE_EVENT',
          payload: { eventId: state.narrative.activeEvents[0], optionId: 'opt_1' }
        });
      }
      if (state.phase === 'POST_MATCH' || state.phase === 'TRANSFERS') {
        state = { ...state, phase: 'HUB' };
      }
    }

    expect(state.career.history.length).toBe(10);
    expect(state.player.age).toBe(27);

    // Assert integrity across entire 10 seasons
    assertNoNaNOrInfinity(state);
    assertValidPlayerAttributes(state);

    // Calculate Legacy
    const legacy = LegacyEngine.calculateLegacy(state.career.history);
    expect(legacy.score.totalGoatScore).toBeGreaterThan(0);
    expect(legacy.events.length).toBeGreaterThan(0);
    expect(legacy.summary.yearsActive).toBe(10);
  });

  test('6. Invariant Checks: Calendar, Standings, Club & Contract Consistency', () => {
    let state = createInitialGameState();
    state = gameReducer(state, {
      type: 'INITIALIZE_PLAYER',
      payload: { name: 'Invariant Legend', position: 'CB', age: 18 }
    });
    const starterClub = STARTER_CLUBS[1] || STARTER_CLUBS[0];
    state = gameReducer(state, {
      type: 'SETUP_CAREER',
      payload: { club: starterClub }
    });

    const seasonComp = state.career.currentSeason?.competitions[0];
    expect(seasonComp).toBeDefined();
    if (seasonComp) {
      // Standings team count must match league team count
      expect(seasonComp.standings.length).toBe(seasonComp.teams.length);

      // Check fixture validity: home != away
      for (const fix of seasonComp.fixtures) {
        expect(fix.homeTeamId).not.toBe(fix.awayTeamId);
        expect(seasonComp.teams).toContain(fix.homeTeamId);
        expect(seasonComp.teams).toContain(fix.awayTeamId);
      }
    }

    // Advance 10 weeks
    for (let i = 0; i < 10; i++) {
      state = advanceWeekLogic(state);
      if (state.phase === 'EVENT') {
        state = gameReducer(state, {
          type: 'RESOLVE_EVENT',
          payload: { eventId: state.narrative.activeEvents[0], optionId: 'opt_1' }
        });
      }
      if (state.phase === 'POST_MATCH') state = { ...state, phase: 'HUB' };
    }

    // Verify standings math
    const updatedComp = state.career.currentSeason?.competitions[0];
    if (updatedComp) {
      for (const standing of updatedComp.standings) {
        expect(standing.points).toBe(standing.wins * 3 + standing.draws);
        expect(standing.played).toBe(standing.wins + standing.draws + standing.losses);
        expect(standing.goalDifference).toBe(standing.goalsFor - standing.goalsAgainst);
      }
    }
  });
});
