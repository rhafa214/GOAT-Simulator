const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace("export export type GamePhase = 'TRANSFERS' | \n  | 'CREATION_BASIC_INFO'", "export type GamePhase = 'TRANSFERS'\n  | 'CREATION_BASIC_INFO'");
content = content.replace("export export type GamePhase = 'TRANSFERS' |", "export type GamePhase = 'TRANSFERS'\n ");
content = content.replace(" | 'CREATION_BASIC_INFO'", " | 'CREATION_BASIC_INFO'"); // just in case

fs.writeFileSync('src/types.ts', content);
