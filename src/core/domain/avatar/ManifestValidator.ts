import { AvatarAssetManifest, AvatarModelDefinition } from './types';

export class ManifestValidator {
  static validate(manifest: any): AvatarAssetManifest {
    if (!manifest || typeof manifest !== 'object') {
      throw new Error('Manifest is invalid or empty');
    }
    
    if (!manifest.version || typeof manifest.version !== 'string') {
      throw new Error('Manifest is missing a valid version');
    }

    if (!Array.isArray(manifest.models)) {
      throw new Error('Manifest must contain an array of models');
    }

    const validModels = manifest.models.map(this.validateModel);

    return {
      version: manifest.version,
      models: validModels
    };
  }

  static validateModel(model: any): AvatarModelDefinition {
    if (!model.id || typeof model.id !== 'string') throw new Error('Model missing id');
    if (!model.path || typeof model.path !== 'string') throw new Error('Model missing path');
    if (!model.license || typeof model.license !== 'string') throw new Error('Model missing license');
    
    const isGLTF = model.path.toLowerCase().endsWith('.glb') || model.path.toLowerCase().endsWith('.gltf');
    if (!isGLTF) {
      throw new Error(`Model path ${model.path} is not a valid GLTF/GLB file`);
    }

    const status = model.status || 'unavailable';

    if (status !== 'pending') {
      // Limit size check (must be informed for non-pending models)
      if (typeof model.fileSizeKB !== 'number') {
        throw new Error('Model missing fileSizeKB');
      }
      if (!Array.isArray(model.meshes)) {
        throw new Error('Model missing meshes list');
      }
    }

    // Check animations and rig
    if (!model.rigType) {
      throw new Error('Model missing rigType');
    }

    if (!Array.isArray(model.animations)) {
      throw new Error('Model missing animations list');
    }

    return {
      id: model.id,
      name: model.name || 'Unknown',
      path: model.path,
      version: model.version || '1.0.0',
      license: model.license,
      author: model.author || 'Unknown',
      source: model.source || 'Unknown',
      rigType: model.rigType,
      animations: model.animations,
      materials: model.materials || [],
      meshes: model.meshes || [],
      fileSizeKB: model.fileSizeKB,
      status: status
    };
  }

  /**
   * Resolves the full URL for a model path ensuring compatibility with BASE_URL
   */
  static getModelUrl(model: AvatarModelDefinition): string {
    const baseUrl = import.meta.env.BASE_URL || '/';
    
    if (model.path.startsWith('/')) {
      // Create a URL object using the window origin
      // so we can reliably combine BASE_URL and the path
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const resolved = new URL(cleanBaseUrl + model.path, origin);
        return resolved.pathname;
      } catch (e) {
        return model.path;
      }
    }

    // Otherwise, assume it is relative to public/models/avatar/
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = `/${model.path}`;
    return `${cleanBaseUrl}/models/avatar${cleanPath}`;
  }
}
