import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import { PhysicalAppearance } from '../../types';

interface PlayerAvatarProps {
  appearance: PhysicalAppearance;
  clubColor?: string;
  pose?: 'idle' | 'confident' | 'celebration' | 'arms_crossed';
}

export default function PlayerAvatar({ appearance, clubColor = '#ffffff', pose = 'idle' }: PlayerAvatarProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]}>
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
          shadow-mapSize={1024}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#4b6cb7" />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <AvatarModel appearance={appearance} clubColor={clubColor} pose={pose} />
        </Suspense>
        
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
