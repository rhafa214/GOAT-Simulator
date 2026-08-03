import fs from 'fs';

const path = 'src/components/3d/AvatarScene.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<ambientLight intensity={0.5} />
        <directionalLight 
           position={[5, 5, 5]} 
           intensity={1} 
           castShadow 
           shadow-mapSize={quality === 'high' ? 1024 : 512}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#4b6cb7" />`;

const replacement = `<ambientLight intensity={0.2} />
        {/* Key Light */}
        <directionalLight 
          position={[3, 4, 5]} 
          intensity={1.2} 
          color="#ffffff" 
          castShadow 
          shadow-mapSize={quality === 'high' ? 1024 : 512} 
          shadow-bias={-0.0001}
        />
        {/* Fill Light */}
        <directionalLight 
          position={[-4, 2, 4]} 
          intensity={0.4} 
          color="#b0c4de" 
        />
        {/* Rim Light */}
        <directionalLight 
          position={[0, 3, -6]} 
          intensity={1.5} 
          color="#ffd700" 
        />`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
