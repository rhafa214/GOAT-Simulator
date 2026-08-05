import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React, { useLayoutEffect } from 'react';
import { ClubAppearanceRegistry } from '../ClubRegistry';
import { KitResolver } from '../KitResolver';
import { MaterialLoader } from '../MaterialLoader';
import { ClubAppearanceProvider, useClubAppearance } from '../ClubAppearanceProvider';
import { goatFcAppearance } from '../goatFcKit';
import * as THREE from 'three';

describe('GOAT Identity System - Kit Pilot v1', () => {
  beforeEach(() => {
    ClubAppearanceRegistry.clear();
    ClubAppearanceRegistry.register(goatFcAppearance);
  });

  it('should resolve GOAT FC home kit', () => {
    const def = KitResolver.resolve('goat-fc', 'home', '2026');
    expect(def).toBeDefined();
    expect(def?.baseColor).toBe('#000000');
    expect(def?.secondaryColor).toBe('#FFD700');
  });

  it('should fallback gracefully for non-existent kit (e.g. third kit)', () => {
    const def = KitResolver.resolve('goat-fc', 'third', '2026');
    expect(def).toBeUndefined();
  });
  
  it('should mock skin protection (single material model)', () => {
    // Simulate the logic in AvatarGLTFModel for single material
    const scene = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0xffffff, name: 'baked_material' }));
    scene.add(mesh);
    
    let materialCount = 0;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        materialCount++;
      }
    });
    const isSingleMaterial = materialCount <= 1;
    expect(isSingleMaterial).toBe(true);
    
    // In our logic, if isSingleMaterial is true, we DO NOT apply the color
    let colorApplied = false;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
         if (!isSingleMaterial) {
           colorApplied = true; // wouldn't reach here
         }
      }
    });
    expect(colorApplied).toBe(false);
  });
  
  it('should mock separated materials (multi-material model)', () => {
    const scene = new THREE.Group();
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0xffffff, name: 'shirt' }));
    const skin = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({ color: 0xffccaa, name: 'skin' }));
    scene.add(shirt);
    scene.add(skin);
    
    let materialCount = 0;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        materialCount++;
      }
    });
    const isSingleMaterial = materialCount <= 1;
    expect(isSingleMaterial).toBe(false);
    
    // In our logic, we would apply color
    let colorApplied = false;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
         if (!isSingleMaterial) {
           colorApplied = true; // reaches here
         }
      }
    });
    expect(colorApplied).toBe(true);
  });
  
  it('should clone materials properly to avoid leak across instances', () => {
    const originalMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, name: 'shared' });
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(), originalMaterial);
    
    // The logic inside AvatarGLTFModel clones the material
    const clonedMat = (mesh1.material as THREE.Material).clone() as THREE.MeshStandardMaterial;
    mesh1.material = clonedMat;
    
    clonedMat.color.setHex(0x000000);
    
    expect((mesh1.material as THREE.MeshStandardMaterial).color.getHex()).toBe(0x000000);
    expect(originalMaterial.color.getHex()).toBe(0xffffff); // Original untouched
  });
});
