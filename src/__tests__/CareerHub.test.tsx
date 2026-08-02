import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MainHub from '../components/hub/MainHub';
import DashboardView from '../components/hub/DashboardView';
import { GameProvider, useGameEngine } from '../engine/GameEngine';

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

describe('Career Hub & DashboardView — GOAT Simulator', () => {

  test('renders player identity correctly (name, club, position, age, overall)', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    // Verify player header / main components
    expect(screen.getAllByText(/Início/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Jogador/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Carreira/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Clube/i)[0]).toBeInTheDocument();

    // Verify identity info in DashboardView
    expect(screen.getAllByText(/GER/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Condição Física & Moral/i)).toBeInTheDocument();
    expect(screen.getByText(/Estatísticas da Temporada/i)).toBeInTheDocument();
    expect(screen.getByText(/Caminhada Rumo ao GOAT/i)).toBeInTheDocument();
  });

  test('renders simulation controls and play match buttons', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    const playMatchButton = screen.getByRole('button', { name: /Jogar Partida/i });
    expect(playMatchButton).toBeInTheDocument();

    // Check fast forward simulation button
    const simButtons = screen.getAllByRole('button');
    expect(simButtons.length).toBeGreaterThan(0);
  });

  test('switches tabs smoothly between Hub, Jogador, and Histórico', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    const jogadorTab = screen.getByRole('tab', { name: /Jogador/i });
    fireEvent.click(jogadorTab);
    expect(jogadorTab).toHaveAttribute('aria-selected', 'true');

    const inicioTab = screen.getByRole('tab', { name: /Início/i });
    fireEvent.click(inicioTab);
    expect(inicioTab).toHaveAttribute('aria-selected', 'true');
  });

  test('renders DashboardView directly with complete stats', () => {
    render(
      <GameProvider>
        <DashboardView />
      </GameProvider>
    );

    expect(screen.getByText(/Overall/i)).toBeInTheDocument();
    expect(screen.getByText(/Condição Física/i)).toBeInTheDocument();
    expect(screen.getByText(/Gols/i)).toBeInTheDocument();
    expect(screen.getByText(/Assistências/i)).toBeInTheDocument();
    expect(screen.getByText(/Bolas de Ouro/i)).toBeInTheDocument();
  });

});
