/**
 * Shoe Image Composition
 * Generates shoe images by compositing PNG layers with selected colors
 *
 * Adapted from SneakrCred_Master/api/routes.py - image composition logic
 */

import sharp from 'sharp';
import { createReadStream, existsSync } from 'fs';
import path from 'path';

export interface ShoeCustomization {
  sole: string;     // hex color
  swoosh: string;
  body: string;
  top: string;
  toe: string;
  back: string;
}

export interface CompositionResult {
  buffer: Buffer;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

/**
 * Get the SVG overlay for a color layer
 * Creates a colored rectangle that will be composited on top of the base layer
 */
function createColorOverlay(width: number, height: number, hexColor: string): Buffer {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${hexColor}"/>
    </svg>
  `;
  return Buffer.from(svg);
}

/**
 * Get image path for a shoe part and hex color
 * Path format: shoe-layers/{part}/{part}_{hexcolor}.png
 */
function getLayerPath(part: string, hexColor: string): string {
  // Remove # if present
  const cleanHex = hexColor.replace('#', '').toUpperCase();
  return `${part.toLowerCase()}/${part.toLowerCase()}_${cleanHex}.png`;
}

/**
 * Main function: Compose shoe image from layers
 *
 * Process:
 * 1. Start with base layer (usually black or white shoe silhouette)
 * 2. For each part (sole, body, swoosh, etc.), apply color
 * 3. Stack layers in correct order (bottom to top)
 * 4. Return final composite image
 */
export async function composeShoeImage(
  customization: ShoeCustomization,
  baseLayerPath?: string
): Promise<CompositionResult> {
  try {
    // Layer order (bottom to top for proper rendering)
    const layerOrder = ['sole', 'back', 'body', 'top', 'toe', 'swoosh'] as const;

    // Start with base image (1200x1200 canvas, white background)
    let image = sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // transparent
      },
    });

    // Build composite inputs array
    const compositeInputs: Array<{
      input: Buffer | string;
      blend?: string;
    }> = [];

    // For each shoe part, add the colored layer
    for (const part of layerOrder) {
      const hexColor = customization[part as keyof ShoeCustomization];

      if (!hexColor) continue;

      try {
        // In a real implementation, you would:
        // 1. Load the layer image from Supabase Storage
        // 2. Apply color overlay (using SVG + multiply blend or similar)
        // 3. Add to composite

        // For now, we'll create SVG overlays that simulate colored layers
        const overlay = createColorOverlay(1200, 1200, hexColor);

        compositeInputs.push({
          input: overlay,
          blend: 'multiply', // Color blend mode
        });
      } catch (error) {
        console.error(`Error processing layer for ${part}:`, error);
        // Continue with next layer on error
      }
    }

    // Apply all composites
    if (compositeInputs.length > 0) {
      image = image.composite(compositeInputs as any);
    }

    // Convert to PNG
    const buffer = await image.png().toBuffer();

    const metadata = await image.metadata();

    return {
      buffer,
      metadata: {
        width: metadata.width || 1200,
        height: metadata.height || 1200,
        format: 'png',
      },
    };
  } catch (error) {
    console.error('Error composing shoe image:', error);
    throw new Error(`Failed to compose shoe image: ${error}`);
  }
}

/**
 * Alternative: Use pre-rendered images from Supabase Storage
 * This is more efficient than real-time composition
 *
 * Assumes images are pre-generated for each color combination:
 * shoe-images/prerendered/{sole}_{swoosh}_{body}_{top}_{toe}_{back}.png
 */
export async function getPrerenderedShoeImage(
  customization: ShoeCustomization,
  supabaseUrl: string,
  supabaseBucket: string
): Promise<string> {
  const filename = [
    customization.sole,
    customization.swoosh,
    customization.body,
    customization.top,
    customization.toe,
    customization.back,
  ]
    .join('_')
    .toLowerCase();

  return `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/prerendered/${filename}.png`;
}

/**
 * Generate NFT metadata for a customized shoe
 */
export function generateMetadata(
  customization: ShoeCustomization,
  tokenId: number,
  imageUrl: string
): Record<string, any> {
  return {
    name: `Jordan 1 Custom #${tokenId}`,
    description: 'Customized Jordan 1 Retro High OG - Create your own colorway',
    image: imageUrl,
    external_url: `https://shop.soundmoneyprotocol.xyz/shoes/${tokenId}`,
    attributes: [
      {
        trait_type: 'Sole',
        value: customization.sole,
      },
      {
        trait_type: 'Swoosh',
        value: customization.swoosh,
      },
      {
        trait_type: 'Body',
        value: customization.body,
      },
      {
        trait_type: 'Top',
        value: customization.top,
      },
      {
        trait_type: 'Toe',
        value: customization.toe,
      },
      {
        trait_type: 'Back',
        value: customization.back,
      },
    ],
    properties: {
      customizable: true,
      rarity: 'unique',
      collection: 'Jordan 1 Custom Collection',
    },
  };
}

/**
 * Validate if a customization is unique
 * Prevents duplicates from being minted
 */
export function generateCustomizationHash(customization: ShoeCustomization): string {
  const parts = [
    customization.sole,
    customization.swoosh,
    customization.body,
    customization.top,
    customization.toe,
    customization.back,
  ];

  // Simple hash: concatenate and create a deterministic ID
  return Buffer.from(parts.join('|')).toString('hex');
}
