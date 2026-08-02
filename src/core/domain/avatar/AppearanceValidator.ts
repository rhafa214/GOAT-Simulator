import { PhysicalAppearance } from '../../../types';
import { AVATAR_CATALOG, DEFAULT_APPEARANCE, AvatarPartCategory } from './AvatarCatalog';

export class AppearanceValidator {
  static validate(appearance: Partial<PhysicalAppearance>): PhysicalAppearance {
    const validApp: Partial<PhysicalAppearance> = { ...DEFAULT_APPEARANCE };

    const hexColorRegex = /^[0-9A-Fa-f]{6}$/;

    if (appearance.skinColor && hexColorRegex.test(appearance.skinColor)) {
      validApp.skinColor = appearance.skinColor;
    }
    if (appearance.hairColor && hexColorRegex.test(appearance.hairColor)) {
      validApp.hairColor = appearance.hairColor;
    }
    if (appearance.facialHairColor && hexColorRegex.test(appearance.facialHairColor)) {
      validApp.facialHairColor = appearance.facialHairColor;
    }

    const validatePart = (key: AvatarPartCategory, value: string | undefined) => {
      if (value && AVATAR_CATALOG[key].some(part => part.id === value)) {
        return value;
      }
      return validApp[key];
    };

    validApp.hairStyle = validatePart('hairStyle', appearance.hairStyle);
    validApp.eyes = validatePart('eyes', appearance.eyes);
    validApp.mouth = validatePart('mouth', appearance.mouth);
    validApp.nose = validatePart('nose', appearance.nose);
    validApp.facialHair = validatePart('facialHair', appearance.facialHair);
    validApp.accessories = validatePart('accessories', appearance.accessories);
    validApp.tattoos = validatePart('tattoos', appearance.tattoos);
    validApp.boots = validatePart('boots', appearance.boots);

    if (typeof appearance.height === 'number' && appearance.height >= 150 && appearance.height <= 220) {
      validApp.height = appearance.height;
    }
    
    if (typeof appearance.weight === 'number' && appearance.weight >= 50 && appearance.weight <= 120) {
      validApp.weight = appearance.weight;
    }

    if (appearance.physique && ['Magra', 'Atlética', 'Musculosa', 'Pesada'].includes(appearance.physique)) {
      validApp.physique = appearance.physique;
    }
    
    if (appearance.sleeves && ['Curtas', 'Longas', 'Térmica'].includes(appearance.sleeves)) {
      validApp.sleeves = appearance.sleeves;
    }

    if (typeof appearance.gloves === 'boolean') {
      validApp.gloves = appearance.gloves;
    }

    if (typeof appearance.celebration === 'string' && appearance.celebration.length > 0) {
      validApp.celebration = appearance.celebration;
    }

    return validApp as PhysicalAppearance;
  }
}
