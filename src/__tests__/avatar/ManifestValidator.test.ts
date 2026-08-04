import { describe, it, expect, vi } from 'vitest';
import { ManifestValidator } from '../../core/domain/avatar/ManifestValidator';

describe('ManifestValidator', () => {
  it('should validate a correct manifest', () => {
    const validManifest = {
      version: "1.0.0",
      models: [
        {
          id: "model_1",
          name: "Test Model",
          path: "test.glb",
          version: "1.0.0",
          license: "MIT",
          author: "Author",
          source: "Source",
          rigType: "humanoid" as const,
          animations: ["idle"],
          materials: ["mat1"],
          meshes: ["mesh1"],
          fileSizeKB: 1024,
          status: "available"
        }
      ]
    };
    
    const result = ManifestValidator.validate(validManifest);
    expect(result.version).toBe('1.0.0');
    expect(result.models).toHaveLength(1);
    expect(result.models[0].id).toBe('model_1');
  });

  it('should throw on missing version', () => {
    expect(() => ManifestValidator.validate({})).toThrow('Manifest is missing a valid version');
  });

  it('should throw on non-gltf path', () => {
    const invalidManifest = {
      version: "1.0.0",
      models: [
        {
          id: "model_1",
          path: "test.obj",
          license: "MIT",
          rigType: "humanoid" as const,
          animations: ["idle"],
          meshes: ["mesh1"],
          fileSizeKB: 1024
        }
      ]
    };
    
    expect(() => ManifestValidator.validate(invalidManifest)).toThrow('not a valid GLTF/GLB file');
  });

  it('should throw on missing license', () => {
    const invalidManifest = {
      version: "1.0.0",
      models: [
        {
          id: "model_1",
          path: "test.glb",
          rigType: "humanoid" as const,
          animations: ["idle"],
          meshes: ["mesh1"],
          fileSizeKB: 1024
        }
      ]
    };
    
    expect(() => ManifestValidator.validate(invalidManifest)).toThrow('Model missing license');
  });

  it('should throw on missing animations list', () => {
    const invalidManifest = {
      version: "1.0.0",
      models: [
        {
          id: "model_1",
          path: "test.glb",
          license: "MIT",
          rigType: "humanoid" as const,
          meshes: ["mesh1"],
          fileSizeKB: 1024
        }
      ]
    };
    
    expect(() => ManifestValidator.validate(invalidManifest)).toThrow('Model missing animations list');
  });

  it('should resolve correct model URL with BASE_URL', () => {
    // Mock import.meta.env
    vi.stubEnv('BASE_URL', '/GOAT-Simulator/');
    
    const model = {
      id: "model_1",
      name: "Test Model",
      path: "test.glb",
      version: "1.0.0",
      license: "MIT",
      author: "Author",
      source: "Source",
      rigType: "humanoid" as const,
      animations: ["idle"],
      materials: ["mat1"],
      meshes: ["mesh1"],
      fileSizeKB: 1024,
      status: "available" as const
    };
    
    const url = ManifestValidator.getModelUrl(model);
    expect(url).toBe('/GOAT-Simulator/models/avatar/test.glb');
    
    vi.unstubAllEnvs();
  });
});

describe('ManifestValidator - Pending Status', () => {
  it('should allow missing fileSizeKB and meshes when status is pending', () => {
    const pendingManifest = {
      version: "1.0.0",
      models: [
        {
          id: "model_pending",
          path: "/models/characters/default/goat_player.glb",
          license: "MIT",
          rigType: "accurig",
          animations: [],
          status: "pending"
        }
      ]
    };
    
    const result = ManifestValidator.validate(pendingManifest);
    expect(result.models[0].status).toBe('pending');
    expect(result.models[0].fileSizeKB).toBeUndefined();
    expect(result.models[0].meshes).toEqual([]);
  });

  it('should resolve absolute path correctly with getModelUrl', () => {
    vi.stubEnv('BASE_URL', '/GOAT-Simulator/');
    
    // Stub window object to test the URL resolution logic correctly
    const originalWindow = global.window;
    global.window = { location: { origin: 'http://localhost' } } as any;

    const model = {
      id: "model_absolute",
      name: "Test Model",
      path: "/models/characters/default/goat_player.glb",
      version: "1.0.0",
      license: "MIT",
      author: "Author",
      source: "Source",
      rigType: "humanoid" as const,
      animations: [],
      status: "pending" as const
    };
    
    const url = ManifestValidator.getModelUrl(model);
    expect(url).toBe('/GOAT-Simulator/models/characters/default/goat_player.glb');
    
    vi.unstubAllEnvs();
    global.window = originalWindow;
  });
});
