import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AvatarRenderer from '../../components/3d/AvatarRenderer';

// Mock fetch for manifest
global.fetch = vi.fn();

vi.mock('../../components/3d/AvatarGLTFModel', () => ({
  default: ({ url }: { url: string }) => <div data-testid="avatar-gltf-model">{url}</div>
}));

vi.mock('../../components/3d/LegacyAvatarModel', () => ({
  default: () => <div data-testid="legacy-avatar-model">Legacy</div>
}));

describe('AvatarRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "goat_base_human_v1",
            name: "GOAT Base Human",
            path: "goat_base_human_v1.glb",
            status: "available",
            version: "1.0.0",
            rigType: "humanoid",
            animations: [],
            materials: [],
            meshes: ["mesh"],
            license: "Tripo AI",
            fileSizeKB: 1000
          }
        ]
      })
    });
    vi.stubEnv('BASE_URL', '/');
  });

  it('loads manifest and selects available model', async () => {
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('avatar-gltf-model')).toBeDefined();
    });
    expect(screen.getByTestId('avatar-gltf-model').textContent).toBe('/models/avatar/goat_base_human_v1.glb');
  });

  it('prefers rigged model when available', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "goat_base_human_v1_rigged",
            name: "GOAT Base Human Rigged",
            path: "goat_base_human_v1_rigged.glb",
            status: "available",
            version: "1.0.0",
            rigType: "mixamo",
            animations: ["idle"],
            materials: [],
            meshes: ["mesh"],
            license: "Tripo AI",
            fileSizeKB: 1000
          },
          {
            id: "goat_base_human_v1",
            name: "GOAT Base Human",
            path: "goat_base_human_v1.glb",
            status: "available",
            version: "1.0.0",
            rigType: "humanoid",
            animations: [],
            materials: [],
            meshes: ["mesh"],
            license: "Tripo AI",
            fileSizeKB: 1000
          }
        ]
      })
    });
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('avatar-gltf-model')).toBeDefined();
    });
    // First available should be the rigged one
    expect(screen.getByTestId('avatar-gltf-model').textContent).toBe('/models/avatar/goat_base_human_v1_rigged.glb');
  });

  it('falls back to static model if rigged is unavailable', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "goat_base_human_v1_rigged",
            name: "GOAT Base Human Rigged",
            path: "goat_base_human_v1_rigged.glb",
            status: "unavailable", // Unavailable!
            version: "1.0.0",
            rigType: "mixamo",
            animations: ["idle"],
            materials: [],
            meshes: ["mesh"],
            license: "Tripo AI",
            fileSizeKB: 1000
          },
          {
            id: "goat_base_human_v1",
            name: "GOAT Base Human",
            path: "goat_base_human_v1.glb",
            status: "available",
            version: "1.0.0",
            rigType: "humanoid",
            animations: [],
            materials: [],
            meshes: ["mesh"],
            license: "Tripo AI",
            fileSizeKB: 1000
          }
        ]
      })
    });
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('avatar-gltf-model')).toBeDefined();
    });
    // Should fallback to static
    expect(screen.getByTestId('avatar-gltf-model').textContent).toBe('/models/avatar/goat_base_human_v1.glb');
  });

  it('uses BASE_URL correctly for github pages', async () => {
    vi.stubEnv('BASE_URL', '/repo-name/');
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('avatar-gltf-model')).toBeDefined();
    });
    expect(global.fetch).toHaveBeenCalledWith('/repo-name/models/avatar/manifest.json');
    expect(screen.getByTestId('avatar-gltf-model').textContent).toBe('/repo-name/models/avatar/goat_base_human_v1.glb');
  });

  it('falls back to LegacyAvatarModel on manifest failure', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('legacy-avatar-model')).toBeDefined();
    });
  });

  it('falls back to LegacyAvatarModel if no available model', async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({
        version: "1.0.0",
        models: [
          {
            id: "placeholder",
            path: "placeholder.glb",
            status: "unavailable"
          }
        ]
      })
    });
    render(<AvatarRenderer />);
    await waitFor(() => {
      expect(screen.getByTestId('legacy-avatar-model')).toBeDefined();
    });
  });
});
