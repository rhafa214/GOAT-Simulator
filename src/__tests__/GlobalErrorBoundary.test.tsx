import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';
import { GlobalErrorBoundary } from '../components/ui/GlobalErrorBoundary';

const CrashingComponent = () => {
  throw new Error('Test global crash simulation');
};

describe('GlobalErrorBoundary', () => {
  test('renders children when no error occurs', () => {
    const { getByText } = render(
      <GlobalErrorBoundary>
        <div>All stable!</div>
      </GlobalErrorBoundary>
    );

    expect(getByText('All stable!')).toBeDefined();
  });

  test('captures child crash and displays error screen', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getByTestId } = render(
      <GlobalErrorBoundary>
        <CrashingComponent />
      </GlobalErrorBoundary>
    );

    expect(getByTestId('global-error-boundary')).toBeDefined();
    expect(getByTestId('reload-button')).toBeDefined();
    expect(getByTestId('back-to-menu-button')).toBeDefined();

    consoleSpy.mockRestore();
  });

  test('clicking reload triggers reload', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
    });

    const { getByTestId } = render(
      <GlobalErrorBoundary>
        <CrashingComponent />
      </GlobalErrorBoundary>
    );

    fireEvent.click(getByTestId('reload-button'));
    expect(reloadSpy).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});
