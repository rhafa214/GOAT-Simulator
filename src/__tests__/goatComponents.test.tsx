import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import {
  GOAT_TOKENS,
  GoatCard,
  GoatButton,
  GoatBadge,
  GoatStatHeader,
  GoatModal,
  GoatNumberCounter,
  GoatShowcase
} from '../components/ui/goat';

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

describe('GOAT Design System — Tokens and Components', () => {
  describe('GOAT_TOKENS', () => {
    test('defines correct Pitch Black & GOAT Gold colors', () => {
      expect(GOAT_TOKENS.colors.background.pitch).toBe('#000000');
      expect(GOAT_TOKENS.colors.brand.gold).toBe('#F59E0B');
    });
  });

  describe('GoatCard', () => {
    test('renders children correctly', () => {
      render(<GoatCard>Conteúdo do Card</GoatCard>);
      expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
    });

    test('handles interactive click and keydown', () => {
      const handleClick = vi.fn();
      render(
        <GoatCard interactive onClick={handleClick}>
          Card Clicável
        </GoatCard>
      );
      const card = screen.getByRole('button');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test('renders oblique header when enabled', () => {
      render(
        <GoatCard obliqueHeader headerTitle="Header Tático">
          Corpo
        </GoatCard>
      );
      expect(screen.getByText('Header Tático')).toBeInTheDocument();
    });
  });

  describe('GoatButton', () => {
    test('renders label and handles click', () => {
      const handleClick = vi.fn();
      render(<GoatButton onClick={handleClick}>Ação Principal</GoatButton>);
      const button = screen.getByRole('button', { name: /ação principal/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('shows spinner when isLoading is true', () => {
      render(<GoatButton isLoading>Ação Principal</GoatButton>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    test('supports different variants and sizes', () => {
      const { rerender } = render(
        <GoatButton variant="danger" size="lg">
          Excluir
        </GoatButton>
      );
      expect(screen.getByRole('button')).toHaveClass('bg-rose-600');

      rerender(
        <GoatButton variant="outline" size="sm">
          Cancelar
        </GoatButton>
      );
      expect(screen.getByRole('button')).toHaveClass('border-amber-500/80');
    });
  });

  describe('GoatBadge', () => {
    test('renders badge text and icon', () => {
      render(
        <GoatBadge variant="victory" icon={<span data-testid="badge-icon">★</span>}>
          Vitória
        </GoatBadge>
      );
      expect(screen.getByText('Vitória')).toBeInTheDocument();
      expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    });
  });

  describe('GoatStatHeader', () => {
    test('renders label, value, subValue, and trend', () => {
      render(
        <GoatStatHeader
          label="Overall"
          value="95"
          subValue="GER"
          trend="up"
          trendValue="+2"
          highlight
        />
      );
      expect(screen.getByText('Overall')).toBeInTheDocument();
      expect(screen.getByText('95')).toBeInTheDocument();
      expect(screen.getByText('GER')).toBeInTheDocument();
      expect(screen.getByText('+2')).toBeInTheDocument();
    });
  });

  describe('GoatModal', () => {
    test('renders nothing when isOpen is false', () => {
      render(
        <GoatModal isOpen={false} onClose={vi.fn()}>
          Conteúdo Oculto
        </GoatModal>
      );
      expect(screen.queryByText('Conteúdo Oculto')).not.toBeInTheDocument();
    });

    test('renders modal content and responds to close button and ESC key', () => {
      const handleClose = vi.fn();
      render(
        <GoatModal isOpen={true} onClose={handleClose} title="Título do Modal">
          Conteúdo do Modal
        </GoatModal>
      );
      expect(screen.getByText('Título do Modal')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo do Modal')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /fechar modal/i });
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('GoatNumberCounter', () => {
    test('renders formatted currency or number', () => {
      render(<GoatNumberCounter value={50000} formatCurrency duration={0} />);
      expect(screen.getByText(/50\.000/)).toBeInTheDocument();
    });
  });

  describe('GoatShowcase', () => {
    test('renders showcase component successfully', () => {
      render(<GoatShowcase />);
      expect(screen.getByText(/GOAT Design System — Visual Showcase/i)).toBeInTheDocument();
    });
  });
});
