# Supabase Setup for Shop

## Create Buyers Table

Run this SQL in your Supabase dashboard to create the `buyers` table:

```sql
CREATE TABLE IF NOT EXISTS buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  stripe_customer_id VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_buyers_email ON buyers(email);
CREATE INDEX idx_buyers_stripe_customer_id ON buyers(stripe_customer_id);
```

## What Happens

1. **User completes purchase** → Stripe payment processed
2. **Webhook triggered** → `checkout.session.completed` event
3. **Buyer entry created** in Supabase with:
   - Email from Stripe session
   - Stripe customer ID
   - `first_purchase = true`
   - `profile_completed = false` (user hasn't finished setup yet)
4. **User gets email** with link to complete profile
5. **User visits profile page** and fills in:
   - First name, Last name
   - Phone, Address, City, State, Zip, Country
   - `profile_completed = true` once saved

## API Endpoints

- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe events (auto-creates buyer)
- `POST /api/buyers/profile` - Complete buyer profile (next)
- `GET /api/buyers/[email]` - Fetch buyer info (next)

## Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
