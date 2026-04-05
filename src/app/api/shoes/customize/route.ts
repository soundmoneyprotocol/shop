/**
 * POST /api/shoes/customize
 * Create a custom shoe design
 *
 * Body:
 * {
 *   "sole": "FFFFFF",
 *   "swoosh": "000000",
 *   "body": "FF0000",
 *   "top": "0000FF",
 *   "toe": "00FF00",
 *   "back": "FFFF00"
 * }
 *
 * Response: { success: true, data: { id, customization, imageUrl, metadata, ... } }
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import {
  composeShoeImage,
  generateMetadata,
  generateCustomizationHash,
  type ShoeCustomization,
} from '@/lib/shoeImageComposition';
import { validateCustomization, DEFAULT_CUSTOMIZATION } from '@/lib/shoeAttributes';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Merge with defaults
    const customization: ShoeCustomization = {
      sole: body.sole || DEFAULT_CUSTOMIZATION.sole,
      swoosh: body.swoosh || DEFAULT_CUSTOMIZATION.swoosh,
      body: body.body || DEFAULT_CUSTOMIZATION.body,
      top: body.top || DEFAULT_CUSTOMIZATION.top,
      toe: body.toe || DEFAULT_CUSTOMIZATION.toe,
      back: body.back || DEFAULT_CUSTOMIZATION.back,
    };

    // Validate hex colors
    if (!validateCustomization(customization)) {
      return Response.json(
        {
          success: false,
          error: 'Invalid hex color codes. Must be 6-character hex values.',
        },
        { status: 400 }
      );
    }

    // Get auth user
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      // In production, verify JWT token here
      // For now, we'll extract from Supabase auth context
      const token = authHeader.substring(7);

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data, error } = await supabase.auth.getUser(token);
          if (!error && data.user) {
            userId = data.user.id;
          }
        } catch (e) {
          console.log('Auth check failed, creating draft shoe');
        }
      }
    }

    // Generate shoe image
    let imageUrl = '';
    let imageBuffer: Buffer | null = null;

    try {
      const result = await composeShoeImage(customization);
      imageBuffer = result.buffer;

      // Save to Supabase Storage if configured
      if (isSupabaseConfigured() && supabase && userId) {
        const filename = `${userId}/${Date.now()}_custom_shoe.png`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('shoe-images')
          .upload(filename, imageBuffer, {
            contentType: 'image/png',
            upsert: false,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('shoe-images')
            .getPublicUrl(filename);

          imageUrl = urlData.publicUrl;
        }
      }
    } catch (imageError) {
      console.error('Error generating shoe image:', imageError);
      // Continue without image - user can generate later
    }

    // Generate metadata
    const metadata = generateMetadata(customization, Date.now(), imageUrl);
    const customizationHash = generateCustomizationHash(customization);

    // Save to database if configured
    let shoeData: any = {
      customization,
      imageUrl,
      metadata,
      customizationHash,
      status: 'draft',
    };

    if (isSupabaseConfigured() && supabase && userId) {
      try {
        const { data: insertedShoe, error: dbError } = await supabase
          .from('custom_shoes')
          .insert({
            user_id: userId,
            sole_hex: customization.sole,
            swoosh_hex: customization.swoosh,
            body_hex: customization.body,
            top_hex: customization.top,
            toe_hex: customization.toe,
            back_hex: customization.back,
            name: `Custom Shoe #${Date.now()}`,
            image_url: imageUrl,
            metadata_json: metadata,
            mint_status: 'draft',
          })
          .select()
          .single();

        if (!dbError && insertedShoe) {
          shoeData = {
            ...shoeData,
            id: insertedShoe.id,
            userId: insertedShoe.user_id,
            createdAt: insertedShoe.created_at,
          };
        }
      } catch (dbError) {
        console.error('Error saving shoe to database:', dbError);
      }
    }

    return Response.json({
      success: true,
      data: shoeData,
    });
  } catch (error) {
    console.error('Error in customize endpoint:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to create custom shoe',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shoes/customize
 * Get customization options (available colors for each part)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const part = searchParams.get('part');

    if (!part) {
      // Return all available colors
      const options = {
        sole: [
          'FFFFFF',
          '000000',
          'FFFDD0',
          'F5F5DC',
          '8B4513',
          'FF0000',
          '0000FF',
          '008000',
        ],
        swoosh: [
          'FFFFFF',
          '000000',
          'FF0000',
          '0000FF',
          '008000',
          'FFFF00',
          'FFA500',
          '800080',
        ],
        body: [
          'FFFFFF',
          '000000',
          'FF0000',
          '0000FF',
          '008000',
          '8B4513',
          'D2B48C',
          'FFFDD0',
        ],
        top: [
          'FFFFFF',
          '000000',
          'FF0000',
          '0000FF',
          '008000',
          'FFFF00',
          'FFA500',
          '800080',
        ],
        toe: [
          'FFFFFF',
          '000000',
          'FF0000',
          '0000FF',
          '008000',
          '8B4513',
          'D2B48C',
          'FFFF00',
        ],
        back: [
          'FFFFFF',
          '000000',
          'FF0000',
          '0000FF',
          '008000',
          'FFFF00',
          'FFA500',
          '800080',
        ],
      };

      return Response.json({
        success: true,
        data: options,
      });
    }

    // Return colors for specific part
    const partOptions: Record<string, string[]> = {
      sole: [
        'FFFFFF',
        '000000',
        'FFFDD0',
        'F5F5DC',
        '8B4513',
        'FF0000',
        '0000FF',
        '008000',
      ],
      swoosh: [
        'FFFFFF',
        '000000',
        'FF0000',
        '0000FF',
        '008000',
        'FFFF00',
        'FFA500',
        '800080',
      ],
      body: [
        'FFFFFF',
        '000000',
        'FF0000',
        '0000FF',
        '008000',
        '8B4513',
        'D2B48C',
        'FFFDD0',
      ],
      top: [
        'FFFFFF',
        '000000',
        'FF0000',
        '0000FF',
        '008000',
        'FFFF00',
        'FFA500',
        '800080',
      ],
      toe: [
        'FFFFFF',
        '000000',
        'FF0000',
        '0000FF',
        '008000',
        '8B4513',
        'D2B48C',
        'FFFF00',
      ],
      back: [
        'FFFFFF',
        '000000',
        'FF0000',
        '0000FF',
        '008000',
        'FFFF00',
        'FFA500',
        '800080',
      ],
    };

    const colors = partOptions[part] || [];

    return Response.json({
      success: true,
      data: {
        part,
        colors,
        count: colors.length,
      },
    });
  } catch (error) {
    console.error('Error in customize GET:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch customization options',
      },
      { status: 500 }
    );
  }
}
