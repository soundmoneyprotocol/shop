/**
 * Upload Shoe Layer PNGs to Supabase Storage
 *
 * This script uploads all PNG layer files from SneakrCred_Master/images/factory/
 * to the Supabase 'shoe-images' storage bucket.
 *
 * Usage: npx ts-node scripts/upload-shoe-layers.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SOURCE_DIR = join(__dirname, '../../sneakercredinc/SneakrCred_Master/images/images/factory');
const BUCKET_NAME = 'shoe-images';

// Layer subdirectories and their mapping to shoe parts
const LAYERS = {
  back: 'back',
  panels: 'body',
  sole_laces: 'sole',
  swoosh: 'swoosh',
  toe: 'toe',
  top: 'top',
} as const;

async function uploadShoeLayersToBucket() {
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('🎨 Uploading shoe layer PNGs to Supabase Storage...\n');
    console.log(`Bucket: ${BUCKET_NAME}`);
    console.log(`Source: ${SOURCE_DIR}\n`);

    let totalFiles = 0;
    let uploadedFiles = 0;
    let skippedFiles = 0;
    let errors: { file: string; error: string }[] = [];

    // Process each layer directory
    for (const [sourceDir, partName] of Object.entries(LAYERS)) {
      const layerPath = join(SOURCE_DIR, sourceDir);
      console.log(`\n📁 Processing ${partName} (${sourceDir}/)`);

      try {
        // Get all PNG files in this directory
        const files = readdirSync(layerPath)
          .filter((f) => f.endsWith('.png'))
          .sort();

        console.log(`   Found ${files.length} files`);

        // Upload each file
        for (const filename of files) {
          totalFiles++;

          const filePath = join(layerPath, filename);
          const storagePath = `shoe-layers/${partName}/${filename}`;

          try {
            // Read file
            const fileBuffer = readFileSync(filePath);

            // Check if file already exists
            const { data: existingFile } = await supabase.storage
              .from(BUCKET_NAME)
              .list(`shoe-layers/${partName}`, {
                limit: 1000,
              });

            const fileExists = existingFile?.some((f) => f.name === filename);

            if (fileExists) {
              console.log(`   ⏭️  ${filename} (already exists)`);
              skippedFiles++;
              continue;
            }

            // Upload file
            const { error: uploadError } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(storagePath, fileBuffer, {
                contentType: 'image/png',
                upsert: false,
              });

            if (uploadError) {
              console.log(`   ❌ ${filename} - Error: ${uploadError.message}`);
              errors.push({ file: storagePath, error: uploadError.message });
            } else {
              console.log(`   ✅ ${filename}`);
              uploadedFiles++;
            }
          } catch (error: any) {
            console.log(`   ❌ ${filename} - Error: ${error.message}`);
            errors.push({ file: filename, error: error.message });
          }
        }
      } catch (error: any) {
        console.error(`\n   Error reading directory ${sourceDir}: ${error.message}`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Upload Summary');
    console.log('='.repeat(60));
    console.log(`Total files:    ${totalFiles}`);
    console.log(`Uploaded:       ${uploadedFiles} ✅`);
    console.log(`Skipped:        ${skippedFiles} ⏭️ `);
    console.log(`Failed:         ${errors.length} ❌`);
    console.log('='.repeat(60));

    if (errors.length > 0) {
      console.log('\n❌ Failed uploads:');
      errors.forEach(({ file, error }) => {
        console.log(`   - ${file}: ${error}`);
      });
    }

    if (uploadedFiles > 0 || skippedFiles > 0) {
      console.log('\n✨ Shoe layer upload complete!');
      console.log(`\nShoe layers are now available at:`);
      console.log(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/shoe-layers/\n`);
    }
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the upload
uploadShoeLayersToBucket();
