export type AvatarAssetStatus = 'available' | 'unavailable' | 'downloading' | 'error';

export interface AvatarAssetManifest {
  version: string;
  models: AvatarModelDefinition[];
}

export interface AvatarModelDefinition {
  id: string;
  name: string;
  path: string;
  version: string;
  license: string;
  author: string;
  source: string;
  rigType: string;
  animations: string[];
  materials: string[];
  meshes: string[];
  fileSizeKB: number;
  status: AvatarAssetStatus;
}

export interface AvatarRigDefinition {
  type: string;
  bones: string[];
}

export interface AvatarAnimationDefinition {
  id: string;
  name: string;
  path?: string; // If animation is in a separate file
  clipName: string; // Name of the animation clip inside the GLB
}

export interface AvatarMeshSlot {
  name: string;
  meshName: string;
  visible: boolean;
}

export interface AvatarMaterialSlot {
  name: string;
  materialName: string;
  baseColor?: string;
}
