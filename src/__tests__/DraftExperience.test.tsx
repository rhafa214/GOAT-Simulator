import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { DraftExperience } from '../components/creation/DraftExperience';
import { GameProvider } from '../engine/GameEngine';

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

describe('Draft Experience — GOAT Simulator', () => {
  test('renders draft controls and current attribute round', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    expect(screen.getByText(/Draft Rápido \(8\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Blind Draft/i)).toBeInTheDocument();
    expect(screen.getByText(/Atributo Alvo — Rodada 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Progresso do Draft/i)).toBeInTheDocument();
  });

  test('allows inspecting cards without automatic selection', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    const card2 = screen.getByLabelText(/Carta 2/i);
    fireEvent.click(card2);

    // Card 2 is now inspected and shows the explicit "Confirmar Escolha" button
    expect(screen.getByRole('button', { name: /Confirmar Escolha/i })).toBeInTheDocument();
    // Verify we remain on Round 1
    expect(screen.getAllByText(/Rodada 1 de 8/i)[0]).toBeInTheDocument();
  });

  test('confirms choice only when clicking Confirmar Escolha', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    // Inspect Card 1
    const card1 = screen.getByLabelText(/Carta 1/i);
    fireEvent.click(card1);

    // Click Confirm button
    const confirmBtn = screen.getByRole('button', { name: /Confirmar Escolha/i });
    fireEvent.click(confirmBtn);

    // Expect progression to Round 2
    await waitFor(() => {
      expect(screen.getAllByText(/Rodada 2 de 8/i)[0]).toBeInTheDocument();
    });
  });

  test('supports keyboard shortcuts for inspecting (1-5) and confirming (Enter)', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    // Press '3' key to inspect card 3
    fireEvent.keyDown(window, { key: '3' });
    expect(screen.getByLabelText(/Carta 3/i)).toBeInTheDocument();

    // Press 'Enter' key to confirm choice
    fireEvent.keyDown(window, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getAllByText(/Rodada 2 de 8/i)[0]).toBeInTheDocument();
    });
  });

  test('opens and closes the choices review modal via button or shortcut (R)', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    // Press 'R' key
    fireEvent.keyDown(window, { key: 'R' });
    expect(screen.getByText(/Histórico de Escolhas do Draft/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Fechar \(Esc\)/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Histórico de Escolhas do Draft/i)).not.toBeInTheDocument();
  });

  test('toggles speed setting via A key', async () => {
    render(
      <GameProvider>
        <DraftExperience initialMode="QUICK" />
      </GameProvider>
    );

    expect(screen.getByText(/1x/i)).toBeInTheDocument();
    // Press 'A' key to speed up
    fireEvent.keyDown(window, { key: 'A' });
    expect(screen.getByText(/2x/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'A' });
    expect(screen.getByText(/inst/i)).toBeInTheDocument();
  });
});
