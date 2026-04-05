/**
 * Shoe Customization Attributes
 * Extracted from SneakrCred_Master/api/j1.py
 *
 * These define all available colors for each shoe part
 */

export const SHOE_MODEL = 'Jordan 1 Retro High OG';

export const SHOE_PARTS = [
  'sole',
  'swoosh',
  'body',
  'top',
  'toe',
  'back',
] as const;

export type ShoePart = (typeof SHOE_PARTS)[number];

/**
 * Available colors for shoe soles
 * Format: name -> hex code
 */
export const SOLES: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Cream': 'FFFDD0',
  'Beige': 'F5F5DC',
  'Brown': '8B4513',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Yellow': 'FFFF00',
  'Orange': 'FFA500',
  'Purple': '800080',
  'Pink': 'FFC0CB',
  'Gray': '808080',
  'Navy': '000080',
  'Olive': '808000',
};

/**
 * Available colors for swoosh
 */
export const SWOOSHES: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Yellow': 'FFFF00',
  'Orange': 'FFA500',
  'Purple': '800080',
  'Gold': 'FFD700',
  'Silver': 'C0C0C0',
  'Rose': 'FF007F',
  'Teal': '008080',
  'Lime': '00FF00',
  'Cyan': '00FFFF',
  'Magenta': 'FF00FF',
};

/**
 * Available colors for shoe body/panels
 */
export const BODIES: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Brown': '8B4513',
  'Tan': 'D2B48C',
  'Cream': 'FFFDD0',
  'Gray': '808080',
  'Navy': '000080',
  'Maroon': '800000',
  'Olive': '808000',
  'Teal': '008080',
  'Purple': '800080',
  'Khaki': 'F0E68C',
};

/**
 * Available colors for shoe top/collar
 */
export const TOPS: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Yellow': 'FFFF00',
  'Orange': 'FFA500',
  'Purple': '800080',
  'Pink': 'FFC0CB',
  'Gray': '808080',
  'Navy': '000080',
  'Gold': 'FFD700',
  'Silver': 'C0C0C0',
  'Beige': 'F5F5DC',
  'Cream': 'FFFDD0',
};

/**
 * Available colors for shoe toe box
 */
export const TOES: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Brown': '8B4513',
  'Tan': 'D2B48C',
  'Yellow': 'FFFF00',
  'Orange': 'FFA500',
  'Purple': '800080',
  'Gray': '808080',
  'Navy': '000080',
  'Olive': '808000',
  'Khaki': 'F0E68C',
  'Rose': 'FF007F',
};

/**
 * Available colors for shoe back/heel
 */
export const BACKS: Record<string, string> = {
  'White': 'FFFFFF',
  'Black': '000000',
  'Red': 'FF0000',
  'Blue': '0000FF',
  'Green': '008000',
  'Yellow': 'FFFF00',
  'Orange': 'FFA500',
  'Purple': '800080',
  'Gold': 'FFD700',
  'Gray': '808080',
  'Navy': '000080',
  'Brown': '8B4513',
  'Pink': 'FFC0CB',
  'Teal': '008080',
  'Lime': '00FF00',
};

/**
 * Boost levels (special attributes)
 * These add special properties to the shoe
 */
export const BOOSTS = [
  'None',
  'Speed Boost +1',
  'Speed Boost +2',
  'Comfort Boost +1',
  'Comfort Boost +2',
  'Style Boost +1',
  'Style Boost +2',
  'Legendary',
];

export const BOOST_ATTRIBUTES: Record<string, number> = {
  'None': 0,
  'Speed Boost +1': 1,
  'Speed Boost +2': 2,
  'Comfort Boost +1': 3,
  'Comfort Boost +2': 4,
  'Style Boost +1': 5,
  'Style Boost +2': 6,
  'Legendary': 10,
};

/**
 * Image layer paths in Supabase Storage
 * These correspond to the PNG files from SneakrCred_Master/images/factory/
 */
export const IMAGE_LAYERS = {
  top: 'shoe-layers/top/top_',
  sole: 'shoe-layers/sole_laces/sole_laces_',
  back: 'shoe-layers/back/back_',
  body: 'shoe-layers/panels/panels_',
  swoosh: 'shoe-layers/swoosh/swoosh_',
  toe: 'shoe-layers/toe/toe_',
} as const;

/**
 * Default customization (all white)
 */
export const DEFAULT_CUSTOMIZATION = {
  sole: 'FFFFFF',
  swoosh: 'FFFFFF',
  body: 'FFFFFF',
  top: 'FFFFFF',
  toe: 'FFFFFF',
  back: 'FFFFFF',
} as const;

/**
 * Helper to get hex code from color name
 */
export function getHexCode(part: ShoePart, colorName: string): string {
  const colorMap = {
    sole: SOLES,
    swoosh: SWOOSHES,
    body: BODIES,
    top: TOPS,
    toe: TOES,
    back: BACKS,
  } as const;

  return colorMap[part][colorName as keyof typeof colorMap[typeof part]] || 'FFFFFF';
}

/**
 * Helper to get all available colors for a shoe part
 */
export function getColorsForPart(part: ShoePart): Record<string, string> {
  const colorMap = {
    sole: SOLES,
    swoosh: SWOOSHES,
    body: BODIES,
    top: TOPS,
    toe: TOES,
    back: BACKS,
  } as const;

  return colorMap[part];
}

/**
 * Validate customization object
 */
export function validateCustomization(customization: Record<string, any>): boolean {
  const hexRegex = /^[0-9A-Fa-f]{6}$/;

  for (const part of SHOE_PARTS) {
    const hex = customization[part];
    if (hex && !hexRegex.test(hex)) {
      return false;
    }
  }

  return true;
}
