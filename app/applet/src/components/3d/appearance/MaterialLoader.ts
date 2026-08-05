import { KitDefinition } from './types';
// In a full implementation, we'd import THREE and TextureLoader here

export interface LoadedMaterialData {
  color?: string;
  // Future: map?: THREE.Texture, normalMap?: THREE.Texture, etc.
}

export class MaterialLoader {
  static async loadKitMaterial(kit: KitDefinition): Promise<LoadedMaterialData> {
    // Future: This will actually load GLTF/Texture files from KitDefinition.textures
    
    // For this architectural step, we just return the fallback colors 
    // to prove the flow works without downloading big assets yet.
    return {
      color: kit.baseColor || kit.primaryColor || '#ffffff',
    };
  }
}
