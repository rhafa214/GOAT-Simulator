import { AvatarManagerProvider, useAvatarManager } from '../components/3d/AvatarManager';
import React from 'react';
import { render, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { PlayerPortrait, AvatarErrorBoundary, PlayerPortraitFallback } from '../components/ui/PlayerPortrait';
import AvatarScene from '../components/3d/AvatarScene';
import AvatarModel from '../components/3d/LegacyAvatarModel';
import { GameProvider } from '../engine/GameEngine';

// Mock Three.js/Fiber elements since they don't render in jsdom easily
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="mock-orbit-controls" />,
  Environment: () => <div data-testid="mock-environment" />,
  ContactShadows: () => <div data-testid="mock-contact-shadows" />,
  PerspectiveCamera: () => <div data-testid="mock-perspective-camera" />,
  useGLTF: () => ({ scene: {}, animations: [] }),
  useAnimations: () => ({ actions: {} }),
  MeshDistortMaterial: () => <div />,
}));

const mockAppearance = {
  skinColor: 'f8d2b9',
  hairStyle: 'short',
  hairColor: '000000',
  facialHair: 'none',
  facialHairColor: '000000',
  eyes: 'normal',
  mouth: 'smile',
  nose: 'Pequeno',
  accessories: 'none',
  tattoos: 'none',
  height: 180,
  weight: 75,
  physique: 'Atlética' as const,
  boots: 'Pretas Clássicas',
  sleeves: 'Curtas' as const,
  gloves: false,
  celebration: 'Salto e Soco no Ar'
};

const mockPlayer = {
  name: 'Test',
  avatarUrl: '',
  age: 20,
  position: 'ST' as const,
  nationality: 'BR',
  personality: 'PROFESSIONAL' as const,
  appearance: mockAppearance,
  technical: { PAC: 50, SHO: 50, PAS: 50, DRI: 50, DEF: 50, PHY: 50, HEA: 50, VIS: 50, WF: 3, SM: 3, CON: 50, ACC: 50, STA: 50, JUM: 50, FK: 50, PEN: 50, CRE: 50 },
  rpg: { morale: 100, fitness: 100, fame: 0, fans: 0, LDR: 50, DET: 50, COM: 50 },
  relationships: { press: 50, fans: 50, manager: 50, squad: 50 }
};

describe('Avatar Components', () => {
  const originalWebGLRenderingContext = (window as any).WebGLRenderingContext;

  beforeEach(() => {
    // Enable WebGL support by default
    (window as any).WebGLRenderingContext = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function(this: HTMLCanvasElement, contextId: string) {
      if (contextId === 'webgl' || contextId === 'experimental-webgl') {
        return {} as any;
      }
      return null;
    });
  });

  afterEach(() => {
    (window as any).WebGLRenderingContext = originalWebGLRenderingContext;
    vi.restoreAllMocks();
  });

  test('AvatarModel renders without crashing', () => {
    const { container } = render(
      <AvatarManagerProvider initialAppearance={mockAppearance}>
        <AvatarModel clubColor="#ff0000" pose="idle" />
      </AvatarManagerProvider>
    );
    expect(container).toBeDefined();
  });

  test('AvatarScene renders Canvas and Model', () => {
    const { getByTestId } = render(
      <AvatarManagerProvider initialAppearance={mockAppearance}>
        <AvatarScene clubColor="#ff0000" pose="idle" />
      </AvatarManagerProvider>
    );
    expect(getByTestId('mock-canvas')).toBeDefined();
  });

  test('PlayerPortrait renderizado sem provider externo', async () => {
    const { getByTestId } = render(
      <GameProvider>
        <PlayerPortrait player={mockPlayer} />
      </GameProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(getByTestId('player-portrait-container')).toBeDefined();
  });

  test('aparência passada ao provider', () => {
    const TestConsumer = () => {
      const { appearance } = useAvatarManager();
      return <div data-testid="skin-color">{appearance.skinColor}</div>;
    };

    const { getByTestId } = render(
      <AvatarManagerProvider initialAppearance={{ skinColor: 'aabbcc' }}>
        <TestConsumer />
      </AvatarManagerProvider>
    );

    expect(getByTestId('skin-color').textContent).toBe('aabbcc');
  });

  test('atualização da aparência', () => {
    const TestConsumer = () => {
      const { appearance } = useAvatarManager();
      return <div data-testid="skin-color">{appearance.skinColor}</div>;
    };

    const { getByTestId, rerender } = render(
      <AvatarManagerProvider initialAppearance={{ skinColor: '111111' }}>
        <TestConsumer />
      </AvatarManagerProvider>
    );

    expect(getByTestId('skin-color').textContent).toBe('111111');

    rerender(
      <AvatarManagerProvider initialAppearance={{ skinColor: '222222' }}>
        <TestConsumer />
      </AvatarManagerProvider>
    );

    expect(getByTestId('skin-color').textContent).toBe('222222');
  });

  test('erro do Canvas capturado pelo Error Boundary', () => {
    const CrashingComponent = () => {
      throw new Error('Simulated Canvas/3D Crash');
    };

    const fallback = <div data-testid="fallback-test">Custom Fallback</div>;
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId } = render(
      <AvatarErrorBoundary fallback={fallback}>
        <CrashingComponent />
      </AvatarErrorBoundary>
    );

    expect(getByTestId('fallback-test')).toBeDefined();
    consoleSpy.mockRestore();
  });

  test('WebGL indisponível exibe fallback 2D', async () => {
    // Disable WebGL support specifically for this test
    delete (window as any).WebGLRenderingContext;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    const { getByTestId, queryByTestId } = render(
      <GameProvider>
        <PlayerPortrait player={mockPlayer} />
      </GameProvider>
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(getByTestId('player-portrait-fallback')).toBeDefined();
    expect(queryByTestId('player-portrait-container')).toBeNull();
  });

  test('fallback 2D renderiza silhueta e botão de tentar novamente', () => {
    const onRetrySpy = vi.fn();
    const { getByTestId } = render(
      <PlayerPortraitFallback clubColor="#00ff00" onRetry={onRetrySpy} />
    );

    expect(getByTestId('avatar-fallback-silhouette')).toBeDefined();
    
    const retryBtn = getByTestId('retry-avatar-button');
    expect(retryBtn).toBeDefined();

    retryBtn.click();
    expect(onRetrySpy).toHaveBeenCalledTimes(1);
  });

  test('AvatarScene isolado com provider', () => {
    const { getByTestId } = render(
      <AvatarManagerProvider initialAppearance={mockAppearance}>
        <AvatarScene clubColor="#112233" pose="idle" />
      </AvatarManagerProvider>
    );

    expect(getByTestId('mock-canvas')).toBeDefined();
  });
});
