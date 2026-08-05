import { renderHook } from '@testing-library/react';
import { useProceduralIdle } from '../useProceduralIdle';
import * as THREE from 'three';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

// Mock useFrame
let frameCallback: (state: any) => void;
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => {
    frameCallback = cb;
  }
}));

describe('useProceduralIdle', () => {
  let originalMatchMedia: any;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // default to no reduced motion
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.clearAllMocks();
  });

  const createMockScene = () => {
    const scene = new THREE.Scene();
    
    const bones = ['spine_02', 'spine_03', 'neck_01', 'head', 'clavicle_l', 'clavicle_r', 'pelvis'];
    bones.forEach(name => {
      const bone = new THREE.Bone();
      bone.name = name;
      scene.add(bone);
    });
    
    return scene;
  };

  it('detects bones and applies animation without setState (testing frame execution)', () => {
    const scene = createMockScene();
    const warnSpy = vi.spyOn(console, 'warn');
    
    renderHook(() => useProceduralIdle({ scene }));
    
    // Should not warn about missing bones
    expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining('Missing bones'));
    
    // Simulate frame
    expect(frameCallback).toBeDefined();
    
    const spine02 = scene.getObjectByName('spine_02') as THREE.Bone;
    const initialRotX = spine02.rotation.x;
    
    frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    
    // Rotation should have changed procedurally
    expect(spine02.rotation.x).not.toBe(initialRotX);
  });

  it('handles fallback gracefully without skeleton (missing bones)', () => {
    const emptyScene = new THREE.Scene(); // No bones
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    renderHook(() => useProceduralIdle({ scene: emptyScene }));
    
    // In DEV, it should warn about missing bones
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Missing bones'));
    
    // Should not crash on frame
    expect(() => {
      frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    }).not.toThrow();
  });

  it('respects prefers-reduced-motion', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true, // Reduced motion enabled
    }));

    const scene = createMockScene();
    renderHook(() => useProceduralIdle({ scene }));
    
    const spine02 = scene.getObjectByName('spine_02') as THREE.Bone;
    const initialRotX = spine02.rotation.x;
    
    frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    
    // Rotation should NOT change
    expect(spine02.rotation.x).toBe(initialRotX);
  });

  it('restores original rotations/positions on unmount (no leak)', () => {
    const scene = createMockScene();
    const { unmount } = renderHook(() => useProceduralIdle({ scene }));
    
    const spine02 = scene.getObjectByName('spine_02') as THREE.Bone;
    const initialRotX = spine02.rotation.x;
    
    frameCallback({ clock: { getElapsedTime: () => 1.0 } });
    
    expect(spine02.rotation.x).not.toBe(initialRotX);
    
    // Unmount should restore
    unmount();
    
    expect(spine02.rotation.x).toBe(initialRotX);
  });
});

