import { PlayerDNA, TechnicalStat } from '../types';

export interface Idol {
  id: string;
  name: string;
  nationality: string;
  positionOrEra: string;
  photoUrl?: string;
  baseStats: Partial<Record<TechnicalStat, number>>;
  dnaOptions: PlayerDNA[];
}

export const IDOLS: Idol[] = [
  {
    id: 'r9',
    name: 'Ronaldo Fenômeno',
    nationality: 'Brasil',
    positionOrEra: 'ST - 2002',
    baseStats: { PAC: 94, SHO: 96, DRI: 97, SM: 5, WF: 5, CON: 95, ACC: 96 },
    dnaOptions: [
      { id: 'r9_dribble', type: 'TRAIT', name: 'Explosão do Fenômeno', description: 'Arrancadas imparáveis em espaço curto', rarity: 'LEGENDARY', originId: 'r9' }
    ]
  },
  {
    id: 'zidane',
    name: 'Zinedine Zidane',
    nationality: 'França',
    positionOrEra: 'CAM - 2006',
    baseStats: { PAS: 96, DRI: 95, CON: 98, VIS: 97, CRE: 96, SM: 5, WF: 5 },
    dnaOptions: [
      { id: 'zidane_vision', type: 'TRAIT', name: 'Maestro', description: 'Visão de jogo absoluta', rarity: 'LEGENDARY', originId: 'zidane' }
    ]
  },
  {
    id: 'maldini',
    name: 'Paolo Maldini',
    nationality: 'Itália',
    positionOrEra: 'CB - 2005',
    baseStats: { DEF: 98, PHY: 86, HEA: 92 },
    dnaOptions: [
      { id: 'maldini_tackle', type: 'TRAIT', name: 'Defesa Limpa', description: 'Bote sempre no tempo certo', rarity: 'LEGENDARY', originId: 'maldini' }
    ]
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    nationality: 'Argentina',
    positionOrEra: 'RW - 2012',
    baseStats: { PAC: 92, SHO: 96, PAS: 94, DRI: 98, CON: 99, ACC: 97, VIS: 96, CRE: 97 },
    dnaOptions: [
      { id: 'messi_dribble', type: 'TRAIT', name: 'Bola Colada', description: 'A bola não descola do pé esquerdo', rarity: 'LEGENDARY', originId: 'messi' }
    ]
  },
  {
    id: 'cr7',
    name: 'Cristiano Ronaldo',
    nationality: 'Portugal',
    positionOrEra: 'LW - 2014',
    baseStats: { PAC: 93, SHO: 95, DRI: 91, PHY: 85, JUM: 98, HEA: 94, PEN: 95 },
    dnaOptions: [
      { id: 'cr7_jump', type: 'TRAIT', name: 'Voo do CR7', description: 'Impulsão acima da média no cabeceio', rarity: 'LEGENDARY', originId: 'cr7' }
    ]
  },
  {
    id: 'pele',
    name: 'Pelé',
    nationality: 'Brasil',
    positionOrEra: 'CF - 1970',
    baseStats: { PAC: 95, SHO: 96, PAS: 93, DRI: 96, PHY: 80, SM: 5, WF: 4 },
    dnaOptions: [
      { id: 'pele_complete', type: 'SYNERGY', name: 'Rei do Futebol', description: 'Atleta completo', rarity: 'LEGENDARY', originId: 'pele' }
    ]
  },
  {
    id: 'maradona',
    name: 'Diego Maradona',
    nationality: 'Argentina',
    positionOrEra: 'CAM - 1986',
    baseStats: { PAC: 91, SHO: 92, PAS: 95, DRI: 98, SM: 5, WF: 3 },
    dnaOptions: [
      { id: 'maradona_magic', type: 'TRAIT', name: 'Mão de Deus', description: 'Magia imprevisível e carisma caótico', rarity: 'LEGENDARY', originId: 'maradona' }
    ]
  },
  {
    id: 'carlos',
    name: 'Roberto Carlos',
    nationality: 'Brasil',
    positionOrEra: 'LB - 2002',
    baseStats: { PAC: 94, SHO: 88, DEF: 82, PHY: 86, FK: 97, STA: 95 },
    dnaOptions: [
      { id: 'carlos_fk', type: 'TRAIT', name: 'Bomba', description: 'Força extrema nos chutes', rarity: 'EPIC', originId: 'carlos' }
    ]
  },
  {
    id: 'kante',
    name: 'N\'Golo Kanté',
    nationality: 'França',
    positionOrEra: 'CDM - 2018',
    baseStats: { PAC: 83, DEF: 90, PHY: 85, STA: 99 },
    dnaOptions: [
      { id: 'kante_engine', type: 'TRAIT', name: 'Motor', description: 'Fôlego infinito', rarity: 'EPIC', originId: 'kante' }
    ]
  },
  {
    id: 'pirlo',
    name: 'Andrea Pirlo',
    nationality: 'Itália',
    positionOrEra: 'CM - 2006',
    baseStats: { PAS: 95, DRI: 85, DEF: 70, PHY: 68, FK: 95, VIS: 96 },
    dnaOptions: [
      { id: 'pirlo_pass', type: 'TRAIT', name: 'Metrônomo', description: 'Dita o ritmo do jogo', rarity: 'EPIC', originId: 'pirlo' }
    ]
  },
  {
    id: 'garrincha',
    name: 'Garrincha',
    nationality: 'Brasil',
    positionOrEra: 'RW - 1962',
    baseStats: { PAC: 92, SHO: 85, PAS: 87, DRI: 98, SM: 5, CRE: 96 },
    dnaOptions: [
      { id: 'garrincha_dribble', type: 'TRAIT', name: 'Alegria do Povo', description: 'Dribles desconcertantes', rarity: 'LEGENDARY', originId: 'garrincha' }
    ]
  },
  {
    id: 'beckenbauer',
    name: 'Franz Beckenbauer',
    nationality: 'Alemanha',
    positionOrEra: 'CB - 1974',
    baseStats: { PAC: 80, SHO: 75, PAS: 85, DRI: 82, DEF: 96, PHY: 85, VIS: 90 },
    dnaOptions: [
      { id: 'kaiser_libero', type: 'TRAIT', name: 'Kaiser', description: 'Líbero clássico, sai jogando', rarity: 'LEGENDARY', originId: 'beckenbauer' }
    ]
  }
];
