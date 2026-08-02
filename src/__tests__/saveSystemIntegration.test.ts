import { describe, it, expect, beforeEach } from 'vitest';
import { SaveGameService, LocalStorageSaveRepository, CURRENT_SCHEMA_VERSION } from '../core/domain/saveSystem';
import { createInitialGameState } from '../core/state/initialState';
import { gameReducer } from '../core/state/reducers';
import { GameState, Club, MatchStats, NewsItem, TransferProposal } from '../types';

// Mock localStorage
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem(key: string) {
    return localStorageStore[key] || null;
  },
  setItem(key: string, value: string) {
    localStorageStore[key] = value.toString();
  },
  removeItem(key: string) {
    delete localStorageStore[key];
  },
  clear() {
    for (const key of Object.keys(localStorageStore)) {
      delete localStorageStore[key];
    }
  },
  get length() {
    return Object.keys(localStorageStore).length;
  },
  key(i: number) {
    return Object.keys(localStorageStore)[i] || null;
  }
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Save System Integration & Robustness Tests', () => {
  let repository: LocalStorageSaveRepository;
  let service: SaveGameService;

  beforeEach(() => {
    localStorageMock.clear();
    repository = new LocalStorageSaveRepository();
    service = new SaveGameService(repository);
  });

  it('completes a full career lifecycle: start -> draft -> club -> matches -> event -> news -> proposal -> progression -> save -> reload -> continue', () => {
    // 1. Initiate Career
    let state: GameState = createInitialGameState();
    state = gameReducer(state, {
      type: 'INITIALIZE_PLAYER',
      payload: { name: 'Lucas Silva', age: 18, position: 'ST' }
    });
    expect(state.player.name).toBe('Lucas Silva');

    // 2. Conclude Draft
    state = gameReducer(state, { type: 'INIT_DRAFT', payload: { mode: 'QUICK', seed: 999 } });
    if (state.draftState && state.draftState.rounds.length > 0) {
      const firstOption = state.draftState.rounds[0].options[0];
      if (firstOption) {
        state = gameReducer(state, { type: 'SELECT_DRAFT_OPTION', payload: firstOption.idolId });
      }
    }
    state = gameReducer(state, { type: 'COMPLETE_DRAFT' });
    expect(state.phase).toBe('MAIN_MENU');

    // 3. Choose Club
    const testClub: Club = {
      id: 'flamengo',
      name: 'Flamengo',
      tier: 1,
      reputation: 85,
      baseSalary: 20000,
      league: 'Brasileirão',
      primaryColor: '#FF0000'
    };
    state = gameReducer(state, { type: 'SETUP_CAREER', payload: { club: testClub } });
    expect(state.career.currentClub?.name).toBe('Flamengo');

    // 4. Simulate Matches
    const match1: MatchStats = {
      id: 'match_w1',
      week: 1,
      year: 2024,
      competition: 'Brasileirão',
      opponent: 'Vasco',
      home: true,
      minutesPlayed: 90,
      goals: 2,
      assists: 1,
      shots: 5,
      passes: 30,
      passAccuracy: 85,
      rating: 8.8,
      motm: true,
      injured: false,
      wasCaptain: false
    };
    state = gameReducer(state, { type: 'PLAY_MATCH', payload: match1 });
    expect(state.career.matches.length).toBe(1);
    expect(state.career.currentSeasonStats.goals).toBe(2);

    // 5. Generate Event
    state.narrative.activeEvents = ['press_conference_1'];
    state.narrative.eventHistory['press_conference_1'] = 1;

    // 6. Generate News
    const newsItem: Omit<NewsItem, 'id'> = {
      headline: 'Lucas Silva brilha na estreia!',
      summary: 'Atacante marcou 2 gols contra o Vasco.',
      date: '2024-01-10',
      week: 1,
      year: 2024,
      category: 'partida',
      relatedEntities: ['Lucas Silva', 'Flamengo'],
      importance: 8,
      source: 'Globo Esporte'
    };
    state = gameReducer(state, { type: 'ADD_NEWS', payload: newsItem });
    expect(state.narrative.news.length).toBe(1);

    // 7. Generate Transfer Proposal
    const proposal: TransferProposal = {
      id: 'prop_real',
      clubId: 'real_madrid',
      clubName: 'Real Madrid',
      offerSalary: 100000,
      offerDuration: 4,
      expectedRole: 'Star',
      negotiationRounds: 1,
      transferFee: 50000000,
      status: 'presented',
      weekGenerated: 1,
      yearGenerated: 2024
    };
    if (!state.career.transferState) {
      state.career.transferState = { isTransferRequested: false, isListed: true, activeProposals: [] };
    }
    state.career.transferState.activeProposals.push(proposal);

    // 8. Advance Progression & Training
    state = gameReducer(state, { type: 'TRAIN_ATTRIBUTE', payload: 'SHO' });
    const shoStat = state.player.technical.SHO;

    // 9. Save Game
    const slotId = 'career_slot_test';
    service.saveGame(slotId, state);

    // 10. Reload Game
    const loadedState = service.loadGame(slotId);
    expect(loadedState).not.toBeNull();
    if (!loadedState) return;

    // 11. Compare Important State
    expect(loadedState.player.name).toBe('Lucas Silva');
    expect(loadedState.career.currentClub?.name).toBe('Flamengo');
    expect(loadedState.career.matches.length).toBe(1);
    expect(loadedState.career.matches[0].opponent).toBe('Vasco');
    expect(loadedState.narrative.news.length).toBe(1);
    expect(loadedState.narrative.news[0].headline).toBe('Lucas Silva brilha na estreia!');
    expect(loadedState.career.transferState?.activeProposals.length).toBe(1);
    expect(loadedState.career.transferState?.activeProposals[0].clubName).toBe('Real Madrid');
    expect(loadedState.player.technical.SHO).toBe(shoStat);

    // 12. Continue Career After Loading
    const match2: MatchStats = {
      id: 'match_w2',
      week: 2,
      year: 2024,
      competition: 'Brasileirão',
      opponent: 'Fluminense',
      home: false,
      minutesPlayed: 90,
      goals: 1,
      assists: 0,
      shots: 3,
      passes: 25,
      passAccuracy: 80,
      rating: 7.5,
      motm: false,
      injured: false,
      wasCaptain: false
    };
    const continuedState = gameReducer(loadedState, { type: 'PLAY_MATCH', payload: match2 });

    // 13. Validate No Double Counting
    expect(continuedState.career.matches.length).toBe(2);
    expect(continuedState.career.currentSeasonStats.goals).toBe(3); // 2 + 1
    expect(continuedState.career.currentSeasonStats.matchesPlayed).toBe(2);
  });

  it('recovers safely from corrupted primary save using backup slot', () => {
    const validState = createInitialGameState();
    validState.player.name = 'Backup Hero';
    const slotId = 'backup_recovery_slot';

    // Save valid state to create primary and backup
    service.saveGame(slotId, validState);

    // Corrupt primary key intentionally
    localStorageMock.setItem(`football_sim_save_${slotId}`, '{"corrupted": true, INVALID JSON');

    // Load game should fallback to backup smoothly
    const recovered = service.loadGame(slotId);
    expect(recovered).not.toBeNull();
    expect(recovered?.player.name).toBe('Backup Hero');
  });

  it('rejects completely unrecoverable corrupted saves without crashing application', () => {
    const slotId = 'completely_corrupted';
    localStorageMock.setItem(`football_sim_save_${slotId}`, '{"version": 1, "data": "not_an_object"}');
    localStorageMock.setItem(`football_sim_save_backup_${slotId}`, 'invalid backup string');

    expect(() => {
      service.loadGame(slotId);
    }).toThrow(/Corrupted save file/);
  });

  it('migrates older schema version 1 to current schema version 2 cleanly', () => {
    const slotId = 'old_schema_slot';
    const oldSaveFile = {
      version: 1,
      metadata: {
        id: slotId,
        lastUpdated: new Date().toISOString(),
        playerName: 'Old Schema Player',
        clubName: 'Santos',
        season: 1,
        age: 17
      },
      data: {
        phase: 'HUB',
        player: {
          name: 'Old Schema Player',
          age: 17
          // Missing technical, rpg, relationships, appearance, progression
        },
        career: {
          week: 5,
          season: 1,
          year: 2024
          // Missing history, matches, transfers, awards, transferState
        },
        finances: {
          balance: 5000
          // Missing weeklyWage, sponsors, assets
        },
        narrative: {
          // Missing activeEvents, flags, news, eventHistory
        }
      }
    };

    localStorageMock.setItem(`football_sim_save_${slotId}`, JSON.stringify(oldSaveFile));

    const migratedState = service.loadGame(slotId);
    expect(migratedState).not.toBeNull();
    if (!migratedState) return;

    expect(migratedState.player.technical.SHO).toBeDefined();
    expect(migratedState.player.rpg.morale).toBeDefined();
    expect(migratedState.career.awards.ballonDor).toBe(0);
    expect(migratedState.finances.sponsors).toEqual([]);
    expect(migratedState.narrative.activeEvents).toEqual([]);
  });

  it('handles non-existent slots gracefully', () => {
    const loaded = service.loadGame('ghost_slot_99');
    expect(loaded).toBeNull();
  });

  it('deletes primary and backup keys on slot deletion', () => {
    const slotId = 'delete_me';
    const state = createInitialGameState();
    service.saveGame(slotId, state);

    expect(localStorageMock.getItem(`football_sim_save_${slotId}`)).not.toBeNull();
    service.deleteSave(slotId);

    expect(localStorageMock.getItem(`football_sim_save_${slotId}`)).toBeNull();
    expect(localStorageMock.getItem(`football_sim_save_backup_${slotId}`)).toBeNull();
  });

  it('supports exporting and importing save JSON cleanly', () => {
    const state = createInitialGameState();
    state.player.name = 'Export Import Star';
    const sourceSlot = 'source_slot';
    const targetSlot = 'target_slot';

    service.saveGame(sourceSlot, state);
    const jsonExport = service.exportSave(sourceSlot);
    expect(jsonExport).toBeDefined();

    if (jsonExport) {
      service.importSave(targetSlot, jsonExport);
    }

    const importedState = service.loadGame(targetSlot);
    expect(importedState?.player.name).toBe('Export Import Star');
  });
});
