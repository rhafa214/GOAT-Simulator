import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import AvatarRenderer from './AvatarRenderer';
import { useAvatarManager } from './AvatarManager';

interface AvatarSceneProps {
  clubColor?: string;
  pose?: 'idle' | 'confident' | 'celebration' | 'arms_crossed';
}

function FPSCounter() {
  const [fps, setFps] = useState(0);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
      {fps} FPS
    </div>
  );
}

export default function AvatarScene({ clubColor = '#ffffff', pose = 'idle' }: AvatarSceneProps) {
  const { quality } = useAvatarManager();
  
  const dpr = quality === 'high' ? [1, 2] as [number, number] : [1, 1] as [number, number];
  const useContactShadows = quality === 'high';

  return (
    // Etapa 1 - Estúdio Esportivo Premium (Gradiente, fundo não totalmente preto)
    <div className="w-full h-full relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-950">
      <Canvas shadows dpr={dpr}>
        {/* Etapa 2 - Câmera (Ocupando ~65% do corpo sem cortar) */}
        <PerspectiveCamera makeDefault position={[0, 0.9, 3.8]} fov={40} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.1}
          target={[0, 0.9, 0]}
        />
        
        {/* Etapa 3 - Iluminação (Key, Fill, Rim) */}
        <ambientLight intensity={0.15} />
        
        {/* Key Light - Luz Principal */}
        <directionalLight 
           position={[2, 2, 4]} 
           intensity={1.5} 
           color="#ffffff" 
           castShadow 
           shadow-mapSize={quality === 'high' ? 2048 : 512} 
           shadow-bias={-0.0001}
        />
        
        {/* Fill Light - Luz de Preenchimento (Azulada suave para contraste) */}
        <directionalLight 
           position={[-4, 1, 3]} 
           intensity={0.6} 
           color="#90b0d0" 
         />
         
        {/* Rim Light - Luz Dourada Discreta nas Costas */}
        <spotLight 
           position={[1, 3, -4]} 
           intensity={0.8} 
           color="#ffdf80" 
           angle={0.6}
           penumbra={0.8}
           castShadow={false}
         />
        
        <Suspense fallback={null}>
          {quality === 'high' && <Environment preset="city" />}
          <AvatarRenderer clubColor={clubColor} pose={pose} quality={quality} />
        </Suspense>
        
        {useContactShadows && (
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        )}
      </Canvas>
      {import.meta.env.DEV && <FPSCounter />}
    </div>
  );
}
