# Shopify OAuth Setup Guide

Complete setup instructions for enabling Shopify merchant imports on SoundMoney.

## Current Status

✅ **Frontend Implementation Complete**
- OAuth flow pages built
- API callback handler ready
- Merchant connection UI polished

✅ **Backend Implementation Complete**
- OAuth callback endpoint ready
- Product sync endpoints built
- Database schema created

⏳ **Next: Get Shopify API Secret**

## Quick Setup (5 minutes)

### 1. Get Shopify API Secret

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Click on "soundmoneyshop" app (already exists)
3. Go to **Settings** → **API credentials**
4. Copy the **API secret key**
5. Add to backend `.env`:

```env
SHOPIFY_API_SECRET=shppa_xxxxxxxxxxxxxxxxx
```

### 2. Update Backend Environment

```bash
cd /sneakercredinc/backend
```

Create/update `.env`:

```env
# From shopify.app.toml
SHOPIFY_API_KEY=b0cdef30a61d2693817f1568cd6cd98b
SHOPIFY_API_SECRET=shppa_xxxxxxxxxxxxxxxxx  # From step 1
SHOPIFY_DEV_STORE=soundmoneyshop.myshopify.com
SHOPIFY_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost/soundmoney
```

### 3. Run Database Migration

```bash
psql $DATABASE_URL < migrations/001_add_shopify_stores.sql
```

### 4. Start Backend

```bash
npm install  # If not done already
npm run dev
```

### 5. Test OAuth Flow

**Local Testing:**
```
1. Open http://localhost:3002/seller/connect-shopify
2. Enter: soundmoneyshop.myshopify.com
3. Click "Connect to Shopify"
4. You'll be redirected to Shopify OAuth
5. Click "Install app"
6. Redirected back to /seller/connect-shopify?authorized=true
7. Should see "Successfully authorized" message
8. Click "Sync Products"
```

**Production Testing:**
- Update URLs from localhost to https://shop.soundmoneyprotocol.xyz
- Shopify will only call HTTPS URLs in production

## Architecture

### Frontend → Shopify → Backend Flow

```
User on /seller/connect-shopify
    ↓
Click "Connect to Shopify"
    ↓
Frontend builds OAuth URL:
  https://mystore.myshopify.com/admin/oauth/authorize
    ?client_id=b0cdef30a61d2693817f1568cd6cd98b
    &scope=read_products,read_inventory,read_orders
    &redirect_uri=http://localhost:3000/api/shopify/callback
    &state={random_state}
    ↓
User redirected to Shopify OAuth screen
    ↓
User approves permissions
    ↓
Shopify redirects to backend:
  http://localhost:3000/api/shopify/callback
    ?code=abc123xyz789
    &hmac=xxxxx
    &shop=mystore.myshopify.com
    &state={random_state}
    ↓
Backend POST /api/shopify/callback:
  1. Verify state matches (CSRF check)
  2. Exchange code for access_token
     POST https://mystore.myshopify.com/admin/oauth/access_token
       client_id=b0cdef30a61d2693817f1568cd6cd98b
       client_secret=shppa_xxx
       code=abc123xyz789
  3. Return access_token
    ↓
Backend redirects to frontend:
  /seller/connect-shopify?authorized=true&shop=mystore
    ↓
Frontend shows success message
    ↓
User can now sync products
```

## API Credentials Reference

### From `shopify.app.toml`:
```toml
client_id = "b0cdef30a61d2693817f1568cd6cd98b"
name = "soundmoneyshop"
```

### Get from Shopify Dashboard:
- `SHOPIFY_API_SECRET` - Settings → API credentials

### Scopes (Already Configured):
```
read_products       - Import product catalog
read_inventory      - Check stock levels
read_orders         - View order history
write_products      - Future: push updates
```

### Redirect URLs (Already Added):
```
http://localhost:3000/api/shopify/callback (dev)
https://api.soundmoneyprotocol.xyz/api/shopify/callback (prod)
https://personally-aids-framework-mentor.trycloudflare.com/api/shopify/callback (tunnel)
```

## File Structure

### Frontend
```
/shop/
├── shopify.app.toml                    (App config)
├── src/app/
│   ├── api/shopify/
│   │   └── callback/route.ts          (OAuth callback handler)
│   └── seller/
│       └── connect-shopify/
│           └── page.tsx               (Connection UI)
└── SHOPIFY_OAUTH_SETUP.md             (This file)
```

### Backend
```
/backend/
├── .env.example                       (Env vars)
├── src/
│   ├── routes/
│   │   └── shopify.ts                 (6 endpoints + callback)
│   └── utils/
│       └── shopify.ts                 (OAuth + transform)
├── migrations/
│   └── 001_add_shopify_stores.sql    (DB schema)
├── SHOPIFY_MERCHANT_IMPORT.md        (Complete guide)
└── SHOPIFY_INTEGRATION.md            (Technical docs)
```

## Endpoints

### OAuth Flow (Automatic)
- `GET https://{shop}/admin/oauth/authorize` - Shopify (user approves)
- `POST /api/shopify/callback` - Backend (exchange code)

### Manual Store Connection
- `POST /api/shopify/connect` - Connect store via access token
- `POST /api/shopify/sync-products` - Sync products
- `GET /api/shopify/stores` - List stores
- `DELETE /api/shopify/disconnect` - Remove connection

## Testing Checklist

- [ ] Backend `.env` has `SHOPIFY_API_SECRET`
- [ ] Database migration run: `migrations/001_add_shopify_stores.sql`
- [ ] Backend running: `npm run dev`
- [ ] Frontend running on `localhost:3002`
- [ ] Try OAuth flow on `/seller/connect-shopify`
- [ ] Authorize with dev store: `soundmoneyshop.myshopify.com`
- [ ] See "Successfully authorized" message
- [ ] Click "Sync Products"
- [ ] Products appear in marketplace
- [ ] Test "Disconnect Store"

## Troubleshooting

### "Invalid client_id"
- Check `shopify.app.toml` has correct client_id
- Verify scopes are set correctly

### "Invalid redirect_uri"
- Ensure callback URL is in `shopify.app.toml` redirect_urls
- Check redirect URI matches exactly in frontend OAuth flow

### "Access token exchange failed"
- Verify `SHOPIFY_API_SECRET` is set in `.env`
- Check the code wasn't used already (one-time use)
- Ensure shop URL is correct: `xxx.myshopify.com`

### "State mismatch" (CSRF)
- Clear browser cookies and sessionStorage
- Try again from fresh browser session
- Check backend is validating state correctly

### "No products sync"
- Check shop has products in Shopify admin
- Verify scopes include `read_products`
- Check database connection working

### Shopify redirects to wrong URL
- Update `redirect_urls` in `shopify.app.toml`
- Update frontend OAuth URL in `connect-shopify/page.tsx`
- Run `shopify app config link` to update config

## Security Notes

⚠️ **API Secret**
- Never commit `.env` to git
- Rotate secret regularly in Shopify dashboard
- Use environment-specific secrets (dev/prod)

⚠️ **State Parameter**
- Already generating random state in frontend
- Backend validates state (TODO: implement)
- Prevents CSRF attacks

⚠️ **HMAC Signature**
- Shopify sends HMAC for verification
- TODO: Implement HMAC validation in `/api/shopify/callback`
- Prevents replay attacks

⚠️ **Access Tokens**
- Encrypted in `shopify_stores.access_token`
- Only used server-side (never in frontend)
- Has Shopify API permissions attached

## Production Deployment

### Before Going Live:

1. **Get Production Shopify Secret**
   - Go to Shopify dashboard
   - Copy production API secret
   - Add to production `.env`

2. **Update Redirect URLs**
   - Change from localhost to production domain
   - Update `shopify.app.toml`
   - Update frontend OAuth URL
   - Run `shopify app deploy`

3. **Enable HTTPS**
   - Shopify only accepts HTTPS in production
   - Use https://api.soundmoneyprotocol.xyz/api/shopify/callback
   - Update `SHOPIFY_APP_URL`

4. **Test with Real Store**
   - Connect a real Shopify store (not dev)
   - Sync products
   - Verify inventory tracking
   - Test secondary market listing

5. **Monitor**
   - Check error logs for sync failures
   - Monitor API rate limits
   - Track successful connections

## Next Phases

### Phase 1: Core OAuth (CURRENT)
- [x] OAuth flow implementation
- [x] Product sync endpoints
- [x] Database schema
- [ ] Get API secret and test

### Phase 2: Real-time Sync (NEXT)
- [ ] Webhook signature validation
- [ ] Product update webhooks
- [ ] Inventory change webhooks
- [ ] Automatic sync on updates

### Phase 3: Advanced (LATER)
- [ ] Order sync to dashboard
- [ ] Pricing rules
- [ ] Bulk import
- [ ] Inventory analytics

## Support

For issues or questions:

1. Check `SHOPIFY_MERCHANT_IMPORT.md` for detailed flow
2. Review `SHOPIFY_INTEGRATION.md` for technical details
3. Check troubleshooting section above
4. Contact: [Your contact info]

---

**Status:** Ready for API secret setup and testing
**Last Updated:** 2026-04-05
