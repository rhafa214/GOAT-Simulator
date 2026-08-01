import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import { useAvatarManager } from '../../core/domain/avatar/AvatarManager';

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
    <div className="w-full h-full relative">
      <Canvas shadows dpr={dpr}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={45} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.1}
          target={[0, 1, 0]}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
           position={[5, 5, 5]} 
           intensity={1} 
           castShadow 
           shadow-mapSize={quality === 'high' ? 1024 : 512}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#4b6cb7" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <AvatarModel clubColor={clubColor} pose={pose} />
        </Suspense>
        
        {useContactShadows && (
          <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        )}
      </Canvas>
      {process.env.NODE_ENV === 'development' && <FPSCounter />}
    </div>
  );
}
