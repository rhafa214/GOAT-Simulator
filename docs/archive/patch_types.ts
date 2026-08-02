import fs from 'fs';
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('export type TrainingSessionType')) {
  content = `
export type TrainingSessionType = 
  | 'FINISHING' 
  | 'CREATION' 
  | 'DRIBBLING' 
  | 'PHYSICAL' 
  | 'DEFENDING' 
  | 'SET_PIECES' 
  | 'RECOVERY' 
  | 'CHEMISTRY' 
  | 'POSITIONAL' 
  | 'REST' 
  | 'GENERAL';

export interface TrainingPlan {
  focus: TrainingSessionType;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
}
` + content;
}

if (!content.includes('trainingPlan?: TrainingPlan')) {
  content = content.replace(
    'progression?: ProgressionState;',
    'progression?: ProgressionState;\n  trainingPlan?: TrainingPlan;'
  );
}

if (!content.includes('type: \'SET_TRAINING_PLAN\'')) {
  content = content.replace(
    '| { type: \'TRAIN_ATTRIBUTE\'; payload: \'SHO\' | \'PAS\' | \'DRI\' | \'DEF\' }',
    '| { type: \'TRAIN_ATTRIBUTE\'; payload: \'SHO\' | \'PAS\' | \'DRI\' | \'DEF\' }\n  | { type: \'SET_TRAINING_PLAN\'; payload: TrainingPlan }'
  );
}

fs.writeFileSync('src/types.ts', content);
