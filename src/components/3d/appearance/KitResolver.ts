import { ClubAppearanceRegistry } from './ClubRegistry';
import { KitDefinition, KitType } from './types';

export class KitResolver {
  static resolve(clubId: string, kitType: KitType = 'home', season?: string): KitDefinition | undefined {
    const clubApp = ClubAppearanceRegistry.get(clubId);
    if (!clubApp) return undefined;

    // Filter by type
    const kitsOfType = clubApp.kits.filter(k => k.type === kitType);
    if (kitsOfType.length === 0) return undefined;

    // Filter by season if provided
    if (season) {
      const match = kitsOfType.find(k => k.season === season);
      if (match) return match;
    }

    // Default to the first matching kit of that type
    return kitsOfType[0];
  }
}
