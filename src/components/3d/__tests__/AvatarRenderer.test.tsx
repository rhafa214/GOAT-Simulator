import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AvatarRenderer from '../AvatarRenderer';

// Mock child components to verify fallback logic
vi.mock('../LegacyAvatarModel', () => {
  return {
    default: () => <mesh data-testid="legacy-avatar-model" />
  };
});

// Create a mock implementation for AvatarGLTFModel that can throw
let shouldThrowGLTFError = false;
vi.mock('../AvatarGLTFModel', () => {
  return {
    default: (props: any) => {
      if (shouldThrowGLTFError) {
        throw new Error('GLTF Error');
      }
      return <group data-testid="avatar-gltf-model" data-url={props.url} />;
    }
  };
});

describe('AvatarRenderer', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    shouldThrowGLTFError = false;
    global.fetch = vi.fn();
  });

  it('renders LegacyAvatarModel if manifest fails to load', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    render(<AvatarRenderer />);
    
    await waitFor(() => {
      expect(screen.getByTestId('legacy-avatar-model')).toBeInTheDocument();
    });
  });

  it('renders LegacyAvatarModel if manifest has no available models (only pending)', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "model_pending",
            path: "/models/pending.glb",
            license: "MIT",
            rigType: "accurig",
            animations: [],
            status: "pending"
          }
        ]
      })
    });
    
    render(<AvatarRenderer />);
    
    await waitFor(() => {
      expect(screen.getByTestId('legacy-avatar-model')).toBeInTheDocument();
    });
  });

  it('renders AvatarGLTFModel when an available model is found', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "model_pending",
            path: "/models/pending.glb",
            license: "MIT",
            rigType: "accurig",
            animations: [],
            status: "pending"
          },
          {
            id: "model_available",
            name: "Available",
            path: "/models/available.glb",
            version: "1.0.0",
            license: "MIT",
            rigType: "humanoid",
            animations: [],
            meshes: [],
            fileSizeKB: 100,
            status: "available"
          }
        ]
      })
    });
    
    render(<AvatarRenderer />);
    
    await waitFor(() => {
      expect(screen.getByTestId('avatar-gltf-model')).toBeInTheDocument();
    });
  });

  it('renders LegacyAvatarModel if AvatarGLTFModel throws an error (ErrorBoundary fallback)', async () => {
    // Suppress React error boundary console output in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "model_available",
            name: "Available",
            path: "/models/available.glb",
            version: "1.0.0",
            license: "MIT",
            rigType: "humanoid",
            animations: [],
            meshes: [],
            fileSizeKB: 100,
            status: "available"
          }
        ]
      })
    });
    
    shouldThrowGLTFError = true;
    render(<AvatarRenderer />);
    
    await waitFor(() => {
      expect(screen.getByTestId('legacy-avatar-model')).toBeInTheDocument();
    });
  });
});
