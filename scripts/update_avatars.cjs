const fs = require('fs');

// 1. Remove AvatarManager
if (fs.existsSync('src/components/3d/AvatarManager.tsx')) {
  fs.unlinkSync('src/components/3d/AvatarManager.tsx');
}

// 2. Rename and update AvatarScene
let sceneCode = fs.readFileSync('src/components/3d/PlayerAvatar.tsx', 'utf8');
sceneCode = sceneCode.replace(/PlayerAvatar/g, 'AvatarScene');
fs.writeFileSync('src/components/3d/AvatarScene.tsx', sceneCode);
fs.unlinkSync('src/components/3d/PlayerAvatar.tsx');

// 3. Rename and update PlayerPortrait
let portraitCode = fs.readFileSync('src/components/ui/PlayerAvatar.tsx', 'utf8');
portraitCode = portraitCode.replace(/PlayerAvatar/g, 'PlayerPortrait');
portraitCode = portraitCode.replace(/NewPlayerPortrait/g, 'AvatarScene'); // because PlayerAvatar -> PlayerPortrait
portraitCode = portraitCode.replace(/import AvatarScene from '\.\.\/3d\/AvatarScene';/, '');
// Wait, the original code had: import NewPlayerAvatar from '../3d/PlayerAvatar';
portraitCode = portraitCode.replace(/import NewPlayerAvatar from '\.\.\/3d\/PlayerAvatar';/, "import AvatarScene from '../3d/AvatarScene';");
portraitCode = portraitCode.replace(/<NewPlayerAvatar/g, '<AvatarScene');
fs.writeFileSync('src/components/ui/PlayerPortrait.tsx', portraitCode);
fs.unlinkSync('src/components/ui/PlayerAvatar.tsx');

// 4. Update imports
const filesToUpdate = [
  'src/components/creation/CreationAppearance.tsx',
  'src/components/museum/MuseumView.tsx',
  'src/components/hub/PostMatchScreen.tsx',
  'src/components/hub/DashboardView.tsx'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import { PlayerAvatar } from (['"])(?:\.\.\/)+ui\/PlayerAvatar['"];/g, "import { PlayerPortrait } from $1../ui/PlayerPortrait$1;");
    content = content.replace(/<PlayerAvatar/g, '<PlayerPortrait');
    fs.writeFileSync(file, content);
  }
});

console.log("Avatars refactored successfully.");
