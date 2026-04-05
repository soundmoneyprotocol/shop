#!/usr/bin/env node

/**
 * Upload Shoe Layer PNGs to Supabase Storage
 *
 * Usage: node scripts/upload-shoe-layers.js
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'shoe-images';
const SOURCE_DIR = path.join(
  __dirname,
  '../../sneakercredinc/SneakrCred_Master/images/images/factory'
);

// Layer mappings
const LAYERS = {
  back: 'back',
  panels: 'body',
  sole_laces: 'sole',
  swoosh: 'swoosh',
  toe: 'toe',
  top: 'top',
};

// Validate environment
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

console.log('🎨 Shoe Layer Upload to Supabase Storage');
console.log('='.repeat(60));
console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Bucket: ${BUCKET_NAME}`);
console.log(`Source: ${SOURCE_DIR}`);
console.log('='.repeat(60) + '\n');

/**
 * Upload a single file to Supabase Storage
 */
async function uploadFile(filePath, storagePath) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // Construct upload URL
    const uploadUrl = new URL(
      `/storage/v1/object/${BUCKET_NAME}/${storagePath}`,
      SUPABASE_URL
    );

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': fileBuffer.length,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    };

    const req = https.request(uploadUrl, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, fileName });
        } else if (res.statusCode === 409) {
          // File already exists
          resolve({ success: true, fileName, skipped: true });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

/**
 * Main upload function
 */
async function uploadShoeLayersToBucket() {
  let totalFiles = 0;
  let uploadedFiles = 0;
  let skippedFiles = 0;
  let errorCount = 0;
  const errors = [];

  // Process each layer directory
  for (const [sourceDir, partName] of Object.entries(LAYERS)) {
    const layerPath = path.join(SOURCE_DIR, sourceDir);

    console.log(`\n📁 ${partName} (${sourceDir}/)`);

    if (!fs.existsSync(layerPath)) {
      console.log(`   ⚠️  Directory not found, skipping`);
      continue;
    }

    // Get all PNG files
    const files = fs
      .readdirSync(layerPath)
      .filter((f) => f.endsWith('.png'))
      .sort();

    console.log(`   Found ${files.length} files\n`);

    // Upload each file
    for (const filename of files) {
      totalFiles++;
      const filePath = path.join(layerPath, filename);
      const storagePath = `shoe-layers/${partName}/${filename}`;

      try {
        const result = await uploadFile(filePath, storagePath);

        if (result.skipped) {
          process.stdout.write(`   ⏭️  ${filename}\n`);
          skippedFiles++;
        } else {
          process.stdout.write(`   ✅ ${filename}\n`);
          uploadedFiles++;
        }
      } catch (error) {
        process.stdout.write(`   ❌ ${filename} - ${error.message}\n`);
        errors.push({ file: storagePath, error: error.message });
        errorCount++;
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Upload Summary');
  console.log('='.repeat(60));
  console.log(`Total files:    ${totalFiles}`);
  console.log(`Uploaded:       ${uploadedFiles} ✅`);
  console.log(`Skipped:        ${skippedFiles} ⏭️ `);
  console.log(`Failed:         ${errorCount} ❌`);
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
    console.log(
      `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/shoe-layers/\n`
    );
    process.exit(0);
  } else if (errorCount > 0) {
    console.log('\n❌ Upload failed with errors.\n');
    process.exit(1);
  } else {
    console.log('\n⏭️  All files already exist.\n');
    process.exit(0);
  }
}

// Run the upload
uploadShoeLayersToBucket().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
