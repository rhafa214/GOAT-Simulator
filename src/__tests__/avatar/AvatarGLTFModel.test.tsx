import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AvatarGLTFModel from '../../components/3d/AvatarGLTFModel';
import { useAvatarAnimation } from '../../components/3d/anim/AvatarAnimationController';
import { useGLTF } from '@react-three/drei';

// Mock drei's useGLTF
vi.mock('@react-three/drei', () => ({
  useGLTF: vi.fn(() => ({
    scene: {
      clone: vi.fn().mockReturnThis(),
      traverse: vi.fn()
    },
    animations: [],
    materials: {}
  }))
}));

// Mock our custom hook
vi.mock('../../components/3d/anim/AvatarAnimationController', () => ({
  useAvatarAnimation: vi.fn()
}));

// Mock three-stdlib
vi.mock('three-stdlib', () => ({
  SkeletonUtils: {
    clone: (scene: any) => ({
      traverse: vi.fn()
    })
  }
}));

// Mock Canvas / fiber context
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
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

  it('renders a static model when no animations or skeleton are present', () => {
    // Override the mock to return an empty scene with no animations
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
    // useAvatarAnimation should be called with an empty array of animations
    expect(useAvatarAnimation).toHaveBeenCalledWith([], expect.anything(), 'idle');
  });

  it('throws an error if GLTF load fails', () => {
    // Because @react-three/drei hooks are meant to be run inside <Suspense> and Fiber Canvas,
    // Testing Library throws Unhandled Error Bubbles when simulating render failing asynchronously.
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
