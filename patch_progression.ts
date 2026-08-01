import fs from 'fs';

let content = fs.readFileSync('src/core/domain/progressionEngine.ts', 'utf8');

if (!content.includes('import { TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType }')) {
  content = content.replace(
    'import { TechnicalStat, Position, PersonalityTrait, PlayerDNA } from \'../../types\';',
    'import { TechnicalStat, Position, PersonalityTrait, PlayerDNA, TrainingSessionType } from \'../../types\';'
  );
}

content = content.replace(
  'trainingFocus?: TechnicalStat | \'GENERAL\';',
  'trainingFocus?: TrainingSessionType;'
);

const applyFocusReplacement = `
    // Apply training focus
    if (params.trainingFocus && params.trainingFocus !== 'GENERAL' && params.trainingFocus !== 'REST') {
       if (params.trainingFocus === 'FINISHING') {
         weights.SHO! += 2.0; weights.HEA! += 1.0; weights.PEN! += 1.0;
       } else if (params.trainingFocus === 'CREATION') {
         weights.PAS! += 2.0; weights.VIS! += 2.0; weights.CRE! += 2.0;
       } else if (params.trainingFocus === 'DRIBBLING') {
         weights.DRI! += 2.0; weights.CON! += 1.5; weights.ACC! += 1.0;
       } else if (params.trainingFocus === 'PHYSICAL') {
         weights.PHY! += 2.0; weights.STA! += 2.0; weights.PAC! += 1.0; weights.JUM! += 1.0;
       } else if (params.trainingFocus === 'DEFENDING') {
         weights.DEF! += 2.0; weights.HEA! += 1.0; weights.PHY! += 1.0;
       } else if (params.trainingFocus === 'SET_PIECES') {
         weights.FK! += 3.0; weights.PEN! += 2.0;
       } else if (params.trainingFocus === 'CHEMISTRY') {
         // Doesn't affect technical stats much, but maybe PAS
         weights.PAS! += 1.0;
       } else if (params.trainingFocus === 'POSITIONAL') {
         // Double the base position weights
         for (const stat of Object.keys(weights) as TechnicalStat[]) {
           weights[stat]! *= 1.5;
         }
       }
    }
`;

content = content.replace(
  `    // Apply training focus
    if (params.trainingFocus && params.trainingFocus !== 'GENERAL' && weights[params.trainingFocus]) {
       weights[params.trainingFocus]! += 2.0; // Boost focused stat
    }`,
  applyFocusReplacement
);

fs.writeFileSync('src/core/domain/progressionEngine.ts', content);
