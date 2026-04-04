# 🏗️ Shopping Marketplace - Monorepo Initialization

Complete step-by-step guide to initialize the pnpm monorepo with all packages.

---

## STEP 1: Create GitHub Repository

```bash
# On GitHub.com
1. Go to https://github.com/new
2. Repository name: shopping
3. Owner: soundmoneyprotocol
4. Description: Creator marketplace for sneakers, clothing, and more
5. Visibility: Public
6. MIT License
7. Create repository
```

Copy HTTPS URL: `https://github.com/soundmoneyprotocol/shopping.git`

---

## STEP 2: Initialize Locally

```bash
# Create directory
mkdir shop
cd shop

# Initialize README and git
echo "# shopping" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/soundmoneyprotocol/shopping.git
git push -u origin main
```

✅ Repo is live and has first commit!

---

## STEP 3: Create Monorepo Structure

```bash
# Create folder structure
mkdir -p apps/{web,backend,mobile,admin}
mkdir -p packages/{types,ui,utils}
mkdir -p docs
mkdir -p .github/workflows

# Root config files
touch pnpm-workspace.yaml
touch tsconfig.base.json
touch .env.example
touch docker-compose.yml
touch .gitignore
```

---

## STEP 4: Root Configuration Files

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "noEmit": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@types/*": ["packages/types/src/*"],
      "@ui/*": ["packages/ui/src/*"],
      "@utils/*": ["packages/utils/src/*"]
    }
  }
}
```

### `pnpm-lock.yaml`
(Auto-generated when you run pnpm install)

### `.gitignore`
```
node_modules/
pnpm-lock.yaml
.turbo/
.next/
dist/
build/
*.log
.DS_Store
.env
.env.local
.env*.local
```

### `.env.example`
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shopping

# Redis
REDIS_URL=redis://localhost:6379

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-key-min-32-characters

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=us-east-1
AWS_S3_BUCKET=shopping-images

# Email
SENDGRID_API_KEY=xxx

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=xxx
ALGOLIA_ADMIN_KEY=xxx
```

### `docker-compose.yml`
```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: shopping
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  postgres_data:
```

### Root `package.json`
```json
{
  "name": "shopping",
  "version": "1.0.0",
  "description": "Creator marketplace for sneakers, clothing, and more",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel run dev",
    "build": "pnpm -r run build",
    "test": "pnpm -r run test",
    "lint": "pnpm -r run lint",
    "type-check": "pnpm -r run type-check"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.1.0"
  }
}
```

---

## STEP 5: Create Shared Packages

### `packages/types/package.json`
```json
{
  "name": "@shopping/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.1.0"
  }
}
```

### `packages/types/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### `packages/types/src/index.ts`
```typescript
// User types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  is_seller: boolean;
  created_at: Date;
}

export interface Seller extends User {
  shop_id: string;
}

// Shop types
export interface Shop {
  id: string;
  seller_id: string;
  shop_name: string;
  description?: string;
  rating: number;
  followers: number;
  created_at: Date;
}

// Product types
export interface Product {
  id: string;
  shop_id: string;
  category_id: string;
  title: string;
  price: number;
  condition: 'New' | 'Like New' | 'Used' | 'Vintage';
  brand: string;
  stock: number;
  rating: number;
  created_at: Date;
}

// Order types
export interface Order {
  id: string;
  buyer_id: string;
  shop_id: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  created_at: Date;
}

// Cart types
export interface CartItem {
  product_id: string;
  quantity: number;
}
```

### `packages/ui/package.json`
```json
{
  "name": "@shopping/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.1.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### `packages/utils/package.json`
```json
{
  "name": "@shopping/utils",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.1.0"
  }
}
```

### `packages/utils/src/index.ts`
```typescript
// Format helpers
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Validation helpers
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhoneNumber = (phone: string) => {
  const regex = /^[\d\s\-\+\(\)]{10,}$/;
  return regex.test(phone);
};
```

---

## STEP 6: Create Web App (Next.js)

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app --no-git --skip-install
cd ../..
```

### `apps/web/package.json` (Updated)
```json
{
  "name": "@shopping/web",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@shopping/types": "workspace:*",
    "@shopping/ui": "workspace:*",
    "@shopping/utils": "workspace:*",
    "axios": "^1.4.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.1.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.24",
    "autoprefixer": "^10.4.14"
  }
}
```

---

## STEP 7: Create Backend API (Express)

```bash
cd apps/backend
npm init -y
```

### `apps/backend/package.json`
```json
{
  "name": "@shopping/backend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "lint": "eslint src",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "dotenv": "^16.3.1",
    "pg": "^8.10.0",
    "redis": "^4.6.7",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "axios": "^1.4.0",
    "zod": "^3.22.2",
    "pino": "^8.14.1",
    "stripe": "^14.0.0",
    "@shopping/types": "workspace:*",
    "@shopping/utils": "workspace:*"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "typescript": "^5.1.0",
    "tsx": "^3.12.8",
    "vitest": "^0.33.0",
    "@types/jsonwebtoken": "^9.0.2"
  }
}
```

### `apps/backend/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### `apps/backend/src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## STEP 8: Initialize & Install

```bash
# Install pnpm if needed
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm build
```

---

## STEP 9: Commit to Git

```bash
git add .
git commit -m "chore: initialize monorepo with packages and apps"
git push origin main
```

✅ **Monorepo is initialized!**

---

## STEP 10: Verify Setup

```bash
# Check structure
tree -L 2 -I node_modules

# Test web app
cd apps/web
pnpm dev
# Open http://localhost:3000

# Test backend
cd ../backend
pnpm dev
# Should see: 🚀 Server running on port 3001
```

---

## 🎯 What's Next

1. ✅ Monorepo initialized
2. 🔄 Create database migrations
3. 🔄 Implement authentication
4. 🔄 Build product listing
5. 🔄 Implement shopping cart
6. 🔄 Add Stripe integration
7. 🔄 Build seller dashboard
8. 🔄 Launch MVP!

---

## 📁 Final Structure

```
shop/
├── apps/
│   ├── web/              Next.js marketplace
│   ├── backend/          Express.js API
│   ├── mobile/           React Native (future)
│   └── admin/            Admin dashboard (future)
├── packages/
│   ├── types/            Shared TypeScript
│   ├── ui/               React components
│   └── utils/            Helpers
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── package.json
├── .env.example
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

**Ready to build the next Etsy? Let's go! 🚀**
