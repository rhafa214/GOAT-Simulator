const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');

const hookCall = `  const { materialData, kitDefinition, clubId } = useClubAppearance() || {};
  
  // O modelo é padronizado`;
content = content.replace(/  const \{ materialData \} = useClubAppearance\(\) \|\| \{\};\s*\/\/ O modelo é padronizado/, hookCall);


const effectContent = `  // Configuração inicial de materiais
  useLayoutEffect(() => {
    const overrideColor = materialData?.color || clubColor;
    
    // DEV DEBUG LOGGING
    const isDev = import.meta.env.DEV;
    const foundMaterials: string[] = [];
    const alteredMaterials: string[] = [];
    const ignoredMaterials: string[] = [];
    
    // Check if model has a single material (baked)
    let materialCount = 0;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        materialCount++;
      }
    });

    const isSingleMaterial = materialCount <= 1;
    
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          // MUST CLONE material before modifying color, otherwise all instances share it
          // But only if we intend to modify it. For transparency we might mutate directly since it's transient
          const mat = (mesh.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
          mesh.material = mat;
          
          mat.roughness = 0.65;
          mat.metalness = 0.15;
          mat.envMapIntensity = 1.0;
          
          foundMaterials.push(mat.name || 'unnamed');
          
          if (overrideColor) {
             if (isSingleMaterial) {
               // DO NOT TINT ENTIRE BODY (protects skin color)
               ignoredMaterials.push(mat.name || 'unnamed (protected single mesh/material)');
             } else {
               // In a multi-material setup, we'd check names like 'shirt', 'shorts'
               // For now, if we had separated meshes, we would apply:
               // mat.color = new THREE.Color(overrideColor);
               // alteredMaterials.push(mat.name || 'unnamed');
             }
          }
          
          mat.userData.wasTransparent = mat.transparent;
          mat.transparent = true;
          mat.opacity = 0;
          mat.needsUpdate = true;
        }
      }
    });
    
    if (isDev && kitDefinition) {
       console.log('--- KIT PILOT V1 DEV LOG ---');
       console.log('Resolved Kit:', clubId, kitDefinition.type, kitDefinition.season);
       console.log('Found Materials:', foundMaterials);
       console.log('Altered Materials:', alteredMaterials);
       console.log('Ignored Materials:', ignoredMaterials);
       console.log('Limitation Note: Model has single baked material/mesh. Skipping recolor to protect skin.');
    }
  }, [clone, appearance, quality, materialData, clubColor, kitDefinition, clubId]);`;

content = content.replace(/\/\/ Configuração inicial de materiais[\s\S]*?\}, \[clone, appearance, quality, materialData, clubColor\]\);/m, effectContent);

fs.writeFileSync(file, content, 'utf8');
console.log('patched model 2');
