import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UseProceduralIdleProps {
  scene: THREE.Object3D;
  idleEnabled?: boolean;
}

export function useProceduralIdle({ scene, idleEnabled = true }: UseProceduralIdleProps) {
  const bones = useRef<{
    spine_02?: THREE.Bone;
    spine_03?: THREE.Bone;
    neck_01?: THREE.Bone;
    head?: THREE.Bone;
    clavicle_l?: THREE.Bone;
    clavicle_r?: THREE.Bone;
    pelvis?: THREE.Bone;
  }>({});

  const initialRotations = useRef<Record<string, THREE.Euler>>({});
  const initialPositions = useRef<Record<string, THREE.Vector3>>({});
  const hasLoggedMissing = useRef(false);

  // Checks for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!scene) return;

    const currentBones: any = {};
    const currRotations: any = {};
    const currPositions: any = {};

    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        const bone = child as THREE.Bone;
        const name = bone.name.toLowerCase();
        
        if (name === 'spine_02') currentBones.spine_02 = bone;
        else if (name === 'spine_03') currentBones.spine_03 = bone;
        else if (name === 'neck_01') currentBones.neck_01 = bone;
        else if (name === 'head') currentBones.head = bone;
        else if (name === 'clavicle_l') currentBones.clavicle_l = bone;
        else if (name === 'clavicle_r') currentBones.clavicle_r = bone;
        else if (name === 'pelvis') currentBones.pelvis = bone;
      }
    });

    // Save initial state
    Object.keys(currentBones).forEach((key) => {
      const b = currentBones[key];
      currRotations[key] = b.rotation.clone();
      currPositions[key] = b.position.clone();
    });

    bones.current = currentBones;
    initialRotations.current = currRotations;
    initialPositions.current = currPositions;

    // Log missing bones in dev, once
    if (process.env.NODE_ENV === 'development' && !hasLoggedMissing.current) {
      const expected = ['spine_02', 'spine_03', 'neck_01', 'head', 'clavicle_l', 'clavicle_r', 'pelvis'];
      const missing = expected.filter(k => !currentBones[k]);
      if (missing.length > 0) {
        console.warn(`[ProceduralIdle] Missing bones for idle animation: ${missing.join(', ')}`);
      }
      hasLoggedMissing.current = true;
    }

    // Cleanup: restore original rotations when unmounting or changing scene
    return () => {
      Object.keys(bones.current).forEach((key) => {
        const b = (bones.current as any)[key];
        const initialR = initialRotations.current[key];
        const initialP = initialPositions.current[key];
        if (b && initialR) b.rotation.copy(initialR);
        if (b && initialP) b.position.copy(initialP);
      });
    };
  }, [scene]);

  useFrame((state) => {
    if (!idleEnabled || prefersReducedMotion) return;
    
    // Safely fallback if state/clock is missing (like in bad test mocks)
    if (!state || !state.clock) return;

    const t = state.clock.getElapsedTime();
    const b = bones.current;
    const initR = initialRotations.current;
    const initP = initialPositions.current;

    // --- Breathing (Thorax/Spine) ---
    // A slow sine wave for inhaling/exhaling
    const breathOffset = Math.sin(t * 1.2); 
    
    if (b.spine_02 && initR.spine_02) {
      b.spine_02.rotation.x = initR.spine_02.x + breathOffset * 0.01;
    }
    if (b.spine_03 && initR.spine_03) {
      b.spine_03.rotation.x = initR.spine_03.x + breathOffset * 0.015;
    }

    // --- Shoulders ---
    // Slight elevation synchronized with breathing
    if (b.clavicle_l && initR.clavicle_l) {
      b.clavicle_l.rotation.z = initR.clavicle_l.z - breathOffset * 0.01; 
    }
    if (b.clavicle_r && initR.clavicle_r) {
      b.clavicle_r.rotation.z = initR.clavicle_r.z + breathOffset * 0.01;
    }

    // --- Head/Neck ---
    // Very subtle, slower oscillation to give a natural look
    const headSway = Math.sin(t * 0.7);
    const headNod = Math.sin(t * 1.5);
    
    if (b.neck_01 && initR.neck_01) {
      b.neck_01.rotation.y = initR.neck_01.y + headSway * 0.005;
      b.neck_01.rotation.x = initR.neck_01.x + headNod * 0.005;
    }
    if (b.head && initR.head) {
      b.head.rotation.y = initR.head.y + headSway * 0.01;
      b.head.rotation.x = initR.head.x + headNod * 0.01;
    }

    // --- Hips (Weight Shift) ---
    // Imperceptible weight shift moving pelvis slightly up/down/side
    const weightShiftX = Math.sin(t * 0.5) * 0.002;
    const weightShiftY = Math.sin(t * 1.0) * 0.001;
    
    if (b.pelvis && initP.pelvis) {
      b.pelvis.position.x = initP.pelvis.x + weightShiftX;
      b.pelvis.position.y = initP.pelvis.y + weightShiftY;
    }
  });
}
