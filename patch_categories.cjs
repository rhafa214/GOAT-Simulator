const fs = require('fs');
let code = fs.readFileSync('src/components/creation/CreationAttributes.tsx.tmp', 'utf8');

const newCategories = `const DRAFT_CATEGORIES = [
  { id: 'PAC', name: 'Velocidade', type: 'technical' },
  { id: 'SHO', name: 'Finalização', type: 'technical' },
  { id: 'PAS', name: 'Passe', type: 'technical' },
  { id: 'DRI', name: 'Drible', type: 'technical' },
  { id: 'SM', name: 'Finta', type: 'technical' },
  { id: 'PHY', name: 'Físico', type: 'technical' },
  { id: 'DEF', name: 'Defesa', type: 'technical' },
  { id: 'WF', name: 'Perna ruim', type: 'technical' },
  { id: 'HEA', name: 'Cabeceio', type: 'technical' },
  { id: 'LDR', name: 'Liderança', type: 'rpg' },
  { id: 'VIS', name: 'Visão de jogo', type: 'technical' },
  { id: 'CON', name: 'Controle de bola', type: 'technical' },
  { id: 'ACC', name: 'Precisão de passe', type: 'technical' },
  { id: 'STA', name: 'Resistência', type: 'technical' },
  { id: 'JUM', name: 'Impulsão', type: 'technical' },
  { id: 'DET', name: 'Mentalidade', type: 'rpg' },
  { id: 'COM', name: 'Frieza', type: 'rpg' },
  { id: 'FK', name: 'Cobrança de falta', type: 'technical' },
  { id: 'PEN', name: 'Pênaltis', type: 'technical' },
  { id: 'CRE', name: 'Criatividade', type: 'technical' }
];`;

code = code.replace(/const DRAFT_CATEGORIES = \[\s*\{ id: 'PAC'[\s\S]*?\}\s*\];/, newCategories);

code = code.replace(/if \(currentStep < 19\)/, 'if (currentStep < TOTAL_STEPS - 1)');

const newFinishDraft = `const finishDraft = (finalCards: DraftPlayer[], bonus: number) => {
    const technical: Record<string, number> = { ...state.player.technical };
    const rpg: Record<string, number> = { ...state.player.rpg };
    
    finalCards.forEach((card, index) => {
      if (!card || index >= TOTAL_STEPS) return;
      const cat = activeCategories[index];
      const val = card.stats[cat.id] || 50;
      const valWithBonus = Math.min(99, val + Math.floor(val * (bonus / 100)));
      
      if (cat.type === 'technical') technical[cat.id] = valWithBonus;
      if (cat.type === 'rpg') rpg[cat.id] = valWithBonus;
    });

    if (state.draftLength === 'SHORT') {
      // Auto-calculate remaining stats based on primary stats
      technical['HEA'] = Math.floor((technical['PHY'] + technical['DEF']) / 2);
      technical['VIS'] = Math.floor((technical['PAS'] + technical['DRI']) / 2);
      technical['CON'] = Math.floor((technical['DRI'] + technical['PAC']) / 2);
      technical['ACC'] = Math.floor((technical['PAS'] + technical['SHO']) / 2);
      technical['STA'] = Math.floor((technical['PHY'] + technical['PAC']) / 2);
      technical['JUM'] = Math.floor((technical['PHY'] + technical['PAC']) / 2);
      technical['FK'] = Math.floor((technical['SHO'] + technical['PAS']) / 2);
      technical['PEN'] = Math.floor((technical['SHO'] + technical['COM'] || 50) / 2);
      technical['CRE'] = Math.floor((technical['PAS'] + technical['DRI']) / 2);
      
      rpg['LDR'] = Math.floor((technical['DEF'] + technical['PHY']) / 2) || 50;
      rpg['DET'] = Math.floor((technical['PHY'] + technical['STA']) / 2) || 50;
      rpg['COM'] = Math.floor((technical['SHO'] + technical['PAS']) / 2) || 50;
    }

    dispatch({
      type: 'INITIALIZE_PLAYER',
      payload: { technical, rpg }
    });
    dispatch({ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' });
  };`;

code = code.replace(/const finishDraft = \(finalCards: DraftPlayer\[\], bonus: number\) => \{[\s\S]*?dispatch\(\{ type: 'CHANGE_PHASE', payload: 'CREATION_PERSONALITY' \}\);\n  \};/, newFinishDraft);

fs.writeFileSync('src/components/creation/CreationAttributes.tsx', code);
