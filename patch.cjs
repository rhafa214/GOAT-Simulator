const fs = require('fs');
const file = 'src/components/3d/AvatarGLTFModel.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `  const { camera, controls } = useThree();

  // Calcular bounds e offsets uma única vez para estabilidade do frame 1
  const { height, yOffset, center } = useMemo(() => {
    // Computa no clone que já está em pose inicial (idle)
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    
    // Evitar height zero ou negativo (fallback seguro)
    const h = size.y > 0.1 ? size.y : 1.5;
    
    return {
      height: h,
      center: c,
      // Deslocamos para que o box.min.y (pé do modelo) alinhe-se ao chão do estúdio (y=-1.5)
      yOffset: -box.min.y - 1.5
    };
  }, [clone]);

  // Ajustar a câmera baseando-se na altura (height) para ocupar ~70% da tela
  useLayoutEffect(() => {
    if (camera.type === 'PerspectiveCamera') {
      const pCam = camera as THREE.PerspectiveCamera;
      const fov = pCam.fov * (Math.PI / 180);
      
      const targetHeight = height / 0.70;
      const distance = (targetHeight / 2) / Math.tan(fov / 2);
      
      // Target Y is exactly the center of the bounding box translated to the floor
      const targetY = -1.5 + height / 2;
      
      pCam.position.set(0, targetY, distance);
      pCam.near = 0.1;
      pCam.far = distance * 10;
      pCam.updateProjectionMatrix();

      // Ensure orbit controls rotate around the model's physical center
      if (controls && (controls as any).target) {
        (controls as any).target.set(0, targetY, 0);
        (controls as any).update();
      }
    }
  }, [camera, controls, height]);`;

const replacement = `  // O modelo é padronizado em proporções humanas (aprox 1.8m).
  // Posicionamos rigidamente no chão (y = -1.5) para estabilidade no frame 1.
  // A câmera em AvatarScene.tsx se encarregará de enquadrar os ~70% corretos,
  // sem depender de BoundingBox flutuantes durante animações, evitando saltos de escala.
  const yOffset = -1.5;`;

if (content.includes('const { camera, controls } = useThree();')) {
  // It's safer to just regex replace from "const { camera" up to the comment before layout effect
  const newContent = content.replace(/const { camera[\s\S]*?}, \[camera, controls, height\]\);/, replacement);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('patched');
} else {
  console.log('not found');
}
