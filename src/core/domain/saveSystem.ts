import { GameState } from '../../types';

export interface SaveMetadata {
  id: string; // The slot id, e.g., 'slot1'
  lastUpdated: string; // ISO date string
  playerName: string;
  clubName: string;
  season: number;
  age: number;
  overall?: number;
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

export function sanitizeStateForSave(state: GameState): GameState {
  const seen = new WeakSet();
  const jsonString = JSON.stringify(state, (key, value) => {
    if (typeof value === 'function' || value instanceof Promise) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined; // Break circular reference
      }
      seen.add(value);
    }
    if (key.startsWith('__') || key === 'transientUI' || key === 'modalState') {
      return undefined;
    }
    return value;
  });

  return JSON.parse(jsonString) as GameState;
}

export class LocalStorageSaveRepository implements SaveRepository {
  private readonly PREFIX = 'football_sim_save_';
  private readonly BACKUP_PREFIX = 'football_sim_save_backup_';

  private getSlotKey(slotId: string): string {
    return `${this.PREFIX}${slotId}`;
  }

  private getBackupKey(slotId: string): string {
    return `${this.BACKUP_PREFIX}${slotId}`;
  }

  private isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }

  save(slotId: string, saveData: SaveFile): void {
    const slotKey = this.getSlotKey(slotId);
    const backupKey = this.getBackupKey(slotId);

    try {
      const json = JSON.stringify(saveData);

      // Create backup of existing save if present, or save initial backup
      const existing = localStorage.getItem(slotKey);
      if (existing) {
        localStorage.setItem(backupKey, existing);
      } else {
        localStorage.setItem(backupKey, json);
      }

      localStorage.setItem(slotKey, json);
    } catch (e) {
      console.error(`Failed to save slot ${slotId}`, e);
      throw new Error(`Save operation failed for slot ${slotId}: ${e instanceof Error ? e.message : 'Storage error'}`);
    }
  }

  load(slotId: string): SaveFile | null {
    const slotKey = this.getSlotKey(slotId);
    const backupKey = this.getBackupKey(slotId);

    const primaryJson = localStorage.getItem(slotKey);
    const backupJson = localStorage.getItem(backupKey);

    if (!primaryJson && !backupJson) {
      return null; // Slot does not exist
    }

    // Try primary slot JSON parse first
    if (primaryJson) {
      try {
        const parsed = JSON.parse(primaryJson) as SaveFile;
        // If parsed correctly, return it so SaveGameService can migrate/validate or report corruption
        return parsed;
      } catch (e) {
        console.warn(`Primary save slot ${slotId} is invalid JSON. Trying backup...`, e);
      }
    }

    // Fallback to backup slot
    if (backupJson) {
      try {
        const parsedBackup = JSON.parse(backupJson) as SaveFile;
        console.info(`Successfully restored slot ${slotId} from backup.`);
        localStorage.setItem(slotKey, backupJson);
        return parsedBackup;
      } catch (e) {
        console.error(`Backup save for slot ${slotId} is also invalid JSON.`, e);
      }
    }

    // Both existed (or primary existed) but failed JSON parsing
    throw new Error('Corrupted save file: Storage data cannot be parsed as JSON');
  }

  delete(slotId: string): void {
    localStorage.removeItem(this.getSlotKey(slotId));
    localStorage.removeItem(this.getBackupKey(slotId));
  }

  list(): SaveMetadata[] {
    const saves: SaveMetadata[] = [];
    const processedIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX) && !key.startsWith(this.BACKUP_PREFIX)) {
        const slotId = key.replace(this.PREFIX, '');
        if (processedIds.has(slotId)) continue;

        try {
          const json = localStorage.getItem(key);
          if (json) {
            const saveFile = JSON.parse(json) as SaveFile;
            if (saveFile && saveFile.metadata) {
              saves.push(saveFile.metadata);
              processedIds.add(slotId);
            } else if (saveFile && saveFile.data && this.isObject(saveFile.data)) {
              // Infer metadata if metadata field was missing
              const inferred: SaveMetadata = {
                id: slotId,
                lastUpdated: new Date().toISOString(),
                playerName: saveFile.data.player?.name || 'Jogador',
                clubName: saveFile.data.career?.currentClub?.name || 'Sem Clube',
                season: saveFile.data.career?.season || 1,
                age: saveFile.data.player?.age || 17
              };
              saves.push(inferred);
              processedIds.add(slotId);
            }
          }
        } catch (e) {
          // Attempt to read backup metadata for listing
          const backupKey = this.getBackupKey(slotId);
          const backupJson = localStorage.getItem(backupKey);
          if (backupJson) {
            try {
              const saveFile = JSON.parse(backupJson) as SaveFile;
              if (saveFile && saveFile.metadata) {
                saves.push(saveFile.metadata);
                processedIds.add(slotId);
              }
            } catch (err) {
              // Skip completely unrecoverable key
            }
          }
        }
      }
    }
    return saves.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }

  exportJson(slotId: string): string | null {
    const primary = localStorage.getItem(this.getSlotKey(slotId));
    if (primary) return primary;
    return localStorage.getItem(this.getBackupKey(slotId));
  }

  importJson(slotId: string, json: string): void {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || !('data' in parsed)) {
        throw new Error('Invalid save file structure. Must contain "version" and "data".');
      }
      this.save(slotId, parsed as SaveFile);
    } catch (e) {
      console.error(`Failed to import JSON to slot ${slotId}`, e);
      throw e;
    }
  }
}

export const CURRENT_SCHEMA_VERSION = 2;

export class SaveGameService {
  constructor(private repository: SaveRepository) {}

  public saveGame(slotId: string, state: GameState): void {
    const sanitizedState = sanitizeStateForSave(state);

    const metadata: SaveMetadata = {
      id: slotId,
      lastUpdated: new Date().toISOString(),
      playerName: sanitizedState.player?.name || 'Jogador',
      clubName: sanitizedState.career?.currentClub?.name || 'Sem Clube',
      season: sanitizedState.career?.season || 1,
      age: sanitizedState.player?.age || 17,
      overall: (sanitizedState.player as any)?.overall || 75
    };

    const saveFile: SaveFile = {
      version: CURRENT_SCHEMA_VERSION,
      metadata,
      data: sanitizedState
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
      const parsed = JSON.parse(json) as unknown;
      if (!this.isObject(parsed)) throw new Error("Imported JSON must be an object");
      if (!('data' in parsed) && !('version' in parsed)) {
        throw new Error("Missing required 'data' or 'version' fields");
      }
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

    const file = rawData as Record<string, unknown>;
    let currentVersion = typeof file.version === 'number' ? file.version : 0;

    if ('data' in file && !this.isObject(file.data)) {
      throw new Error('Save file payload is corrupted or not an object');
    }
    
    let dataObj = this.isObject(file.data) ? (file.data as Record<string, unknown>) : {};

    // Validate presence of non-object primitives in major slices
    if ('player' in dataObj && dataObj.player !== undefined && !this.isObject(dataObj.player)) {
      throw new Error('Player payload is corrupted');
    }
    if ('career' in dataObj && dataObj.career !== undefined && !this.isObject(dataObj.career)) {
      throw new Error('Career payload is corrupted');
    }
    if ('finances' in dataObj && dataObj.finances !== undefined && !this.isObject(dataObj.finances)) {
      throw new Error('Finances payload is corrupted');
    }
    if ('narrative' in dataObj && dataObj.narrative !== undefined && !this.isObject(dataObj.narrative)) {
      throw new Error('Narrative payload is corrupted');
    }

    // Migration to Schema Version 1 & Version 2
    if (currentVersion < 2) {
      // Ensure player sub-structures exist
      const player = this.isObject(dataObj.player) ? (dataObj.player as Record<string, unknown>) : {};
      player.name = typeof player.name === 'string' ? player.name : 'Jogador';
      player.age = typeof player.age === 'number' ? player.age : 17;
      player.position = typeof player.position === 'string' ? player.position : 'ST';
      player.nationality = typeof player.nationality === 'string' ? player.nationality : 'Brasil';
      player.personality = typeof player.personality === 'string' ? player.personality : 'PROFESSIONAL';
      player.avatarUrl = typeof player.avatarUrl === 'string' ? player.avatarUrl : '';

      if (!this.isObject(player.technical)) {
        player.technical = {
          PAC: 70, SHO: 70, PAS: 70, DRI: 70, DEF: 50, PHY: 70,
          HEA: 60, VIS: 60, WF: 3, SM: 3, CON: 70, ACC: 70, STA: 70, JUM: 60, FK: 60, PEN: 60, CRE: 60
        };
      }
      if (!this.isObject(player.rpg)) {
        player.rpg = { morale: 80, fitness: 100, fame: 10, fans: 100, LDR: 50, DET: 70, COM: 50 };
      }
      if (!this.isObject(player.relationships)) {
        player.relationships = { fans: 50, manager: 50, press: 50, squad: 50 };
      }
      if (!this.isObject(player.appearance)) {
        player.appearance = {
          skinColor: '#f1c27d', hairStyle: 'curto', hairColor: '#000000',
          facialHair: 'nenhum', facialHairColor: '#000000', eyes: 'castanho',
          mouth: 'padrao', nose: 'padrao', accessories: 'nenhum', tattoos: 'nenhum',
          height: 178, weight: 75, physique: 'Atlética', boots: 'preto',
          sleeves: 'Curtas', gloves: false, celebration: 'padrao'
        };
      }
      if (!this.isObject(player.progression)) {
        player.progression = {
          developmentPoints: {},
          temporaryForm: 0,
          potential: 85,
          consistency: 12,
          growthCurve: 'NORMAL',
          peakAge: 27,
          declineAge: 32,
          milestones: []
        };
      }
      dataObj.player = player;

      // Ensure career sub-structures exist
      const career = this.isObject(dataObj.career) ? (dataObj.career as Record<string, unknown>) : {};
      career.week = typeof career.week === 'number' ? career.week : 1;
      career.season = typeof career.season === 'number' ? career.season : 1;
      career.year = typeof career.year === 'number' ? career.year : 2024;
      career.shirtNumber = typeof career.shirtNumber === 'number' ? career.shirtNumber : 9;
      career.isCaptain = typeof career.isCaptain === 'boolean' ? career.isCaptain : false;
      career.nationalTeam = typeof career.nationalTeam === 'string' ? career.nationalTeam : null;
      career.history = Array.isArray(career.history) ? career.history : [];
      career.transfers = Array.isArray(career.transfers) ? career.transfers : [];
      career.matches = Array.isArray(career.matches) ? career.matches : [];
      
      if (!this.isObject(career.transferState)) {
        career.transferState = { isTransferRequested: false, isListed: false, activeProposals: [] };
      }
      if (!this.isObject(career.awards)) {
        career.awards = { ballonDor: 0, goldenBoot: 0, toty: 0, motm: 0 };
      }
      if (!this.isObject(career.currentSeasonStats)) {
        career.currentSeasonStats = {
          year: career.year as number,
          clubId: (career.currentClub as Record<string, unknown> | undefined)?.id as string || 'none',
          clubName: (career.currentClub as Record<string, unknown> | undefined)?.name as string || 'Sem Clube',
          shirtNumber: career.shirtNumber as number,
          salary: 10000,
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
          competitions: [],
          trophies: [],
          awards: []
        };
      }
      dataObj.career = career;

      // Ensure finances exist
      const finances = this.isObject(dataObj.finances) ? (dataObj.finances as Record<string, unknown>) : {};
      finances.balance = typeof finances.balance === 'number' ? finances.balance : 10000;
      finances.weeklyWage = typeof finances.weeklyWage === 'number' ? finances.weeklyWage : 1000;
      finances.sponsors = Array.isArray(finances.sponsors) ? finances.sponsors : [];
      finances.assets = Array.isArray(finances.assets) ? finances.assets : [];
      dataObj.finances = finances;

      // Ensure narrative exists
      const narrative = this.isObject(dataObj.narrative) ? (dataObj.narrative as Record<string, unknown>) : {};
      narrative.activeEvents = Array.isArray(narrative.activeEvents) ? narrative.activeEvents : [];
      narrative.flags = this.isObject(narrative.flags) ? narrative.flags : {};
      narrative.news = Array.isArray(narrative.news) ? narrative.news : [];
      narrative.eventHistory = this.isObject(narrative.eventHistory) ? narrative.eventHistory : {};
      dataObj.narrative = narrative;

      // Ensure phase exists
      dataObj.phase = typeof dataObj.phase === 'string' ? dataObj.phase : 'HUB';

      currentVersion = 2;
    }

    const metadata: SaveMetadata = this.isObject(file.metadata)
      ? (file.metadata as unknown as SaveMetadata)
      : {
          id: 'unknown_slot',
          lastUpdated: new Date().toISOString(),
          playerName: (dataObj.player as Record<string, unknown>)?.name as string || 'Jogador',
          clubName: ((dataObj.career as Record<string, unknown>)?.currentClub as Record<string, unknown>)?.name as string || 'Sem Clube',
          season: (dataObj.career as Record<string, unknown>)?.season as number || 1,
          age: (dataObj.player as Record<string, unknown>)?.age as number || 17
        };

    return {
      version: currentVersion,
      metadata,
      data: dataObj as unknown as GameState
    };
  }

  private validate(data: unknown): asserts data is GameState {
    if (!this.isObject(data)) {
      throw new Error('GameState must be an object');
    }

    const state = data as Record<string, unknown>;

    if (typeof state.phase !== 'string') throw new Error('Invalid phase in save data');
    
    // Validate player
    if (!this.isObject(state.player)) throw new Error('Invalid player object');
    const player = state.player as Record<string, unknown>;
    if (typeof player.name !== 'string') throw new Error('Player must have a string name');
    if (typeof player.age !== 'number') throw new Error('Player must have a numeric age');
    if (!this.isObject(player.technical)) throw new Error('Player must have technical stats object');
    if (!this.isObject(player.rpg)) throw new Error('Player must have rpg stats object');
    if (!this.isObject(player.relationships)) throw new Error('Player must have relationships object');
    if (!this.isObject(player.appearance)) throw new Error('Player must have appearance object');

    // Validate career
    if (!this.isObject(state.career)) throw new Error('Invalid career object');
    const career = state.career as Record<string, unknown>;
    if (typeof career.week !== 'number') throw new Error('Career week must be a number');
    if (typeof career.season !== 'number') throw new Error('Career season must be a number');
    if (typeof career.year !== 'number') throw new Error('Career year must be a number');
    if (!Array.isArray(career.history)) throw new Error('Career history must be an array');
    if (!Array.isArray(career.matches)) throw new Error('Career matches must be an array');
    if (!Array.isArray(career.transfers)) throw new Error('Career transfers must be an array');
    if (!this.isObject(career.awards)) throw new Error('Career awards must be an object');

    // Validate finances
    if (!this.isObject(state.finances)) throw new Error('Invalid finances object');
    const finances = state.finances as Record<string, unknown>;
    if (typeof finances.balance !== 'number') throw new Error('Finances balance must be a number');
    if (typeof finances.weeklyWage !== 'number') throw new Error('Finances weeklyWage must be a number');
    if (!Array.isArray(finances.sponsors)) throw new Error('Finances sponsors must be an array');
    if (!Array.isArray(finances.assets)) throw new Error('Finances assets must be an array');

    // Validate narrative
    if (!this.isObject(state.narrative)) throw new Error('Invalid narrative object');
    const narrative = state.narrative as Record<string, unknown>;
    if (!Array.isArray(narrative.activeEvents)) throw new Error('Narrative activeEvents must be an array');
    if (!this.isObject(narrative.flags)) throw new Error('Narrative flags must be an object');
    if (!Array.isArray(narrative.news)) throw new Error('Narrative news must be an array');
    if (!this.isObject(narrative.eventHistory)) throw new Error('Narrative eventHistory must be an object');
  }

  private isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === 'object' && val !== null && !Array.isArray(val);
  }
}
