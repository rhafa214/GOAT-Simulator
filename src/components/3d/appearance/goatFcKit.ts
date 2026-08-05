import { ClubAppearance } from './types';

export const goatFcAppearance: ClubAppearance = {
  clubId: 'goat-fc',
  kits: [
    {
      type: 'home',
      season: '2026',
      textures: {},
      features: {
        hasPatches: false,
        hasSponsors: false
      },
      baseColor: '#000000', // Black shirt
      primaryColor: '#000000',
      secondaryColor: '#FFD700', // Gold details
    },
    {
      type: 'away',
      season: '2026',
      textures: {},
      features: {},
      baseColor: '#ffffff',
      primaryColor: '#ffffff',
      secondaryColor: '#FFD700',
    }
  ]
};
