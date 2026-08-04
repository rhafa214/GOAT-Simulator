import React, { useMemo, useRef, useEffect } from "react";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import {
  useAvatarAnimation,
  AvatarAnimationState,
} from "./anim/AvatarAnimationController";
import { PhysicalAppearance } from "../../types";
import { useValidatedGLBUrl } from "./useValidatedGLBUrl";

interface AvatarGLTFModelProps {
  url: string;
  appearance?: PhysicalAppearance;
  pose?: AvatarAnimationState;
  clubColor?: string;
  quality?: "low" | "high";
}

export default function AvatarGLTFModel({
  url,
  appearance,
  pose = "idle",
  clubColor,
  quality = "low",
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
        const normalizedName = bone.name
          .toLowerCase()
          .replace(/mixamorig:?/g, "");
      }
    });
  }, [clone, appearance, quality]);

  // Cleanup clone when unmounted to free memory (but do NOT dispose shared geometry/material)
  useEffect(() => {
    return () => {};
  }, [clone]);

  return (
    <group ref={group} dispose={null} scale={[2.0, 2.0, 2.0]} position={[0, -1.5, 0]}>
      <primitive object={clone} />
    </group>
  );
}

// Ensure the GLTF is preloaded when this module is parsed (or handle dynamically)
// Since url is dynamic here, we can't statically preload, but we can export a preloader helper
export const preloadAvatarModel = (url: string) => {
  useGLTF.preload(url);
};
