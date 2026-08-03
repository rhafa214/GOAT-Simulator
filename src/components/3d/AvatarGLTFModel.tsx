import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
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

  console.log('AvatarGLTFModel - Received URL:', url);
  console.log('AvatarGLTFModel - Final URL for useGLTF:', validatedUrl);

  const { scene, materials, animations } = useGLTF(validatedUrl);
  
  // Clone the scene and skeleton safely to avoid mutating the cached useGLTF object
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Hook up animations
  useAvatarAnimation(animations, group, pose);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('--- AvatarGLTFModel Loaded ---');
      console.log('Meshes:', scene.children);
      console.log('Animations found:', animations.length);
      console.log('Materials:', Object.keys(materials));
    }
  }, [scene, animations, materials]);

  useEffect(() => {
    // Example logic for applying appearance
    // This will be expanded once we have a real model with specific material slots
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = quality === 'high';
        mesh.receiveShadow = quality === 'high';
      }
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const normalizedName = bone.name.toLowerCase().replace(/mixamorig:?/g, '');
        // Strategy for Mixamo rigs: flexible bone mapping
        
        // Very basic stub to apply colors if materials match expected names
        // e.g. if (mesh.name === 'Body' && appearance?.skinColor) ...
      }
    });
  }, [clone, appearance, quality]);

  // Cleanup clone when unmounted to free memory (but do NOT dispose shared geometry/material)
  useEffect(() => {
    return () => {
      // SkeletonUtils.clone only clones the object graph, not geometries or materials.
      // We must not dispose geometry or materials because they are cached and shared by useGLTF.
      // If we dispose them here, re-rendering the component will result in invisible or broken meshes.
    };
  }, [clone]);

  // Adjust model scale to human size (~1.8m) if original is 1m tall
  // Rotate model to face camera if needed (assuming +Z is front, but we can rely on standard orientation)
  return (
    <group ref={group} dispose={null} scale={[1.8, 1.8, 1.8]} position={[0, 0, 0]}>
      <primitive object={clone} />
    </group>
  );
}

// Ensure the GLTF is preloaded when this module is parsed (or handle dynamically)
// Since url is dynamic here, we can't statically preload, but we can export a preloader helper
export const preloadAvatarModel = (url: string) => {
  useGLTF.preload(url);
};
