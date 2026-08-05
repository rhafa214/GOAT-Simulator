import { useClubAppearance } from './appearance/ClubAppearanceProvider';
import React, { useMemo, useRef, useLayoutEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import {
  useAvatarAnimation,
  AvatarAnimationState,
} from "./anim/AvatarAnimationController";
import { PhysicalAppearance } from "../../types";
import { useProceduralIdle } from "./anim/useProceduralIdle";
import { useValidatedGLBUrl } from "./useValidatedGLBUrl";

interface AvatarGLTFModelProps {
  url: string;
  appearance?: PhysicalAppearance;
  pose?: AvatarAnimationState;
  clubColor?: string;
  quality?: "low" | "high";
  idleEnabled?: boolean;
}

export default function AvatarGLTFModel({
  url,
  appearance,
  pose = "idle",
  clubColor,
  quality = "low",
  idleEnabled = true,
}: AvatarGLTFModelProps) {
  const group = useRef<THREE.Group>(null);
  
  // Validate and fetch the GLB securely before passing to GLTFLoader
  const validatedUrl = useValidatedGLBUrl(url);
  const { scene, materials, animations } = useGLTF(validatedUrl);
  
  // Clone the scene and skeleton safely to avoid mutating the cached useGLTF object
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  
  // Hook up animations
  useAvatarAnimation(animations, group, pose);
  
  // Hook up procedural idle animation
  useProceduralIdle({ scene: clone, idleEnabled: idleEnabled && pose === "idle" });

      const { materialData, kitDefinition, clubId } = useClubAppearance() || {};
  
  // O modelo é padronizado em proporções humanas (aprox 1.8m).
  // Posicionamos rigidamente no chão (y = -1.5) para estabilidade no frame 1.
  // A câmera em AvatarScene.tsx se encarregará de enquadrar os ~70% corretos,
  // sem depender de BoundingBox flutuantes durante animações, evitando saltos de escala.
  const yOffset = -1.5;

      // Configuração inicial de materiais
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
  }, [clone, appearance, quality, materialData, clubColor, kitDefinition, clubId]);

  // Fade-in discreto usando mutate direto no loop
  const fadeRef = useRef({ val: 0 });
  useFrame(() => {
    if (fadeRef.current.val < 1) {
      fadeRef.current.val = Math.min(fadeRef.current.val + 0.04, 1);
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.opacity = fadeRef.current.val;
            
            // Restaura transparência original quando totalmente opaco
            if (fadeRef.current.val >= 1 && !mat.userData.wasTransparent) {
              mat.transparent = false;
            }
            // Força render sempre que atualiza a transparência
            // mat.needsUpdate = true no useFrame pode impactar performance,
            // mas THREE.js geralmente reage à mudança de mat.opacity e mat.transparent sem needsUpdate,
            // exceto quando se muda transparent de true para false.
            if (fadeRef.current.val >= 1 && !mat.userData.wasTransparent) {
               mat.needsUpdate = true;
            }
          }
        }
      });
    }
  });

  return (
    <group ref={group} dispose={null} position={[0, yOffset, 0]}>
      <primitive object={clone} />
    </group>
  );
}

export const preloadAvatarModel = (url: string) => {
  useGLTF.preload(url);
};
