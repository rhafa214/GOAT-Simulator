import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useValidatedGLBUrl } from '../../components/3d/useValidatedGLBUrl';

// Mock fetch globally
global.fetch = vi.fn();

describe('useValidatedGLBUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates and returns the original URL for a valid GLB binary', async () => {
    // Create a mock valid GLB header: glTF + version 2 + length
    const buffer = new ArrayBuffer(20);
    const view = new DataView(buffer);
    // 'glTF'
    view.setUint8(0, 0x67); // g
    view.setUint8(1, 0x6c); // l
    view.setUint8(2, 0x54); // T
    view.setUint8(3, 0x46); // F

    (global.fetch as any).mockResolvedValue({
      status: 200,
      headers: new Headers({
        'content-type': 'model/gltf-binary',
        'content-length': '20'
      }),
      arrayBuffer: () => Promise.resolve(buffer),
    });

    const url = 'https://example.com/model.glb';
    const { result } = renderHook(() => {
      try {
         return useValidatedGLBUrl(url);
      } catch (e) {
         if (e instanceof Promise) throw e;
         return { error: e };
      }
    });

    // Wait for promise to resolve
    await waitFor(() => {
      expect(result.current).toBe(url);
    });
  });

  it('throws error if file is too small', async () => {
    const buffer = new ArrayBuffer(10); // Too small
    (global.fetch as any).mockResolvedValue({
      status: 200,
      headers: new Headers({
        'content-type': 'model/gltf-binary',
        'content-length': '10'
      }),
      arrayBuffer: () => Promise.resolve(buffer),
    });

    const url = 'https://example.com/small.glb';
    const { result } = renderHook(() => {
      try {
         return useValidatedGLBUrl(url);
      } catch (e) {
         if (e instanceof Promise) throw e;
         return { error: e };
      }
    });

    await waitFor(() => {
      expect((result.current as any).error).toBeInstanceOf(Error);
      expect((result.current as any).error.message).toContain('too small');
    });
  });
});
