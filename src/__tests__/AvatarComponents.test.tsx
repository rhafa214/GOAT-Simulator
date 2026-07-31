import React from 'react';
import { render } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { PlayerPortrait } from '../components/ui/PlayerPortrait';
import AvatarScene from '../components/3d/AvatarScene';
import AvatarModel from '../components/3d/AvatarModel';
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
  test('AvatarModel renders without crashing', () => {
    const { container } = render(
      <AvatarModel appearance={mockAppearance} clubColor="#ff0000" pose="idle" />
    );
    expect(container).toBeDefined();
  });

  test('AvatarScene renders Canvas and Model', () => {
    const { getByTestId } = render(
      <AvatarScene appearance={mockAppearance} clubColor="#ff0000" pose="idle" />
    );
    expect(getByTestId('mock-canvas')).toBeDefined();
  });

  test('PlayerPortrait renders correctly wrapped with GameProvider', () => {
    const { getByTestId } = render(
      <GameProvider>
        <PlayerPortrait player={mockPlayer} />
      </GameProvider>
    );
    expect(getByTestId('mock-canvas')).toBeDefined();
  });
});
