import { ClubAppearance } from './types';

class Registry {
  private clubs: Map<string, ClubAppearance> = new Map();

  register(appearance: ClubAppearance) {
    this.clubs.set(appearance.clubId, appearance);
  }

  get(clubId: string): ClubAppearance | undefined {
    return this.clubs.get(clubId);
  }

  clear() {
    this.clubs.clear();
  }
}

// Singleton registry to avoid giant switch statements
export const ClubAppearanceRegistry = new Registry();
