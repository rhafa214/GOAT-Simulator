import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, MeshDistortMaterial } from '@react-three/drei';
import { Group, MeshStandardMaterial, Color } from 'three';
import { PhysicalAppearance } from '../../types';

interface AvatarModelProps {
  appearance: PhysicalAppearance;
  clubColor: string;
  pose: string;
}

// Model loader component (Production Ready)
// Expects a standard Mixamo or ReadyPlayerMe rigged GLB
function GLTFAvatar({ url, appearance, pose }: { url: string, appearance: PhysicalAppearance, pose: string }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions[pose]) {
      actions[pose]?.reset().fadeIn(0.5).play();
    } else if (actions && actions['idle']) {
      actions['idle']?.reset().fadeIn(0.5).play();
    }
  }, [pose, actions]);

  // Dynamic materials based on appearance could be applied here
  // scene.traverse((child) => { ... })

  return <primitive ref={group} object={scene} />;
}

// Fallback procedural anatomical model (if GLB is not available)
function ProceduralAvatarFallback({ appearance, clubColor, pose }: AvatarModelProps) {
  const group = useRef<Group>(null);
  const chestRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  
  const skinColor = appearance.skinColor ? `#${appearance.skinColor}` : '#edb98a';
  const hairColor = appearance.hairColor ? `#${appearance.hairColor}` : '#2c1b18';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.5) * 0.02; // Idle breathing
    }
    if (headRef.current && pose === 'idle') {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* High-quality procedural fallback representing the 3D Avatar */}
      <group ref={chestRef} position={[0, 1.3, 0]}>
         <mesh castShadow>
           <cylinderGeometry args={[0.25, 0.2, 0.5, 32]} />
           <meshStandardMaterial color={clubColor} roughness={0.7} />
         </mesh>
         
         <group ref={headRef} position={[0, 0.4, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.15, 16]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            {/* Head */}
            <mesh castShadow position={[0, 0, 0]}>
              <sphereGeometry args={[0.15, 64, 64]} />
              <meshStandardMaterial color={skinColor} roughness={0.4} />
            </mesh>
            {/* Hair Placeholder */}
            <mesh position={[0, 0.12, -0.02]} castShadow>
              <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            {/* Simple Face Features */}
            <mesh position={[-0.05, 0.02, 0.14]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>
            <mesh position={[0.05, 0.02, 0.14]}>
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color="#111" roughness={0.2} />
            </mesh>
         </group>

         {/* Arms with Hands */}
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

      {/* Legs */}
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

export default function AvatarModel({ appearance, clubColor, pose }: AvatarModelProps) {
  // Toggle this true to use the GLB loader when a model is provided in the public folder.
  const useGLB = false;
  
  if (useGLB) {
    // This expects a rigged model in /models/player_base.glb
    // Fallback handles Suspense loading states in parent.
    return <GLTFAvatar url="/models/player_base.glb" appearance={appearance} pose={pose} />;
  }

  return <ProceduralAvatarFallback appearance={appearance} clubColor={clubColor} pose={pose} />;
}
