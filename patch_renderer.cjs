const fs = require('fs');
const file = 'src/components/3d/AvatarRenderer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /clubColor\?: string;/,
  "clubId?: string;\n  kitType?: 'home' | 'away' | 'third' | 'goalkeeper' | 'historic' | 'special';\n  season?: string;\n  clubColor?: string;"
);

content = content.replace(
  /clubColor = '#ffffff',/,
  "clubId,\n  kitType = 'home',\n  season,\n  clubColor = '#ffffff',"
);

const newRender = `{modelDef ? (
        <AvatarAppearance clubId={clubId} kitType={kitType as any} season={season}>
          <AvatarGLTFModel 
            url={ManifestValidator.getModelUrl(modelDef)}
            appearance={appearance}
            pose={pose as any}
            clubColor={clubColor} // keeping for backwards compatibility if GLTFModel needs it for now
            quality={quality}
          />
        </AvatarAppearance>
      ) : (`;

content = content.replace(/\{modelDef \? \([\s\S]*?<AvatarGLTFModel[\s\S]*?\/>\s*\)\s*:\s*\(/m, newRender);

content = "import { AvatarAppearance } from './appearance/AvatarAppearance';\n" + content;

fs.writeFileSync(file, content, 'utf8');
console.log('patched AvatarRenderer');
