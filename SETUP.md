# 🚀 Complete Setup Guide - SoundMoney Shopping Marketplace

**Time Required:** 2-3 hours for complete setup

---

## Phase 1: Project Initialization (15 minutes)

### Step 1: Clone and Install
```bash
cd /Users/casmirpatterson/sneakercredinc/shop

# Install dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env.local
```

Your `.env.local` should look like:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
# ... more keys
```

---

## Phase 2: Supabase Setup (30 minutes)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Enter project name: `shopping-marketplace`
4. Choose a region (us-east-1 recommended)
5. Create password (save it!)
6. Wait for project to initialize

### Step 2: Get API Keys
1. Go to Project Settings → API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role secret` → `SUPABASE_SERVICE_KEY`
5. Update `.env.local`

### Step 3: Create Database Schema
Go to SQL Editor and run:

```sql
-- Creators table
CREATE TABLE creators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  shop_url VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  total_earnings BIGINT DEFAULT 0,
  total_sales INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES creators(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(50),
  price_usd BIGINT NOT NULL,
  stock INT NOT NULL,
  sold INT DEFAULT 0,
  has_authenticity_nft BOOLEAN DEFAULT FALSE,
  nft_token_id BIGINT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  buyer_id uuid,
  creator_id uuid REFERENCES creators(id),
  quantity INT NOT NULL,
  total_usd BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_hash VARCHAR(255),
  stripe_payment_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  tracking_number VARCHAR(255)
);

-- Reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  buyer_id uuid,
  product_id uuid REFERENCES products(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Disputes table
CREATE TABLE disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  initiator uuid,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolver_id uuid
);

-- Create indexes for better query performance
CREATE INDEX idx_creators_wallet ON creators(wallet_address);
CREATE INDEX idx_products_creator ON products(creator_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_creator ON orders(creator_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
```

### Step 4: Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Creators can read all, write their own
CREATE POLICY "Creators read all" ON creators FOR SELECT USING (true);
CREATE POLICY "Creators write own" ON creators FOR INSERT, UPDATE USING (auth.uid()::text = id::text);

-- Products are publicly readable
CREATE POLICY "Products read all" ON products FOR SELECT USING (true);

-- Orders visible to buyer and creator
CREATE POLICY "Orders visibility" ON orders FOR SELECT USING (
  auth.uid()::text = buyer_id::text OR auth.uid()::text = creator_id::text
);
```

---

## Phase 3: Stripe Setup (20 minutes)

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up and verify email
3. Complete account setup

### Step 2: Get API Keys
1. Go to Developers → API Keys
2. Copy Publishable Key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy Secret Key → `STRIPE_SECRET_KEY`
4. Go to Webhooks
5. Create webhook for: `checkout.session.completed`, `payment_intent.succeeded`
6. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Step 3: Update .env.local
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Phase 4: Smart Contracts Setup (30 minutes)

### Step 1: Set Up Hardhat
```bash
cd hardhat
npm install
```

### Step 2: Configure Networks
Edit `hardhat/hardhat.config.js`:
```javascript
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
};
```

### Step 3: Get RPC URL and Private Key
1. Go to [Alchemy.com](https://alchemy.com)
2. Create an app (Sepolia network)
3. Copy RPC URL → `SEPOLIA_RPC_URL`
4. Get a test wallet private key → `PRIVATE_KEY`

Update `.env.local`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
PRIVATE_KEY=0x...
```

### Step 4: Compile Contracts
```bash
npm run hardhat:compile
```

Should output:
```
✓ Compiled successfully
artifacts/
└── contracts/
    ├── Shopping.sol
    ├── CreatorToken.sol
    └── PriceConverter.sol
```

### Step 5: Deploy to Sepolia
```bash
npm run hardhat:deploy:sepolia
```

After deployment, update `.env.local`:
```env
NEXT_PUBLIC_SHOPPING_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SHOPPING_DAO_ADDRESS=0x...
```

---

## Phase 5: Web3 Setup (15 minutes)

### Step 1: Configure Web3Modal
Update `.env.local`:
```env
# These are already in package.json dependencies
# web3modal and ethers.js are configured
NEXT_PUBLIC_APP_NAME=SoundMoney Shopping
```

### Step 2: Test MetaMask Connection
1. Install [MetaMask](https://metamask.io/) browser extension
2. Create a test wallet
3. Switch to Sepolia testnet
4. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

---

## Phase 6: Development Server (10 minutes)

### Step 1: Start Next.js Dev Server
```bash
npm run dev
```

Output should show:
```
> ready - started server on 0.0.0.0:3000
```

### Step 2: Test the App
1. Open [http://localhost:3000](http://localhost:3000)
2. Homepage should load with animations
3. Click "Explore" → should see marketplace with mock products
4. Try connecting wallet (top right)

### Step 3: Verify Features
- [ ] Homepage loads with Framer Motion animations (BestCity style)
- [ ] Marketplace page loads with product cards
- [ ] Filter by category works
- [ ] Price range filter works
- [ ] Sort options work
- [ ] Search bar works
- [ ] View toggle (grid/list) works

---

## Phase 7: Type Checking & Linting (5 minutes)

```bash
# Type check the project
npm run type-check

# Lint the code
npm run lint

# Both should pass without errors
```

---

## Phase 8: Production Build (5 minutes)

```bash
npm run build
```

Should complete with:
```
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Building application
✓ Creating optimized production build
```

---

## 📋 Verification Checklist

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env.local` configured with all keys
- [ ] Supabase project created and schema initialized
- [ ] Stripe keys added to `.env.local`
- [ ] Sepolia RPC URL configured
- [ ] Wallet with test ETH created
- [ ] Smart contracts compiled successfully
- [ ] Contracts deployed to Sepolia testnet
- [ ] Dev server starts without errors
- [ ] Homepage loads in browser
- [ ] Marketplace page displays products
- [ ] MetaMask connection works
- [ ] Type checking passes
- [ ] Production build succeeds

---

## 🔧 Troubleshooting

### Dev server won't start
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Try again
npm run dev
```

### Supabase connection error
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify project exists in Supabase dashboard
- Check API credentials in Supabase Settings

### Smart contract compilation fails
```bash
cd hardhat
npm install
npx hardhat compile --force
```

### MetaMask not connecting
- Ensure MetaMask is installed
- Switch to Sepolia testnet
- Check that `window.ethereum` is available

---

## 📚 Next Steps After Setup

1. **Create First Product**
   - Register as a seller
   - List a product
   - Verify on blockchain

2. **Test Purchase Flow**
   - Create order through UI
   - Process payment with Stripe
   - Verify order in Supabase

3. **Implement More Pages**
   - Product detail page
   - Seller dashboard
   - Admin dashboard
   - Order tracking

4. **Add Real-time Features**
   - Socket.io connection
   - Live inventory updates
   - Real-time order notifications

5. **Deploy to Production**
   - Push to GitHub
   - Deploy frontend to Vercel
   - Deploy contracts to mainnet
   - Set up production Stripe account

---

## 📊 Architecture Summary

```
User Browser (Next.js 14)
    ↓
Vercel (Frontend Hosting)
    ↓ (API calls)
    ├→ Supabase (Database + Auth)
    ├→ Stripe (Payments)
    ├→ Blockchain (Contracts)
    │  ├→ Sepolia (Testnet)
    │  └→ SKALE (Mainnet)
    └→ IPFS (Images, via Supabase Storage)
```

---

## 🎓 Architecture Pattern Used

This project follows **HouseDAO + BestCity patterns:**

- **HouseDAO:** Unified Next.js monorepo, Supabase backend, smart contracts
- **BestCity:** Modern UI with Tailwind + Framer Motion, advanced filtering, real-time updates

Result: **Production-ready creator marketplace** 🚀

---

Generated: April 3, 2026 | Ready to Build
