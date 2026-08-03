import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { useAvatarAnimation, AvatarAnimationState } from './anim/AvatarAnimationController';
import { PhysicalAppearance } from '../../types';
import { useValidatedGLBUrl } from './useValidatedGLBUrl';

interface AvatarGLTFModelProps {
  url: string;
  appearance?: PhysicalAppearance;
  pose?: AvatarAnimationState;
  clubColor?: string;
  quality?: 'low' | 'high';
}

export default function AvatarGLTFModel({ 
   url, 
   appearance, 
   pose = 'idle',
  clubColor,
  quality = 'low'
}: AvatarGLTFModelProps) {
  const group = useRef<THREE.Group>(null);
  
  // Validate and fetch the GLB securely before passing to GLTFLoader
  const validatedUrl = useValidatedGLBUrl(url);
  const { scene, materials, animations } = useGLTF(validatedUrl);
  
  // Clone the scene and skeleton safely to avoid mutating the cached useGLTF object
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Hook up animations
  useAvatarAnimation(animations, group, pose);

  useEffect(() => {
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Etapa 4 - Melhorar materiais para tirar aspecto de plástico
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.65;
          mat.metalness = 0.15;
          mat.envMapIntensity = 1.0;
          mat.needsUpdate = true;
        }
      }
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const normalizedName = bone.name.toLowerCase().replace(/mixamorig:?/g, '');
      }
    });
  }, [clone, appearance, quality]);

  // Cleanup clone when unmounted to free memory (but do NOT dispose shared geometry/material)
  useEffect(() => {
    return () => {
    };
  }, [clone]);

  return (
    <group ref={group} dispose={null} scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]}>
      <primitive object={clone} />
      
      {/* Etapa 5 - Uniforme Temporário (Overlay) */}
      {(!clubColor || clubColor === '#ffffff') && (
        <group>
          {/* Camisa */}
          <mesh position={[0, 0.62, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.20, 0.45, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.78, 0]} castShadow>
            <boxGeometry args={[0.55, 0.15, 0.22]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          
          {/* Escudo GOAT */}
          <Text position={[0.08, 0.72, 0.115]} fontSize={0.035} color="#FFD700" fontWeight="bold">
            GOAT
          </Text>
          
          {/* Numero 07 Costas */}
          <Text position={[0, 0.62, -0.115]} rotation={[0, Math.PI, 0]} fontSize={0.15} color="#FFD700" fontWeight="bold">
            07
          </Text>

          {/* Calção */}
          <mesh position={[0, 0.30, 0]} castShadow>
            <cylinderGeometry args={[0.23, 0.23, 0.3, 16]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>

          {/* Meiões */}
          <mesh position={[-0.1, 0.12, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.2, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0.1, 0.12, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.2, 16]} />
            <meshStandardMaterial color="#111111" />
          </mesh>

          {/* Chuteiras */}
          <mesh position={[-0.1, 0.02, 0.03]}>
            <boxGeometry args={[0.09, 0.06, 0.22]} />
            <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0.1, 0.02, 0.03]}>
            <boxGeometry args={[0.09, 0.06, 0.22]} />
            <meshStandardMaterial color="#FFD700" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Ensure the GLTF is preloaded when this module is parsed (or handle dynamically)
// Since url is dynamic here, we can't statically preload, but we can export a preloader helper
export const preloadAvatarModel = (url: string) => {
  useGLTF.preload(url);
};
