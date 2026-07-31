export type Rarity = 'GOAT' | 'LENDARIA' | 'EPICA' | 'RARA' | 'COMUM';

export interface DraftPlayer {
  id: string;
  name: string;
  nationality: string;
  position: string;
  club: string;
  rarity: Rarity;
  overall: number;
  stats: Record<string, number>;
  style: string;
}

export const DRAFT_PLAYERS: DraftPlayer[] = [
  // GOAT (2%)
  { id: 'p1', name: 'Ronaldo Fenômeno', nationality: 'BR', position: 'ATA', club: 'Lendas', rarity: 'GOAT', overall: 98, style: 'Finalizador', stats: { PAC: 97, SHO: 98, PAS: 85, DRI: 97, DEF: 30, PHY: 85, HEA: 82, WF: 5, SM: 5, LDR: 80, VIS: 88, CON: 96, ACC: 85, STA: 80, JUM: 88, DET: 90, COM: 95, FK: 85, PEN: 90, CRE: 90 } },
  { id: 'p2', name: 'Pelé', nationality: 'BR', position: 'MEI', club: 'Lendas', rarity: 'GOAT', overall: 99, style: 'Craque completo', stats: { PAC: 95, SHO: 98, PAS: 96, DRI: 97, DEF: 50, PHY: 85, HEA: 95, WF: 5, SM: 5, LDR: 95, VIS: 98, CON: 98, ACC: 95, STA: 90, JUM: 95, DET: 95, COM: 99, FK: 95, PEN: 98, CRE: 99 } },
  { id: 'p3', name: 'Messi', nationality: 'AR', position: 'PD', club: 'Lendas', rarity: 'GOAT', overall: 99, style: 'Maestro', stats: { PAC: 92, SHO: 97, PAS: 98, DRI: 99, DEF: 35, PHY: 75, HEA: 70, WF: 4, SM: 5, LDR: 85, VIS: 99, CON: 99, ACC: 98, STA: 85, JUM: 75, DET: 90, COM: 99, FK: 99, PEN: 90, CRE: 99 } },
  { id: 'p4', name: 'C. Ronaldo', nationality: 'PT', position: 'ATA', club: 'Lendas', rarity: 'GOAT', overall: 98, style: 'Finalizador', stats: { PAC: 93, SHO: 99, PAS: 85, DRI: 90, DEF: 35, PHY: 90, HEA: 99, WF: 4, SM: 5, LDR: 95, VIS: 85, CON: 92, ACC: 85, STA: 95, JUM: 99, DET: 99, COM: 98, FK: 90, PEN: 99, CRE: 85 } },
  
  // LENDÁRIA (6%)
  { id: 'p5', name: 'Ronaldinho', nationality: 'BR', position: 'MEI', club: 'Lendas', rarity: 'LENDARIA', overall: 95, style: 'Maestro', stats: { PAC: 91, SHO: 88, PAS: 94, DRI: 98, DEF: 35, PHY: 80, HEA: 75, WF: 4, SM: 5, LDR: 80, VIS: 96, CON: 98, ACC: 93, STA: 80, JUM: 75, DET: 80, COM: 90, FK: 97, PEN: 85, CRE: 99 } },
  { id: 'p6', name: 'Zidane', nationality: 'FR', position: 'MEI', club: 'Lendas', rarity: 'LENDARIA', overall: 96, style: 'Armador', stats: { PAC: 75, SHO: 85, PAS: 97, DRI: 94, DEF: 60, PHY: 85, HEA: 85, WF: 5, SM: 5, LDR: 95, VIS: 98, CON: 98, ACC: 98, STA: 85, JUM: 80, DET: 90, COM: 99, FK: 90, PEN: 95, CRE: 97 } },
  { id: 'p7', name: 'Maldini', nationality: 'IT', position: 'ZAG', club: 'Lendas', rarity: 'LENDARIA', overall: 96, style: 'Zagueiro técnico', stats: { PAC: 85, SHO: 50, PAS: 80, DRI: 75, DEF: 99, PHY: 90, HEA: 95, WF: 4, SM: 2, LDR: 99, VIS: 80, CON: 85, ACC: 85, STA: 90, JUM: 95, DET: 95, COM: 95, FK: 50, PEN: 60, CRE: 60 } },
  { id: 'p8', name: 'Iniesta', nationality: 'ES', position: 'MC', club: 'Lendas', rarity: 'LENDARIA', overall: 94, style: 'Maestro', stats: { PAC: 78, SHO: 75, PAS: 98, DRI: 95, DEF: 65, PHY: 65, HEA: 60, WF: 4, SM: 4, LDR: 85, VIS: 99, CON: 98, ACC: 99, STA: 85, JUM: 60, DET: 85, COM: 95, FK: 70, PEN: 70, CRE: 98 } },

  // ÉPICA (12%)
  { id: 'p9', name: 'Mbappé', nationality: 'FR', position: 'ATA', club: 'Madrid', rarity: 'EPICA', overall: 91, style: 'Ponta explosivo', stats: { PAC: 97, SHO: 90, PAS: 80, DRI: 92, DEF: 35, PHY: 78, HEA: 75, WF: 4, SM: 5, LDR: 75, VIS: 82, CON: 92, ACC: 85, STA: 88, JUM: 80, DET: 85, COM: 88, FK: 70, PEN: 85, CRE: 85 } },
  { id: 'p10', name: 'De Bruyne', nationality: 'BE', position: 'MC', club: 'Manchester', rarity: 'EPICA', overall: 91, style: 'Armador', stats: { PAC: 75, SHO: 86, PAS: 95, DRI: 87, DEF: 65, PHY: 78, HEA: 65, WF: 5, SM: 4, LDR: 88, VIS: 98, CON: 90, ACC: 96, STA: 90, JUM: 65, DET: 88, COM: 90, FK: 85, PEN: 85, CRE: 95 } },
  { id: 'p11', name: 'Haaland', nationality: 'NO', position: 'ATA', club: 'Manchester', rarity: 'EPICA', overall: 91, style: 'Finalizador', stats: { PAC: 89, SHO: 94, PAS: 70, DRI: 80, DEF: 45, PHY: 90, HEA: 90, WF: 3, SM: 3, LDR: 75, VIS: 75, CON: 85, ACC: 75, STA: 88, JUM: 92, DET: 90, COM: 92, FK: 65, PEN: 90, CRE: 70 } },
  { id: 'p12', name: 'Vinícius Jr', nationality: 'BR', position: 'PE', club: 'Madrid', rarity: 'EPICA', overall: 90, style: 'Ponta explosivo', stats: { PAC: 95, SHO: 85, PAS: 82, DRI: 94, DEF: 35, PHY: 70, HEA: 65, WF: 4, SM: 5, LDR: 70, VIS: 85, CON: 93, ACC: 85, STA: 85, JUM: 75, DET: 85, COM: 85, FK: 70, PEN: 80, CRE: 88 } },
  { id: 'p13', name: 'Van Dijk', nationality: 'NL', position: 'ZAG', club: 'Liverpool', rarity: 'EPICA', overall: 89, style: 'Zagueiro técnico', stats: { PAC: 78, SHO: 60, PAS: 75, DRI: 70, DEF: 92, PHY: 90, HEA: 90, WF: 3, SM: 2, LDR: 92, VIS: 75, CON: 75, ACC: 80, STA: 85, JUM: 90, DET: 90, COM: 90, FK: 70, PEN: 65, CRE: 60 } },

  // RARA (25%)
  { id: 'p14', name: 'Rafael Leão', nationality: 'PT', position: 'PE', club: 'Milão', rarity: 'RARA', overall: 86, style: 'Ponta explosivo', stats: { PAC: 93, SHO: 80, PAS: 78, DRI: 88, DEF: 30, PHY: 78, HEA: 70, WF: 4, SM: 4, LDR: 65, VIS: 78, CON: 86, ACC: 80, STA: 80, JUM: 75, DET: 75, COM: 80, FK: 60, PEN: 70, CRE: 82 } },
  { id: 'p15', name: 'Bellingham', nationality: 'ENG', position: 'MC', club: 'Madrid', rarity: 'RARA', overall: 87, style: 'Box-to-box', stats: { PAC: 82, SHO: 82, PAS: 85, DRI: 88, DEF: 80, PHY: 85, HEA: 80, WF: 4, SM: 4, LDR: 85, VIS: 88, CON: 88, ACC: 88, STA: 92, JUM: 82, DET: 90, COM: 88, FK: 70, PEN: 80, CRE: 85 } },
  { id: 'p16', name: 'Griezmann', nationality: 'FR', position: 'ATA', club: 'Atlético', rarity: 'RARA', overall: 88, style: 'Segundo atacante', stats: { PAC: 80, SHO: 88, PAS: 88, DRI: 88, DEF: 60, PHY: 75, HEA: 80, WF: 3, SM: 4, LDR: 85, VIS: 90, CON: 90, ACC: 88, STA: 90, JUM: 85, DET: 88, COM: 90, FK: 85, PEN: 88, CRE: 90 } },
  { id: 'p17', name: 'Valverde', nationality: 'UY', position: 'MC', club: 'Madrid', rarity: 'RARA', overall: 88, style: 'Motorzinho', stats: { PAC: 88, SHO: 82, PAS: 85, DRI: 84, DEF: 82, PHY: 85, HEA: 75, WF: 4, SM: 3, LDR: 82, VIS: 85, CON: 85, ACC: 88, STA: 95, JUM: 80, DET: 90, COM: 85, FK: 80, PEN: 75, CRE: 80 } },
  
  // COMUM (55%)
  { id: 'p18', name: 'Ribamar', nationality: 'BR', position: 'ATA', club: 'Nacional', rarity: 'COMUM', overall: 68, style: 'Finalizador', stats: { PAC: 75, SHO: 65, PAS: 55, DRI: 65, DEF: 30, PHY: 75, HEA: 70, WF: 2, SM: 2, LDR: 50, VIS: 55, CON: 60, ACC: 60, STA: 70, JUM: 75, DET: 65, COM: 60, FK: 50, PEN: 65, CRE: 50 } },
  { id: 'p19', name: 'Tiquinho', nationality: 'BR', position: 'ATA', club: 'Rio', rarity: 'COMUM', overall: 76, style: 'Finalizador', stats: { PAC: 70, SHO: 78, PAS: 70, DRI: 75, DEF: 40, PHY: 82, HEA: 80, WF: 3, SM: 3, LDR: 75, VIS: 75, CON: 78, ACC: 75, STA: 75, JUM: 78, DET: 80, COM: 78, FK: 65, PEN: 80, CRE: 70 } },
  { id: 'p20', name: 'Yuri Alberto', nationality: 'BR', position: 'ATA', club: 'São Paulo', rarity: 'COMUM', overall: 74, style: 'Motorzinho', stats: { PAC: 82, SHO: 72, PAS: 65, DRI: 72, DEF: 45, PHY: 78, HEA: 75, WF: 3, SM: 3, LDR: 60, VIS: 65, CON: 70, ACC: 70, STA: 85, JUM: 78, DET: 75, COM: 68, FK: 55, PEN: 70, CRE: 65 } },
  { id: 'p21', name: 'Ganso', nationality: 'BR', position: 'MEI', club: 'Rio', rarity: 'COMUM', overall: 77, style: 'Maestro', stats: { PAC: 50, SHO: 70, PAS: 85, DRI: 80, DEF: 40, PHY: 60, HEA: 60, WF: 2, SM: 4, LDR: 80, VIS: 90, CON: 88, ACC: 88, STA: 60, JUM: 50, DET: 70, COM: 85, FK: 80, PEN: 75, CRE: 90 } },
  { id: 'p22', name: 'Felipe Melo', nationality: 'BR', position: 'VOL', club: 'Rio', rarity: 'COMUM', overall: 75, style: 'Volante marcador', stats: { PAC: 45, SHO: 65, PAS: 75, DRI: 65, DEF: 78, PHY: 85, HEA: 78, WF: 3, SM: 2, LDR: 90, VIS: 75, CON: 75, ACC: 78, STA: 60, JUM: 75, DET: 95, COM: 75, FK: 65, PEN: 75, CRE: 65 } },
];
