import fs from 'fs';

const path = 'src/components/ui/PlayerPortrait.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "export function PlayerPortrait({ player, className = '' }: { player: PlayerAttributes, className?: string }) {",
  "export function PlayerPortrait({ player, className = '', clubColorOverride }: { player: PlayerAttributes, className?: string, clubColorOverride?: string }) {"
);

content = content.replace(
  "const clubColor = state?.career?.currentClub?.primaryColor || '#1a1a1a';",
  "const clubColor = clubColorOverride || state?.career?.currentClub?.primaryColor || '#111111';"
);

fs.writeFileSync(path, content);
