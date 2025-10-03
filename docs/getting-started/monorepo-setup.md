# 🏗️ Monorepo Setup - Complete Guide

**Production-grade monorepo** using npm workspaces for scalable development.

---

## ✅ What Was Created

### 1. **Package Structure**

```
eesha_app/
├── packages/
│   ├── mobile/                # @eesha/mobile - React Native app
│   ├── admin/                 # @eesha/admin - Next.js dashboard
│   └── shared/                # @eesha/shared - Shared code
│
├── package.json              # Root workspace manager
├── tsconfig.json             # Root TypeScript config
├── .gitignore                # Monorepo gitignore
└── README.md                 # Updated with monorepo info
```

### 2. **Shared Package (`@eesha/shared`)**

Created complete shared library with:

**Types** (`packages/shared/src/types/database.ts`):
- `Product`, `ProductVariant`, `ProductWithVariants`
- `Order`, `OrderItem`, `OrderTracking`
- `InventoryReservation`, `User`
- `Database` - Supabase type definition

**Config** (`packages/shared/src/config/constants.ts`):
- `APP_CONFIG` - VAT rate, shipping, currency
- `ORDER_STATUSES`, `PAYMENT_STATUSES`, `USER_ROLES`
- `PRODUCT_CATEGORIES`, `SIZES`
- `VALIDATION_RULES` - French postal code, phone regex
- `ERROR_MESSAGES` - French error messages

**Utils** (`packages/shared/src/utils/`):
- `validation.ts` - Email, password, postal code, phone validation
- `formatting.ts` - Price, date, phone formatting, VAT calculation

### 3. **Admin Dashboard (`@eesha/admin`)**

Created Next.js 15 dashboard with:
- ✅ App Router (React Server Components)
- ✅ TailwindCSS for styling
- ✅ TypeScript configuration
- ✅ Imports `@eesha/shared` package
- ✅ Runs on port 3001 (mobile on 8081)

### 4. **Workspace Configuration**

Root `package.json` with commands:
```json
{
  "workspaces": ["packages/*"],
  "scripts": {
    "mobile": "npm run start --workspace=@eesha/mobile",
    "admin": "npm run dev --workspace=@eesha/admin",
    "dev": "concurrently \"npm run mobile\" \"npm run admin\""
  }
}
```

---

## 🚀 Getting Started

### Step 1: Install Dependencies

```bash
# From root directory
cd /Users/sharuja/Desktop/eeshaMobileApp/eesha_app

# Install all workspace dependencies (mobile + admin + shared)
npm install
```

This will:
- Install mobile app dependencies in `packages/mobile/node_modules`
- Install admin dependencies in `packages/admin/node_modules`
- Install shared dependencies in `packages/shared/node_modules`
- Create symlinks for `@eesha/shared` in mobile and admin

### Step 2: Configure Environment Variables

**Mobile App:**
```bash
cd packages/mobile
cp .env.example .env
# Edit .env with your Supabase and Stripe keys
```

**Admin Dashboard:**
```bash
cd packages/admin
cp .env.example .env.local
# Edit .env.local with your keys (including service_role_key)
```

### Step 3: Run Development Servers

```bash
# From root directory

# Option 1: Run mobile only
npm run mobile

# Option 2: Run admin only
npm run admin

# Option 3: Run both in parallel
npm run dev
```

---

## 📦 Using the Shared Package

### In Mobile App (`packages/mobile/src/`)

```typescript
import {
  Product,
  ProductVariant,
  formatting,
  validation,
  APP_CONFIG
} from '@eesha/shared';

// Use shared types
const product: Product = {
  id: '123',
  name: 'Saree Soie Premium',
  base_price: 299.99,
  // ...
};

// Use shared utilities
const priceDisplay = formatting.formatPrice(product.base_price); // "299,99 €"
const orderTotal = formatting.calculateOrderTotal(100); // { subtotal: 100, vat: 20, shipping: 10, total: 130 }

// Use shared validation
const isValid = validation.isValidPostalCode('75001'); // true

// Use shared constants
const vatRate = APP_CONFIG.VAT_RATE; // 0.2
```

### In Admin Dashboard (`packages/admin/src/`)

```typescript
import {
  Product,
  ProductVariant,
  formatting,
  validation
} from '@eesha/shared';

// Same types and utilities as mobile!
const product: Product = await getProduct(id);
const formattedPrice = formatting.formatPrice(product.base_price);
```

---

## 🔧 Development Workflow

### Adding a New Database Field

**Example: Add `brand` field to products**

1. **Update SQL schema** (`docs/setup/database-schema.sql`):
```sql
ALTER TABLE products ADD COLUMN brand VARCHAR(100);
```

2. **Update shared types** (`packages/shared/src/types/database.ts`):
```typescript
export interface Product {
  id: string;
  name: string;
  brand: string; // NEW
  base_price: number;
  // ...
}
```

3. **Both mobile and admin automatically get the new field!**

```typescript
// In mobile app
const product: Product = await productsService.getProduct(id);
console.log(product.brand); // TypeScript knows about this!

// In admin dashboard
const product: Product = await getProduct(id);
console.log(product.brand); // Same type!
```

### Adding a New Utility Function

**Example: Add SKU generator**

1. **Create in shared** (`packages/shared/src/utils/sku.ts`):
```typescript
export const skuUtils = {
  generate: (category: string, size: string, color: string): string => {
    const categoryCode = category.slice(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    const colorCode = color.slice(0, 3).toUpperCase();
    return `${categoryCode}-${sizeCode}-${colorCode}`;
  },
};
```

2. **Export from index** (`packages/shared/src/index.ts`):
```typescript
export * from './utils/sku';
```

3. **Use in mobile and admin**:
```typescript
import { skuUtils } from '@eesha/shared';

const sku = skuUtils.generate('Sarees', 'M', 'Rouge'); // "SAR-M-ROU"
```

---

## 📊 Monorepo Benefits

### Before (Single Repo)

❌ Types duplicated between mobile and potential admin
❌ Utilities copy-pasted
❌ Constants defined twice
❌ Version conflicts between apps
❌ Hard to maintain consistency

### After (Monorepo)

✅ **Single source of truth** for types
✅ **Shared utilities** across apps
✅ **Consistent validation** rules
✅ **Atomic updates** - change once, update everywhere
✅ **Type safety** between mobile and admin
✅ **Easier testing** - shared code tested once

---

## 🎯 Common Commands

### Development

```bash
# Run mobile app
npm run mobile

# Run mobile on iOS
npm run mobile:ios

# Run mobile on Android
npm run mobile:android

# Run admin dashboard
npm run admin

# Run both mobile + admin
npm run dev
```

### Building

```bash
# Build mobile for iOS
npm run mobile:build:ios

# Build mobile for Android
npm run mobile:build:android

# Build admin for production
npm run admin:build

# Start admin production server
npm run admin:start
```

### Quality Checks

```bash
# Type check all packages
npm run typecheck

# Lint all packages
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests
npm run test
```

### Maintenance

```bash
# Clean all node_modules and build outputs
npm run clean

# Clean and reinstall
npm run clean:install
```

---

## 🏗️ Scaling the Monorepo

### Adding a Vendor Dashboard (Phase 2)

```bash
# Create vendor package
mkdir -p packages/vendor

# Create vendor package.json
cd packages/vendor
npm init -y
# Change name to "@eesha/vendor"

# Add dependencies
npm install next react react-dom @eesha/shared
```

Then vendor can import from `@eesha/shared` just like mobile and admin!

### Adding Custom API (Future)

```bash
# Create API package
mkdir -p packages/api

# Create API package.json (Express/Fastify)
cd packages/api
npm init -y
# Change name to "@eesha/api"

# Add dependencies including @eesha/shared
npm install express @eesha/shared
```

---

## 🔍 Troubleshooting

### Issue: `Cannot find module '@eesha/shared'`

**Solution:**
```bash
# From root directory
npm install

# This creates symlinks for workspace packages
```

### Issue: TypeScript errors in shared package

**Solution:**
```bash
# Check shared package
cd packages/shared
npm run typecheck

# Fix any TypeScript errors in shared first
```

### Issue: Mobile app can't find shared types

**Solution:**
Check `packages/mobile/tsconfig.json` has correct path:
```json
{
  "compilerOptions": {
    "paths": {
      "@eesha/shared": ["../shared/src"]
    }
  }
}
```

### Issue: Admin app not hot-reloading

**Solution:**
```bash
# Restart admin dev server
npm run admin
```

---

## 📈 Workspace Structure Benefits

### Single `npm install`

```bash
# Install everything at once
npm install

# Not this:
cd mobile && npm install
cd ../admin && npm install
cd ../shared && npm install
```

### Shared Dependencies

Mobile and admin both use `@supabase/supabase-js`? It's only installed once in root `node_modules`!

### Version Consistency

All packages use the same version of TypeScript, ESLint, etc. No version conflicts.

### Easy Refactoring

```bash
# Change shared type
vim packages/shared/src/types/database.ts

# Run type check across ALL packages
npm run typecheck

# See errors in mobile AND admin immediately
```

---

## 🎯 Next Steps

1. **[x] Monorepo structure created**
2. **[x] Shared package with types and utilities**
3. **[x] Admin dashboard scaffolded**
4. **[ ] Install dependencies** - Run `npm install`
5. **[ ] Configure environment variables**
6. **[ ] Test mobile app** - Run `npm run mobile`
7. **[ ] Test admin dashboard** - Run `npm run admin`
8. **[ ] Update mobile app** - Import types from `@eesha/shared`
9. **[ ] Build admin features** - Product management, orders

---

## 📚 Additional Resources

- [npm Workspaces Docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

---

**Your monorepo is ready for scalable development! 🚀**
