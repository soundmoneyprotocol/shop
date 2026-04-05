# Shoe Layer Upload Guide

This document explains how to upload shoe layer PNG files to Supabase Storage.

## Overview

The shoe customizer uses layer-based image composition. Each shoe part (sole, swoosh, body, top, toe, back) has multiple color variations stored as PNG files.

These files are sourced from `SneakrCred_Master/images/images/factory/` and need to be uploaded to Supabase Storage at `shoe-images/shoe-layers/`.

## Layer Structure

```
factory/
├── back/           → shoe-layers/back/
├── panels/         → shoe-layers/body/
├── sole_laces/     → shoe-layers/sole/
├── swoosh/         → shoe-layers/swoosh/
├── toe/            → shoe-layers/toe/
└── top/            → shoe-layers/top/
```

**Total files:** 210 PNG files (30-39 per layer)

## Upload Instructions

### Prerequisites

1. **Environment Variables**
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="https://sbylptcrxtowismxrkyj.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

2. **Source Directory**
   - Must have access to `/Users/casmirpatterson/sneakercredinc/SneakrCred_Master/images/`
   - OR download/copy the images directory from the repo

### Method 1: Node.js Script (Recommended)

```bash
# Run the upload script
npm run upload-shoe-layers

# Expected output:
# 🎨 Shoe Layer Upload to Supabase Storage
# ============================================================
# Supabase URL: https://sbylptcrxtowismxrkyj.supabase.co
# Bucket: shoe-images
# Source: /Users/casmirpatterson/sneakercredinc/SneakrCred_Master/images/images/factory
# ============================================================
#
# 📁 back (back/)
#    Found 35 files
#    ✅ back_000000.png
#    ✅ back_0000ff.png
#    ...
#
# 📊 Upload Summary
# ============================================================
# Total files:    210
# Uploaded:       210 ✅
# Skipped:        0 ⏭️ 
# Failed:         0 ❌
```

### Method 2: TypeScript Version (If using ts-node)

```bash
npm install -D ts-node
npx ts-node scripts/upload-shoe-layers.ts
```

### Method 3: Manual Supabase CLI Upload

```bash
# Using Supabase CLI
supabase storage copy \
  /Users/casmirpatterson/sneakercredinc/SneakrCred_Master/images/images/factory \
  shoe-images/shoe-layers/ \
  --recursive
```

## Verification

After upload, verify the files are in Supabase:

```bash
# List uploaded files
supabase storage list shoe-images/shoe-layers/back

# Expected output:
# back_000000.png
# back_0000ff.png
# ...
```

Or check via Supabase dashboard:
1. Go to https://app.supabase.com
2. Project: `sbylptcrxtowismxrkyj`
3. Storage → `shoe-images` → `shoe-layers/`

## File Naming Convention

Files are named with hex color codes (lowercase):

```
{part}_{hexcolor}.png

Examples:
- top_ffffff.png      (white)
- top_000000.png      (black)
- sole_ff0000.png     (red)
- swoosh_0000ff.png   (blue)
```

## Using Uploaded Layers in Image Composition

Once uploaded, the image composition API will automatically reference these files:

```typescript
// In src/lib/shoeImageComposition.ts
const layerUrl = `${SUPABASE_URL}/storage/v1/object/public/shoe-images/shoe-layers/{part}/{part}_{hexcolor}.png`;

// Example:
// https://sbylptcrxtowismxrkyj.supabase.co/storage/v1/object/public/shoe-images/shoe-layers/top/top_ffffff.png
```

## Troubleshooting

### Script Errors

**Error: `Missing environment variables`**
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check: `echo $NEXT_PUBLIC_SUPABASE_URL`

**Error: `Source directory not found`**
- Ensure the SneakrCred_Master repo is at the expected path
- Or manually copy `images/factory/` to the script location

**Error: `HTTP 401: Unauthorized`**
- Service role key is invalid or expired
- Get a new one from Supabase dashboard

### Upload Issues

**Files Already Exist**
- Script will skip files that already exist in storage
- To re-upload, delete from Supabase first or use `upsert: true` in code

**Partial Upload**
- If some files fail, run the script again
- It will skip already-uploaded files and retry failures

## Next Steps

1. ✅ Upload shoe layers to Supabase Storage
2. 🎨 Test the shoe customizer at `/customize-shoe`
3. 🖼️ Verify generated shoe images use the uploaded layers
4. 🚀 Deploy to production

## Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Shoe Customization API](../src/app/api/shoes/customize/route.ts)
- [Image Composition Logic](../src/lib/shoeImageComposition.ts)
- [Shoe Customizer Component](../src/components/ShoeCustomizer.tsx)

## Support

If upload fails:
1. Check environment variables
2. Verify source directory exists
3. Run with verbose output: `DEBUG=* npm run upload-shoe-layers`
4. Check Supabase dashboard for bucket/permission issues
