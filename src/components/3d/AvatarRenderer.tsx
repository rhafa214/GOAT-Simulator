import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LegacyAvatarModel from './LegacyAvatarModel';
import AvatarGLTFModel from './AvatarGLTFModel';
import { PhysicalAppearance } from '../../types';
import { AvatarAssetManifest, AvatarModelDefinition } from '../../core/domain/avatar/types';
import { ManifestValidator } from '../../core/domain/avatar/ManifestValidator';

interface AvatarRendererProps {
  appearance?: PhysicalAppearance;
  pose?: 'idle' | 'confident' | 'celebration' | 'arms_crossed';
  clubColor?: string;
  quality?: 'low' | 'high';
}

export default function AvatarRenderer({
  appearance,
  pose = 'idle',
  clubColor = '#ffffff',
  quality = 'low'
}: AvatarRendererProps) {
  const [modelDef, setModelDef] = useState<AvatarModelDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManifest() {
      try {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const response = await fetch(`${cleanBaseUrl}/models/avatar/manifest.json`);
        
        if (!response.ok) {
          throw new Error('Manifest not found');
        }
        const data = await response.json();
        const manifest = ManifestValidator.validate(data);
        
        // Find a valid available model
        const availableModel = manifest.models.find(m => m.status === 'available');
        setModelDef(availableModel || null);
      } catch (err) {
        console.warn('Failed to load or validate avatar manifest, falling back to LegacyAvatarModel', err);
        setModelDef(null);
      } finally {
        setLoading(false);
      }
    }
    fetchManifest();
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <ErrorBoundary fallbackRender={({ error }) => {
      console.error("Avatar rendering error:", error);
      return <LegacyAvatarModel clubColor={clubColor} pose={pose} />;
    }}>
      {modelDef ? (
        
          <AvatarGLTFModel 
            url={ManifestValidator.getModelUrl(modelDef)}
            appearance={appearance}
            pose={pose as any}
            clubColor={clubColor}
            quality={quality}
          />
        
      ) : (
        <LegacyAvatarModel clubColor={clubColor} pose={pose} />
      )}
    </ErrorBoundary>
  );
}
