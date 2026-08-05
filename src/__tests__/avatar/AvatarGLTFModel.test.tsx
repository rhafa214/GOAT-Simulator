import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AvatarGLTFModel from '../../components/3d/AvatarGLTFModel';
import { useAvatarAnimation } from '../../components/3d/anim/AvatarAnimationController';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Mock our custom validation hook
vi.mock('../../components/3d/useValidatedGLBUrl', () => ({
  useValidatedGLBUrl: vi.fn((url) => url) // just return the url
}));

// Mock drei's useGLTF
vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(() => ({
    scene: {
      clone: vi.fn().mockReturnThis(),
      traverse: vi.fn()
    },
    animations: [],
    materials: {}
  })),
  Text: ({ children }: any) => <group data-testid="mock-text">{children}</group>
}));

// Mock our custom hook
vi.mock('../../components/3d/anim/AvatarAnimationController', () => ({
  useAvatarAnimation: vi.fn()
}));

// Mock three-stdlib
vi.mock('three-stdlib', () => ({
  SkeletonUtils: {
    clone: (scene: any) => {
      const g = new THREE.Group();
      g.traverse = vi.fn();
      return g;
    }
  }
}));

// Mock Canvas / fiber context
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn((callback) => callback()), // Execute the callback immediately to cover fade-in
  useThree: vi.fn(() => ({
     camera: {
       type: 'PerspectiveCamera',
       fov: 35,
       position: { set: vi.fn() },
       updateProjectionMatrix: vi.fn()
     },
     controls: {
       target: { set: vi.fn() },
       update: vi.fn()
     }
  })),
  Canvas: ({ children }: any) => <div data-testid="mock-canvas">{children}</div>
}));

describe('AvatarGLTFModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders successfully with a given url', () => {
    const { container } = render(
      <AvatarGLTFModel url="test.glb" pose="idle" />
    );
    expect(container).toBeDefined();
  });

  it('passes pose to useAvatarAnimation', () => {
    render(
      <AvatarGLTFModel url="test.glb" pose="idle" />
    );
    expect(useAvatarAnimation).toHaveBeenCalledWith([], expect.anything(), 'idle');
  });

  it('detects mixamo animation and plays correctly', () => {
    (useGLTF as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      scene: {
        children: [{ isMesh: true, name: 'mesh', isSkinnedMesh: true }],
        traverse: vi.fn(),
        clone: vi.fn().mockReturnThis()
      },
      animations: [{ name: 'mixamo.com' }],
      materials: {}
    }));

    render(
      <AvatarGLTFModel url="mixamo.glb" pose="idle" />
    );
    expect(useAvatarAnimation).toHaveBeenCalledWith([{ name: 'mixamo.com' }], expect.anything(), 'idle');
  });

  it('renders a static model when no animations or skeleton are present', () => {
    (useGLTF as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => ({
      scene: {
        children: [{ isMesh: true, name: 'static_mesh' }],
        traverse: vi.fn(),
        clone: vi.fn().mockReturnThis()
      },
      animations: [],
      materials: {}
    }));

    const { container } = render(
      <AvatarGLTFModel url="static.glb" pose="idle" />
    );
    expect(container).toBeDefined();
    expect(useAvatarAnimation).toHaveBeenCalledWith([], expect.anything(), 'idle');
  });

  it('throws an error if GLTF load fails', () => {
    (useGLTF as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('GLTF Error');
    });

    const TestComponent = () => {
      try {
        AvatarGLTFModel({ url: "broken.glb", pose: "idle" });
      } catch (e: any) {
        if (e.message === 'GLTF Error') {
          return <div data-testid="error-caught">Caught</div>;
        }
      }
      return <div data-testid="no-error">No Error</div>;
    };

    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('error-caught')).toBeDefined();
  });
});
