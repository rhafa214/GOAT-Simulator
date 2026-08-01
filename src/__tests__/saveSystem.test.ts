import { describe, it, expect, beforeEach } from 'vitest';
import { SaveGameService, LocalStorageSaveRepository, SaveFile } from '../core/domain/saveSystem';
import { createInitialGameState } from '../core/state/initialState';
import { GameState } from '../types';

// Mock localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(i: number) {
      const keys = Object.keys(store);
      return keys[i] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SaveGameService & LocalStorageSaveRepository', () => {
  let repository: LocalStorageSaveRepository;
  let service: SaveGameService;
  
  beforeEach(() => {
    window.localStorage.clear();
    repository = new LocalStorageSaveRepository();
    service = new SaveGameService(repository);
  });

  it('should save and load a game state successfully', () => {
    const initialState = createInitialGameState();
    initialState.player.name = 'Test Player';
    
    service.saveGame('slot1', initialState);
    const loaded = service.loadGame('slot1');
    
    expect(loaded).toBeDefined();
    expect(loaded?.player.name).toBe('Test Player');
  });

  it('should list available saves', () => {
    const state1 = createInitialGameState({ player: { ...createInitialGameState().player, name: 'Player One' } });
    const state2 = createInitialGameState({ player: { ...createInitialGameState().player, name: 'Player Two' } });
    
    service.saveGame('slot1', state1);
    service.saveGame('slot2', state2);
    
    const saves = service.getAvailableSaves();
    expect(saves.length).toBe(2);
    // Should be sorted by lastUpdated descending, so slot2 should be first typically 
    // depending on the execution time. But definitely 2 saves.
    expect(saves.some(s => s.playerName === 'Player One')).toBe(true);
    expect(saves.some(s => s.playerName === 'Player Two')).toBe(true);
  });

  it('should delete a save', () => {
    service.saveGame('slot1', createInitialGameState());
    expect(service.getAvailableSaves().length).toBe(1);
    
    service.deleteSave('slot1');
    expect(service.getAvailableSaves().length).toBe(0);
  });

  it('should handle missing saves gracefully', () => {
    const loaded = service.loadGame('non_existent_slot');
    expect(loaded).toBeNull();
  });

  it('should export and import save JSON', () => {
    const state = createInitialGameState();
    state.player.name = 'Exported Player';
    
    service.saveGame('slot1', state);
    const exportedJson = service.exportSave('slot1');
    
    expect(typeof exportedJson).toBe('string');
    
    // Clear and import
    window.localStorage.clear();
    if (exportedJson) {
      service.importSave('slot2', exportedJson);
    }
    
    const loaded = service.loadGame('slot2');
    expect(loaded?.player.name).toBe('Exported Player');
  });

  it('should fail to import invalid JSON', () => {
    expect(() => {
      service.importSave('slot1', '{"invalid": true}');
    }).toThrow(/Invalid save data format/);
    
    expect(() => {
      service.importSave('slot1', 'not json');
    }).toThrow(/Invalid save data format/);
  });

  it('should reject corrupted save on load', () => {
    // Manually insert corrupted data
    window.localStorage.setItem('football_sim_save_slot_corrupted', '{"version":1,"metadata":{},"data":{"player": "not_an_object"}}');
    
    expect(() => {
      service.loadGame('slot_corrupted');
    }).toThrow(/Corrupted save file/);
  });
});
