# 🚀 Quick Start: Upload Shoe Layers to Supabase

## What This Does

Uploads 210 PNG files from `SneakrCred_Master/images/factory/` to Supabase Storage at `shoe-images/shoe-layers/`.

These files are needed for the shoe customizer to generate unique shoe images.

## 3-Step Upload

### Step 1: Set Environment Variables

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://sbylptcrxtowismxrkyj.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNieWxwdGNyeHRvd2lzbXhya3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA0Nzk4NywiZXhwIjoyMDgwNjIzOTg3fQ.7NlEAUQn3GDzvMsGQ6W5mSJz6W5mSJz6W5mSJz6W5mSJz6W5mSJz6W5mSJz6W5mSJz6W5mSJz"
```

### Step 2: Run Upload Script

From the shop directory:

```bash
npm run upload-shoe-layers
```

### Step 3: Wait for Completion

The script will:
- ✅ Upload 210 PNG files
- ⏭️  Skip files that already exist
- ❌ Report any failures
- 📊 Print a summary

## Expected Output

```
🎨 Shoe Layer Upload to Supabase Storage
============================================================
Supabase URL: https://sbylptcrxtowismxrkyj.supabase.co
Bucket: shoe-images
Source: /Users/casmirpatterson/sneakercredinc/SneakrCred_Master/images/images/factory
============================================================

📁 back (back/)
   Found 35 files
   ✅ back_000000.png
   ✅ back_0000ff.png
   ...

📁 panels (panels/)
   Found 37 files
   ✅ panels_000000.png
   ...

📊 Upload Summary
============================================================
Total files:    210
Uploaded:       210 ✅
Skipped:        0 ⏭️
Failed:         0 ❌
============================================================

✨ Shoe layer upload complete!

Shoe layers are now available at:
https://sbylptcrxtowismxrkyj.supabase.co/storage/v1/object/public/shoe-images/shoe-layers/
```

## What Gets Uploaded

| Layer | Files | Destination |
|-------|-------|-------------|
| Back | 35 | `shoe-layers/back/` |
| Body (panels) | 37 | `shoe-layers/body/` |
| Sole (sole_laces) | 32 | `shoe-layers/sole/` |
| Swoosh | 37 | `shoe-layers/swoosh/` |
| Toe | 35 | `shoe-layers/toe/` |
| Top | 34 | `shoe-layers/top/` |
| **TOTAL** | **210** | |

## File Format

Each file is named: `{part}_{hexcolor}.png`

Examples:
- `top_ffffff.png` (white top)
- `sole_000000.png` (black sole)
- `swoosh_ff0000.png` (red swoosh)

## After Upload

1. Test the customizer: `https://shop.soundmoneyprotocol.xyz/customize-shoe`
2. Select different colors and generate a preview
3. The layers should composite together automatically

## Troubleshooting

**Script not found?**
```bash
ls scripts/upload-shoe-layers.js
```

**Environment variables not set?**
```bash
echo $SUPABASE_SERVICE_ROLE_KEY  # Should show the key
```

**Source images not found?**
```bash
ls /Users/casmirpatterson/sneakercredinc/SneakrCred_Master/images/images/factory/
```

**Need more help?**
See `SHOE_LAYER_UPLOAD.md` for detailed troubleshooting.

---

## TL;DR

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://sbylptcrxtowismxrkyj.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
npm run upload-shoe-layers
```

Done! ✨
