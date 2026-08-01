import { describe, it, expect } from 'vitest';
import { AppearanceValidator } from '../../core/domain/avatar/AppearanceValidator';
import { DEFAULT_APPEARANCE } from '../../core/domain/avatar/AvatarCatalog';

describe('AppearanceValidator', () => {
  it('should return default appearance when given empty object', () => {
    const result = AppearanceValidator.validate({});
    expect(result).toEqual(DEFAULT_APPEARANCE);
  });

  it('should keep valid appearance properties', () => {
    const validApp = {
      skinColor: 'ff0000',
      hairStyle: 'hair_long',
      height: 190,
      weight: 80,
    };
    const result = AppearanceValidator.validate(validApp);
    expect(result.skinColor).toBe('ff0000');
    expect(result.hairStyle).toBe('hair_long');
    expect(result.height).toBe(190);
    expect(result.weight).toBe(80);
    expect(result.physique).toBe(DEFAULT_APPEARANCE.physique);
  });

  it('should fallback to defaults for invalid properties', () => {
    const invalidApp = {
      skinColor: 'invalid', // Not a hex
      hairStyle: 'non_existent_hair', // Not in catalog
      height: 300, // Out of range
      weight: 10, // Out of range
    };
    const result = AppearanceValidator.validate(invalidApp);
    expect(result.skinColor).toBe(DEFAULT_APPEARANCE.skinColor);
    expect(result.hairStyle).toBe(DEFAULT_APPEARANCE.hairStyle);
    expect(result.height).toBe(DEFAULT_APPEARANCE.height);
    expect(result.weight).toBe(DEFAULT_APPEARANCE.weight);
  });
});
