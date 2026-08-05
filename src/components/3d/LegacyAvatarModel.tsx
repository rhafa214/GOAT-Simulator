import React from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useAvatarManager } from './AvatarManager';

interface AvatarModelProps {
  clubColor: string;
  pose: string;
}

export default function AvatarModel({ clubColor, pose }: AvatarModelProps) {
  const { appearance, quality } = useAvatarManager();
  const group = React.useRef<Group>(null);
  const headRef = React.useRef<Group>(null);
  const chestRef = React.useRef<Group>(null);

  const skinColor = appearance.skinColor ? `#${appearance.skinColor}` : '#edb98a';
  const hairColor = appearance.hairColor ? `#${appearance.hairColor}` : '#2c1b18';

  const dpr = quality === 'high' ? 2 : 1;
  const shadowMapSize = quality === 'high' ? 1024 : 512;
  const sphereSegments = quality === 'high' ? 64 : 32;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = -1.5 + Math.sin(t * 1.5) * 0.02; // Idle breathing
    }
    if (headRef.current && pose === 'idle') {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      <group ref={chestRef} position={[0, 1.3, 0]}>
         <mesh castShadow>
           <cylinderGeometry args={[0.25, 0.2, 0.5, sphereSegments/2]} />
           <meshStandardMaterial color={clubColor} roughness={0.7} />
         </mesh>
                  
         <group ref={headRef} position={[0, 0.4, 0]}>
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh castShadow position={[0, 0, 0]}>
              <sphereGeometry args={[0.15, sphereSegments, sphereSegments]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.12, -0.02]} castShadow>
              <sphereGeometry args={[0.16, sphereSegments/2, sphereSegments/2, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            <mesh position={[-0.05, 0.02, 0.14]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>
            <mesh position={[0.05, 0.02, 0.14]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>
         </group>
         
         <group position={[-0.32, 0.1, 0]} rotation={[0, 0, 0.2]}>
            <mesh castShadow>
               <capsuleGeometry args={[0.06, 0.4, 16, 16]} />
               <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.3, 0]} castShadow>
               <sphereGeometry args={[0.07, 16, 16]} />
               <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
         </group>
         <group position={[0.32, 0.1, 0]} rotation={[0, 0, -0.2]}>
            <mesh castShadow>
               <capsuleGeometry args={[0.06, 0.4, 16, 16]} />
               <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.3, 0]} castShadow>
               <sphereGeometry args={[0.07, 16, 16]} />
               <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
         </group>
      </group>
      <group position={[-0.12, 0.5, 0]}>
         <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.5, 16, 16]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
         </mesh>
      </group>
      <group position={[0.12, 0.5, 0]}>
         <mesh castShadow>
            <capsuleGeometry args={[0.07, 0.5, 16, 16]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
         </mesh>
      </group>
    </group>
  );
}
