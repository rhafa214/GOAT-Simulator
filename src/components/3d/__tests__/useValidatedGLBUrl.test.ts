import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useValidatedGLBUrl } from '../useValidatedGLBUrl';

describe('useValidatedGLBUrl', () => {
  it('validates and returns the original URL immediately without fetching', () => {
    const url = 'https://example.com/model.glb';
    const { result } = renderHook(() => useValidatedGLBUrl(url));
    expect(result.current).toBe(url);
  });
});
