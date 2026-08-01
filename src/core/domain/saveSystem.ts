import { GameState } from '../../types';

export interface SaveMetadata {
  id: string; // The slot id, e.g., 'slot1'
  lastUpdated: string; // ISO date string
  playerName: string;
  clubName: string;
  season: number;
  age: number;
}

export interface SaveFile {
  version: number;
  metadata: SaveMetadata;
  data: GameState;
}

export interface SaveRepository {
  save(slotId: string, saveData: SaveFile): void;
  load(slotId: string): SaveFile | null;
  delete(slotId: string): void;
  list(): SaveMetadata[];
  exportJson(slotId: string): string | null;
  importJson(slotId: string, json: string): void;
}

export class LocalStorageSaveRepository implements SaveRepository {
  private readonly PREFIX = 'football_sim_save_';

  private getSlotKey(slotId: string): string {
    return `${this.PREFIX}${slotId}`;
  }

  save(slotId: string, saveData: SaveFile): void {
    try {
      const json = JSON.stringify(saveData);
      localStorage.setItem(this.getSlotKey(slotId), json);
    } catch (e) {
      console.error(`Failed to save slot ${slotId}`, e);
      throw new Error('Save operation failed');
    }
  }

  load(slotId: string): SaveFile | null {
    try {
      const json = localStorage.getItem(this.getSlotKey(slotId));
      if (!json) return null;
      return JSON.parse(json) as SaveFile;
    } catch (e) {
      console.error(`Failed to load slot ${slotId}`, e);
      return null;
    }
  }

  delete(slotId: string): void {
    localStorage.removeItem(this.getSlotKey(slotId));
  }

  list(): SaveMetadata[] {
    const saves: SaveMetadata[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        try {
          const json = localStorage.getItem(key);
          if (json) {
            const saveFile = JSON.parse(json) as SaveFile;
            if (saveFile && saveFile.metadata) {
              saves.push(saveFile.metadata);
            }
          }
        } catch (e) {
          // Ignore corrupted saves in list
        }
      }
    }
    return saves.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }

  exportJson(slotId: string): string | null {
    return localStorage.getItem(this.getSlotKey(slotId));
  }

  importJson(slotId: string, json: string): void {
    // Basic structural check before saving
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || !('data' in parsed)) {
         throw new Error('Invalid save file structure');
      }
      localStorage.setItem(this.getSlotKey(slotId), json);
    } catch (e) {
      console.error(`Failed to import JSON to slot ${slotId}`, e);
      throw e;
    }
  }
}

const CURRENT_SCHEMA_VERSION = 1;

export class SaveGameService {
  constructor(private repository: SaveRepository) {}

  public saveGame(slotId: string, state: GameState): void {
    const metadata: SaveMetadata = {
      id: slotId,
      lastUpdated: new Date().toISOString(),
      playerName: state.player.name,
      clubName: state.career.currentClub?.name || 'Sem Clube',
      season: state.career.year,
      age: state.player.age
    };

    const saveFile: SaveFile = {
      version: CURRENT_SCHEMA_VERSION,
      metadata,
      data: state
    };

    this.repository.save(slotId, saveFile);
  }

  public loadGame(slotId: string): GameState | null {
    const rawData = this.repository.load(slotId);
    if (!rawData) return null;

    try {
      const migratedData = this.migrate(rawData);
      this.validate(migratedData.data);
      return migratedData.data;
    } catch (e) {
      console.error(`Failed to load or validate save game from slot ${slotId}`, e);
      // Safe recovery from corrupted data can mean throwing a clear error or returning null
      throw new Error(`Corrupted save file: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  public getAvailableSaves(): SaveMetadata[] {
    return this.repository.list();
  }

  public deleteSave(slotId: string): void {
    this.repository.delete(slotId);
  }

  public exportSave(slotId: string): string | null {
    return this.repository.exportJson(slotId);
  }

  public importSave(slotId: string, json: string): void {
    try {
       // Pre-validate before allowing import
       const parsed = JSON.parse(json) as unknown;
       if (!this.isObject(parsed)) throw new Error("Imported JSON must be an object");
       const migrated = this.migrate(parsed as unknown as SaveFile);
       this.validate(migrated.data);
       this.repository.importJson(slotId, JSON.stringify(migrated));
    } catch (e) {
       console.error("Failed to import save", e);
       throw new Error(`Invalid save data format: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  private migrate(rawData: unknown): SaveFile {
    if (!this.isObject(rawData)) {
      throw new Error('Save file is not an object');
    }
    
    // We treat the rawData as a potential SaveFile, let's cast it safely
    // Since we can't use `any`, we assert properties
    const file = rawData as Record<string, unknown>;
    
    let currentVersion = typeof file.version === 'number' ? file.version : 0;
    let data = file.data as Record<string, unknown>;
    
    // Example migration pattern
    if (currentVersion < 1) {
       // Perform migrations to version 1
       // e.g. adding missing fields
       currentVersion = 1;
    }
    
    return {
      version: currentVersion,
      metadata: file.metadata as SaveMetadata, // Trust metadata for now, ideally validate it too
      data: data as unknown as GameState
    };
  }

  private validate(data: unknown): asserts data is GameState {
    if (!this.isObject(data)) {
      throw new Error('GameState must be an object');
    }
    
    const state = data as Record<string, unknown>;
    
    if (typeof state.phase !== 'string') throw new Error('Invalid phase');
    if (!this.isObject(state.player)) throw new Error('Invalid player');
    if (!this.isObject(state.career)) throw new Error('Invalid career');
    if (!this.isObject(state.finances)) throw new Error('Invalid finances');
    if (!this.isObject(state.narrative)) throw new Error('Invalid narrative');
    
    // Minimal deep validation (can be expanded)
    const player = state.player as Record<string, unknown>;
    if (typeof player.name !== 'string') throw new Error('Player must have a string name');
    if (typeof player.age !== 'number') throw new Error('Player must have a numeric age');
  }

  private isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }
}
