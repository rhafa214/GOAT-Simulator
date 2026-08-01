export type AvatarPartCategory = 'hairStyle' | 'eyes' | 'mouth' | 'nose' | 'facialHair' | 'accessories' | 'tattoos' | 'boots';

export interface AvatarPart {
  id: string;
  name: string;
  assetUrl?: string; // Optional URL if a specific 3D asset is needed
  type: AvatarPartCategory;
}

export const AVATAR_CATALOG: Record<AvatarPartCategory, AvatarPart[]> = {
  hairStyle: [
    { id: 'hair_short', name: 'Curto', type: 'hairStyle' },
    { id: 'hair_long', name: 'Longo', type: 'hairStyle' },
    { id: 'hair_bald', name: 'Careca', type: 'hairStyle' },
  ],
  eyes: [
    { id: 'eyes_default', name: 'Padrão', type: 'eyes' },
  ],
  mouth: [
    { id: 'mouth_default', name: 'Padrão', type: 'mouth' },
  ],
  nose: [
    { id: 'nose_default', name: 'Padrão', type: 'nose' },
  ],
  facialHair: [
    { id: 'beard_none', name: 'Nenhuma', type: 'facialHair' },
    { id: 'beard_full', name: 'Cheia', type: 'facialHair' },
  ],
  accessories: [
    { id: 'acc_none', name: 'Nenhum', type: 'accessories' },
    { id: 'acc_glasses', name: 'Óculos', type: 'accessories' },
  ],
  tattoos: [
    { id: 'tattoo_none', name: 'Nenhuma', type: 'tattoos' },
  ],
  boots: [
    { id: 'boots_default', name: 'Padrão', type: 'boots' },
  ]
};

export const DEFAULT_APPEARANCE = {
  skinColor: 'edb98a',
  hairStyle: 'hair_short',
  hairColor: '2c1b18',
  facialHair: 'beard_none',
  facialHairColor: '2c1b18',
  eyes: 'eyes_default',
  mouth: 'mouth_default',
  nose: 'nose_default',
  accessories: 'acc_none',
  tattoos: 'tattoo_none',
  height: 180,
  weight: 75,
  physique: 'Atlética' as const,
  boots: 'boots_default',
  sleeves: 'Curtas' as const,
  gloves: false,
  celebration: 'celebration_default'
};
