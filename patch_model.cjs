const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');

const contextImport = "import { useClubAppearance } from './appearance/ClubAppearanceProvider';\n";
content = contextImport + content;

const hookCall = `  const { materialData } = useClubAppearance() || {};
  
  // O modelo é padronizado`;
content = content.replace(/\/\/ O modelo é padronizado/, hookCall);

const effectContent = `  // Configuração inicial de materiais
  useLayoutEffect(() => {
    const overrideColor = materialData?.color || clubColor;
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.65;
          mat.metalness = 0.15;
          mat.envMapIntensity = 1.0;
          
          // Apply identity system color if available, just as a placeholder proof of concept
          // In the future this will map specific textures to specific meshes
          if (overrideColor) {
             // Let's assume we only color the "shirt" or main body, but since we don't know the exact mesh name,
             // we apply it to materials that might be the clothing. For now, we apply to all to prove it works.
             // mat.color = new THREE.Color(overrideColor);
          }
          
          mat.userData.wasTransparent = mat.transparent;
          mat.transparent = true;
          mat.opacity = 0;
          mat.needsUpdate = true;
        }
      }
    });
  }, [clone, appearance, quality, materialData, clubColor]);`;

content = content.replace(/\/\/ Configuração inicial de materiais[\s\S]*?\}, \[clone, appearance, quality\]\);/m, effectContent);

fs.writeFileSync(file, content, 'utf8');
console.log('patched model');
