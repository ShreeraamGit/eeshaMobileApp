# Eesha Silks E-commerce - Monorepo

**Scalable monorepo architecture** for Eesha Silks e-commerce ecosystem.

## 📁 Project Structure

```
eesha_app/                     # Root monorepo
├── packages/
│   ├── mobile/                # React Native mobile app (Expo)
│   │   ├── src/              # Mobile app source code
│   │   ├── app/              # Expo Router screens
│   │   └── package.json      # Mobile dependencies
│   │
│   ├── admin/                 # Next.js admin dashboard
│   │   ├── src/              # Admin app source code
│   │   ├── app/              # Next.js App Router
│   │   └── package.json      # Admin dependencies
│   │
│   └── shared/                # Shared package
│       ├── src/
│       │   ├── types/        # TypeScript types
│       │   ├── config/       # Constants & config
│       │   └── utils/        # Utilities
│       └── package.json      # Shared dependencies
│
├── docs/                      # Documentation
├── package.json              # Root workspace config
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI
- Supabase account
- Stripe account

### Installation

```bash
# Install all workspace dependencies
npm install
```

### Development

```bash
# Run mobile app only
npm run mobile

# Run admin dashboard only
npm run admin

# Run both mobile + admin in parallel
npm run dev

# Run on specific platforms
npm run mobile:ios
npm run mobile:android
```

## 📦 Workspace Packages

### `@eesha/mobile` - React Native Mobile App

**Tech Stack:**
- React Native 0.81+ with Expo SDK 54
- Expo Router for navigation
- Zustand for state management
- React Query for data fetching
- Stripe for payments
- Supabase for backend

**Commands:**
```bash
npm run mobile              # Start Expo dev server
npm run mobile:ios          # Run on iOS
npm run mobile:android      # Run on Android
npm run mobile:build:ios    # Build iOS app
npm run mobile:build:android # Build Android app
```

**Location:** `packages/mobile/`

---

### `@eesha/admin` - Next.js Admin Dashboard

**Tech Stack:**
- Next.js 15+ with App Router
- React 19
- TailwindCSS for styling
- Supabase for backend
- Server Components & Server Actions

**Commands:**
```bash
npm run admin               # Start dev server (port 3001)
npm run admin:build         # Build for production
npm run admin:start         # Start production server
```

**Location:** `packages/admin/`

---

### `@eesha/shared` - Shared Package

**Contains:**
- `types/database.ts` - Database types (single source of truth)
- `config/constants.ts` - Shared constants (VAT, shipping, etc.)
- `utils/validation.ts` - Validation utilities
- `utils/formatting.ts` - Formatting utilities (price, date, phone)

**Usage:**
```typescript
// In mobile app
import { Product, formatting } from '@eesha/shared';

// In admin dashboard
import { Product, formatting } from '@eesha/shared';
```

**Location:** `packages/shared/`

## 🔑 Environment Variables

### Mobile App (`packages/mobile/.env`)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Admin Dashboard (`packages/admin/.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🎯 Key Features

### Shared Types

All database types are defined once in `@eesha/shared` and used across mobile and admin:

```typescript
// packages/shared/src/types/database.ts
export interface Product {
  id: string;
  name: string;
  base_price: number;
  // ...
}

// Used in mobile app
import { Product } from '@eesha/shared';

// Used in admin dashboard
import { Product } from '@eesha/shared';
```

### Shared Utilities

Common utilities are centralized:

```typescript
import { formatting, validation } from '@eesha/shared';

// Format price in EUR with French locale
formatting.formatPrice(299.99); // "299,99 €"

// Calculate order total with VAT
formatting.calculateOrderTotal(100); // { subtotal: 100, vat: 20, shipping: 10, total: 130 }

// Validate French postal code
validation.isValidPostalCode('75001'); // true
```

## 🛠️ Development Workflow

### Adding a New Feature

1. **Define types** in `packages/shared/src/types/`
2. **Add utilities** in `packages/shared/src/utils/` if needed
3. **Implement in mobile** at `packages/mobile/src/`
4. **Implement in admin** at `packages/admin/src/`

### Modifying Database Schema

1. Update `docs/setup/database-schema.sql`
2. Update `packages/shared/src/types/database.ts`
3. Both mobile and admin automatically get new types

### Running Tests

```bash
# Run all tests across all packages
npm run test

# Run type checking
npm run typecheck

# Run linting
npm run lint
npm run lint:fix
```

## 📚 Documentation

- **[Quick Start](./QUICK_START.md)** - 30-minute setup guide
- **[Full Setup Guide](./docs/setup/01-quick-start.md)** - Comprehensive setup
- **[Variants Guide](./docs/guides/variants-implementation.md)** - Product variants
- **[4-Week Roadmap](./docs/planning/4-week-roadmap.md)** - Development timeline
- **[Admin Dashboard Setup](./docs/setup/02-admin-dashboard.md)** - Admin guide

## 🏗️ Architecture Decisions

### Why Monorepo?

✅ **Single source of truth** for types and utilities
✅ **Consistent versioning** across mobile and admin
✅ **Shared code** reduces duplication
✅ **Easier refactoring** - change once, update everywhere
✅ **Atomic commits** - mobile + admin + shared in one PR

### Why npm Workspaces?

✅ **Native to npm** - no additional tools needed
✅ **Simple** - just `npm install` in root
✅ **Fast** - shared node_modules, minimal duplication
✅ **Scalable** - can add more packages later

### Package Naming Convention

- `@eesha/mobile` - Mobile app
- `@eesha/admin` - Admin dashboard
- `@eesha/shared` - Shared package
- Future: `@eesha/vendor` - Vendor dashboard (for multi-vendor)
- Future: `@eesha/api` - Custom API (if needed)

## 📈 Scaling the Monorepo

### Adding New Packages

```bash
# Add vendor dashboard
mkdir -p packages/vendor
cd packages/vendor
npm init -y
# Edit package.json name to @eesha/vendor
```

### Adding New Shared Modules

```bash
# Add email templates
mkdir packages/shared/src/email
touch packages/shared/src/email/templates.ts
```

### Multi-Vendor Support (Phase 2)

```
packages/
├── mobile/           # Customer app
├── admin/            # Admin dashboard
├── vendor/           # NEW: Vendor dashboard
├── shared/           # Shared types/utils
└── api/              # NEW: Custom API (if needed)
```

## 🔒 Security

- ✅ Supabase RLS policies for data protection
- ✅ Environment variables not committed
- ✅ Service role keys only in admin (server-side)
- ✅ Stripe keys properly scoped (publishable vs secret)

## 📞 Support

- **Documentation:** `./docs/README.md`
- **Issues:** Check `./docs/guides/` for troubleshooting
- **Supabase:** https://supabase.com/docs
- **Expo:** https://docs.expo.dev
- **Next.js:** https://nextjs.org/docs

## 🎯 Next Steps

1. **Setup Supabase** - Follow `./docs/setup/01-quick-start.md`
2. **Configure environment** - Copy `.env.example` files
3. **Install dependencies** - `npm install` in root
4. **Run mobile app** - `npm run mobile`
5. **Run admin dashboard** - `npm run admin`
6. **Read docs** - Review `./docs/README.md`

---

**Built with ❤️ for Eesha Silks**
