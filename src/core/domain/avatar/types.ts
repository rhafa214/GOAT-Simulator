export interface AvatarModelDefinition {
  id: string;
  name: string;
  path: string;
  version: string;
  license: string;
  author: string;
  source: string;
  rigType: 'mixamo' | 'accurig' | 'humanoid' | 'none';
  animations: string[];
  materials?: string[];
  meshes?: string[];
  fileSizeKB?: number;
  status: 'available' | 'unavailable' | 'pending';
}

export interface AvatarAssetManifest {
  version: string;
  models: AvatarModelDefinition[];
}
