import fs from 'fs';
let content = fs.readFileSync('src/core/domain/progressionEngine.ts', 'utf-8');
console.log(content.includes('export interface ProgressionParams {'));
