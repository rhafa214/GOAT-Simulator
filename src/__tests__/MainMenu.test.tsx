import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MainMenu from '../components/menu/MainMenu';
import { GameProvider } from '../engine/GameEngine';
import { SaveGameService, LocalStorageSaveRepository } from '../core/domain/saveSystem';

// Mock matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

function createMockSaveState(name: string, clubName: string, age: number, season: number, overall: number) {
  return {
    version: 2,
    timestamp: Date.now(),
    saveSlot: 'test_slot_1',
    phase: 'HUB',
    player: {
      id: 'p1',
      name,
      age,
      position: 'ST',
      overall,
      technical: { PAC: 85, SHO: 85, PAS: 85, DRI: 90, DEF: 50, PHY: 70, HEA: 60, VIS: 80, WF: 4, SM: 5, CON: 80, ACC: 85, STA: 75, JUM: 60, FK: 80, PEN: 80, CRE: 85 },
      rpg: { morale: 90, fitness: 100, fame: 80, fans: 100, LDR: 70, DET: 80, COM: 70 },
      relationships: { fans: 80, manager: 80, press: 70, squad: 80 },
      appearance: { skinColor: '#f1c27d', hairStyle: 'curto', hairColor: '#000000', facialHair: 'nenhum', facialHairColor: '#000000', eyes: 'castanho', mouth: 'padrao', nose: 'padrao', accessories: 'nenhum', tattoos: 'nenhum', height: 175, weight: 68, physique: 'Atlética', boots: 'preto', sleeves: 'Curtas', gloves: false, celebration: 'padrao' }
    },
    career: {
      season,
      year: 2026,
      week: 12,
      currentClub: {
        id: 'c1',
        name: clubName,
        tier: 1,
        reputation: 80,
        baseSalary: 10000,
        league: 'Brasileirão'
      },
      history: [],
      matches: [],
      transfers: [],
      awards: { ballonDor: 0, goldenBoot: 0, toty: 0, motm: 0 }
    },
    finances: { balance: 100000, weeklyWage: 5000, sponsors: [], assets: [] },
    narrative: { activeEvents: [], flags: {}, news: [], eventHistory: {} }
  };
}

describe('MainMenu Component — GOAT Simulator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders brand title, slogan, version badge, and main buttons', () => {
    render(
      <GameProvider>
        <MainMenu />
      </GameProvider>
    );

    // expect(screen.getAllByText(/GOAT SIMULATOR/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/O Fenômeno/i)).toBeInTheDocument();
    expect(screen.getByText(/v1.0.0 ALPHA/i)).toBeInTheDocument();
    expect(screen.getByText(/Iniciar Nova Carreira/i)).toBeInTheDocument();
    expect(screen.getByText(/Gerenciar Saves/i)).toBeInTheDocument();
    expect(screen.getByText(/Configurações/i)).toBeInTheDocument();
  });

  test('displays featured career card when save is present', () => {
    const service = new SaveGameService(new LocalStorageSaveRepository());
    const mockSaveState = createMockSaveState('Neymar Jr', 'Santos FC', 21, 2026, 88);
    service.saveGame('test_slot_1', mockSaveState as any);

    render(
      <GameProvider>
        <MainMenu />
      </GameProvider>
    );

    expect(screen.getByText('Neymar Jr')).toBeInTheDocument();
    expect(screen.getByText(/Santos FC/i)).toBeInTheDocument();
    expect(screen.getByText(/21 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/Temporada 2026/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continuar Carreira/i })).toBeInTheDocument();
  });

  test('opens and closes the Settings modal', () => {
    render(
      <GameProvider>
        <MainMenu />
      </GameProvider>
    );

    const settingsButton = screen.getByRole('button', { name: /Configurações/i });
    fireEvent.click(settingsButton);

    expect(screen.getByText(/Configurações do Simulador/i)).toBeInTheDocument();
    expect(screen.getByText(/Efeitos Sonoros & Áudio/i)).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /Salvar e Fechar/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Configurações do Simulador/i)).not.toBeInTheDocument();
  });

  test('opens Saves Manager modal and displays list of saves', () => {
    const service = new SaveGameService(new LocalStorageSaveRepository());
    const mockSaveState = createMockSaveState('Pelé', 'Santos FC', 18, 2026, 95);
    service.saveGame('test_slot_1', mockSaveState as any);

    render(
      <GameProvider>
        <MainMenu />
      </GameProvider>
    );

    const managerButton = screen.getByRole('button', { name: /Gerenciar Saves/i });
    fireEvent.click(managerButton);

    expect(screen.getByText(/Gerenciador de Carreiras/i)).toBeInTheDocument();
    expect(screen.getAllByText('Pelé')[0]).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: 'Fechar modal' });
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Gerenciador de Carreiras/i)).not.toBeInTheDocument();
  });

  test('opens Import Save modal when Importar button is clicked inside manager', () => {
    render(
      <GameProvider>
        <MainMenu />
      </GameProvider>
    );

    const managerButton = screen.getByRole('button', { name: /Gerenciar Saves/i });
    fireEvent.click(managerButton);

    const importButton = screen.getByRole('button', { name: /Importar Save/i });
    fireEvent.click(importButton);

    expect(screen.getByText(/Importar Carreira/i)).toBeInTheDocument();
    expect(screen.getByText(/Escolher Arquivo JSON/i)).toBeInTheDocument();
  });
});
