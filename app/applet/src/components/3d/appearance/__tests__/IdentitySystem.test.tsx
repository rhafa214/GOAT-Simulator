import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { ClubAppearanceRegistry } from '../ClubRegistry';
import { KitResolver } from '../KitResolver';
import { MaterialLoader } from '../MaterialLoader';
import { ClubAppearanceProvider, useClubAppearance } from '../ClubAppearanceProvider';
import { KitDefinition } from '../types';

describe('GOAT Identity System Architecture', () => {
  beforeEach(() => {
    ClubAppearanceRegistry.clear();
  });

  describe('ClubAppearanceRegistry & KitResolver', () => {
    it('registers a club and resolves a kit correctly', () => {
      ClubAppearanceRegistry.register({
        clubId: 'flamengo',
        kits: [
          {
            type: 'home',
            season: '2024/25',
            textures: {},
            features: { hasPatches: true },
            baseColor: '#ff0000'
          }
        ]
      });

      const def = KitResolver.resolve('flamengo', 'home', '2024/25');
      expect(def).toBeDefined();
      expect(def?.baseColor).toBe('#ff0000');
    });

    it('falls back to the first available kit of the same type if season is not found', () => {
      ClubAppearanceRegistry.register({
        clubId: 'corinthians',
        kits: [
          {
            type: 'away',
            season: '2023/24',
            textures: {},
            features: {},
            baseColor: '#000000'
          }
        ]
      });

      const def = KitResolver.resolve('corinthians', 'away', '2024/25');
      expect(def).toBeDefined();
      expect(def?.season).toBe('2023/24'); // fell back to the only available 'away' kit
    });

    it('returns undefined if kit type does not exist', () => {
      ClubAppearanceRegistry.register({
        clubId: 'palmeiras',
        kits: [
          {
            type: 'home',
            season: '2024/25',
            textures: {},
            features: {}
          }
        ]
      });

      const def = KitResolver.resolve('palmeiras', 'away');
      expect(def).toBeUndefined();
    });
  });

  describe('MaterialLoader', () => {
    it('provides base material properties asynchronously', async () => {
      const def: KitDefinition = {
        type: 'third',
        season: '2024/25',
        textures: {},
        features: {},
        baseColor: '#123456'
      };
      
      const data = await MaterialLoader.loadKitMaterial(def);
      expect(data.color).toBe('#123456');
    });
  });

  describe('ClubAppearanceProvider', () => {
    it('loads data via hooks and updates context state', async () => {
      ClubAppearanceRegistry.register({
        clubId: 'santos',
        kits: [
          {
            type: 'home',
            season: '2024/25',
            textures: {},
            features: {},
            baseColor: '#ffffff'
          }
        ]
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ClubAppearanceProvider clubId="santos" kitType="home">
          {children}
        </ClubAppearanceProvider>
      );

      const { result } = renderHook(() => useClubAppearance(), { wrapper });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.kitDefinition).toBeDefined();
        expect(result.current.materialData?.color).toBe('#ffffff');
      });
    });

    it('handles undefined clubId gracefully', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ClubAppearanceProvider>
          {children}
        </ClubAppearanceProvider>
      );

      const { result } = renderHook(() => useClubAppearance(), { wrapper });
      
      expect(result.current.isLoading).toBe(false);
      expect(result.current.kitDefinition).toBeUndefined();
      expect(result.current.materialData).toBeUndefined();
    });
  });
});
