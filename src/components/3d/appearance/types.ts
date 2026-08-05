export type KitType = 'home' | 'away' | 'third' | 'goalkeeper' | 'historic' | 'special';

export interface KitFeatures {
  hasPatches?: boolean;
  hasArmband?: boolean;
  hasCustomNumber?: boolean;
  hasSponsors?: boolean;
  hasStars?: boolean;
  hasAccessories?: boolean;
}

export interface KitTextures {
  diffuse?: string;
  normal?: string;
  roughness?: string;
  metallic?: string;
}

export interface KitDefinition {
  type: KitType;
  season: string; // e.g. "2024/25"
  textures: KitTextures;
  features: KitFeatures;
  baseColor?: string; // Fallback color if texture is missing
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ClubAppearance {
  clubId: string;
  kits: KitDefinition[];
}
