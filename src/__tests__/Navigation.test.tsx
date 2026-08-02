import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MainHub from '../components/hub/MainHub';
import CreationDraftClub from '../components/creation/CreationDraftClub';
import SettingsModal from '../components/hub/SettingsModal';
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

describe('Complete Navigation & Keyboard Shortcuts — GOAT Simulator', () => {

  test('renders all 13 primary/secondary navigation areas smoothly', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    // Primary Navbar category buttons
    expect(screen.getAllByText(/Início/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Jogador/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Carreira & Clube/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Competições & Notícias/i)[0]).toBeInTheDocument();
  });

  test('navigates through categories and updates sub-nav breadcrumbs', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    // Click Jogador category
    const jogadorCat = screen.getAllByRole('tab', { name: /Jogador/i })[0];
    fireEvent.click(jogadorCat);

    // Verify sub-tabs appear (Atributos & Perfil, Treinos)
    expect(screen.getAllByText(/Atributos & Perfil/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Treinos/i)[0]).toBeInTheDocument();

    // Click Carreira & Clube category
    const carreiraCat = screen.getAllByRole('tab', { name: /Carreira & Clube/i })[0];
    fireEvent.click(carreiraCat);

    expect(screen.getAllByText(/Contrato & Agente/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Informações do Clube/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Transferências/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Sala de Troféus/i)[0]).toBeInTheDocument();
  });

  test('supports keyboard navigation shortcuts (1/H for Hub, 2/J for Jogador, Esc to return)', () => {
    render(
      <GameProvider>
        <MainHub />
      </GameProvider>
    );

    // Press '2' key to switch to Jogador
    fireEvent.keyDown(window, { key: '2' });
    expect(screen.getAllByText(/Atributos & Perfil/i)[0]).toBeInTheDocument();

    // Press '3' key to switch to Carreira
    fireEvent.keyDown(window, { key: '3' });
    expect(screen.getAllByText(/Contrato & Agente/i)[0]).toBeInTheDocument();

    // Press 'Escape' key to return to Hub (Início)
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText(/Caminhada Rumo ao GOAT/i)).toBeInTheDocument();
  });

  test('opens and closes Settings Modal securely with save controls', () => {
    render(
      <GameProvider>
        <SettingsModal isOpen={true} onClose={vi.fn()} />
      </GameProvider>
    );

    expect(screen.getByText(/Ajustes gerais do jogo e gerenciamento de carreira/i)).toBeInTheDocument();
    expect(screen.getByText(/Efeitos Sonoros/i)).toBeInTheDocument();
    expect(screen.getByText(/Salvar Progresso/i)).toBeInTheDocument();

    const exitBtn = screen.getByRole('button', { name: /Sair para o Menu Principal/i });
    fireEvent.click(exitBtn);

    expect(screen.getByText(/Confirmar Saída/i)).toBeInTheDocument();
  });

  test('protects against accidental exit during Draft Club creation phase', () => {
    render(
      <GameProvider>
        <CreationDraftClub />
      </GameProvider>
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancelar Criação/i });
    fireEvent.click(cancelBtn);

    expect(screen.getByText(/Cancelar Criação\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Todo o progresso de atributos, nome e personalidade deste jogador será descartado/i)).toBeInTheDocument();
  });

});
