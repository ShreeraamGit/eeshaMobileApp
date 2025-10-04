# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Architecture

This is a **npm workspaces monorepo** with three packages:

```
packages/
├── mobile/     # React Native app (Expo SDK 54, React 19)
├── admin/      # Next.js dashboard (Next.js 15, React 19)
└── shared/     # Shared types, utilities, and constants
```

**Critical**: Always use `@eesha/shared` for types and utilities shared between mobile and admin. Never duplicate code.

## Development Commands

### Monorepo Commands (from root)

```bash
npm install                      # Install all workspace dependencies
npm run mobile                   # Start mobile app (Expo)
npm run admin                    # Start admin dashboard (Next.js on port 3001)
npm run dev                      # Run mobile + admin in parallel
npm run typecheck                # Type check all packages
npm run lint                     # Lint all packages
npm run lint:fix                 # Fix linting issues
npm test                         # Test all packages
npm run clean                    # Remove all node_modules and builds
npm run clean:install            # Clean and reinstall
```

### Mobile App (packages/mobile/)

```bash
npm run mobile                   # Start Expo dev server
npm run mobile:ios               # Run on iOS simulator
npm run mobile:android           # Run on Android emulator
npm run mobile:build:ios         # Build iOS app with EAS
npm run mobile:build:android     # Build Android app with EAS
```

### Admin Dashboard (packages/admin/)

```bash
npm run admin                    # Start Next.js dev server (port 3001)
npm run admin:build              # Build for production
npm run admin:start              # Start production server
```

### Testing & Quality

```bash
npm test                         # Run all tests
npm run test:watch               # Watch mode (mobile only)
npm run test:coverage            # Coverage report (mobile only)
npm run typecheck                # Type check all packages
npm run lint                     # Lint all packages
```

## Critical Architecture Patterns

### Shared Package System

The `@eesha/shared` package is the **single source of truth** for:

1. **Database Types** (`packages/shared/src/types/database.ts`):
   - Product, ProductVariant, ProductWithVariants
   - Order, OrderItem, OrderTracking
   - All Supabase database types

2. **Constants** (`packages/shared/src/config/constants.ts`):
   - APP_CONFIG (VAT: 20%, shipping: €10, currency: EUR)
   - ORDER_STATUSES, PAYMENT_STATUSES, USER_ROLES
   - VALIDATION_RULES (French postal codes, phone numbers)
   - ERROR_MESSAGES (in French)

3. **Utilities** (`packages/shared/src/utils/`):
   - `validation.ts` - French postal codes, phone, email validation
   - `formatting.ts` - Price formatting (€), VAT calculation, date formatting

**Usage in mobile**:
```typescript
import { Product, formatting, validation } from '@eesha/shared';
```

**Usage in admin**:
```typescript
import { Product, formatting, APP_CONFIG } from '@eesha/shared';
```

### Product Variants Architecture

**Critical**: Products have a **two-table variant system**:

```
products table (parent)
├── id, name, description, base_price, category, images

product_variants table (children)
├── id, product_id, sku, size, color, color_hex
├── price (optional override), stock_quantity, image_url
└── UNIQUE(product_id, size, color)
```

**Key Points**:
- Cart items reference `variant_id`, NOT `product_id`
- Each variant has individual stock tracking
- SKU format: `{CATEGORY}-{SIZE}-{COLOR}` (e.g., "SAR-M-RED")
- Stock reduction is automatic via database trigger on `payment_status = 'paid'`

### State Management Architecture

**Complete documentation**: `docs/development/state-management.md`

The app uses a **hybrid state management approach** with clear separation of concerns:

#### Decision Tree: Which State Manager to Use?

```
Does the data come from the server?
├─ YES → Use React Query
│   └─ Examples: Products, Orders, User Profile
│
└─ NO → Does it need to persist locally?
    ├─ YES → Use Zustand + MMKV
    │   └─ Examples: Cart, Auth Session, User Preferences
    │
    └─ NO → Use local useState
        └─ Examples: Form inputs, Modal visibility
```

#### Server State (React Query)
- **Location**: `packages/mobile/src/services/`
- **Purpose**: All API data fetching and caching
- **Configuration**: 5-minute stale time, automatic revalidation
- **Examples**: Products, Orders, User Profile

```typescript
// ✅ CORRECT: Fetch products with React Query
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsService.getProducts(),
});
```

#### Client State (Zustand)
- **Location**: `packages/mobile/src/store/`
- **Purpose**: UI state, cart, user preferences
- **Persistence**: MMKV for mobile (fast, synchronous)
- **Stores**:
  - `authStore.ts` - Authentication & user session
  - `cartStore.ts` - Shopping cart & checkout

```typescript
// ✅ CORRECT: Use Zustand for client state
const { user, isAuthenticated, signIn, signOut } = useAuthStore();
const { items, total, addItem, removeItem } = useCartStore();
```

#### Key Patterns

**Authentication Flow**:
```typescript
// 1. User signs in (Zustand)
const { signIn } = useAuthStore();
await signIn(email, password);

// 2. Session stored in MMKV (persistent)
// 3. Auth state triggers navigation
// 4. Protected screens check isAuthenticated
```

**Shopping Cart Flow**:
```typescript
// 1. Add item to cart (Zustand + MMKV)
const { addItem } = useCartStore();
addItem(product, variant, quantity);

// 2. Cart persists across app restarts
// 3. Create order (React Query mutation)
const createOrder = useMutation({
  mutationFn: (orderData) => ordersService.createOrder(orderData),
});

// 4. Clear cart after successful order
const { clearCart } = useCartStore();
```

**Business Logic in Cart**:
- VAT calculation: 20% (`APP_CONFIG.VAT_RATE`)
- Shipping: €10 flat rate (`APP_CONFIG.SHIPPING_COST`)
- Total = (Subtotal + Shipping) × (1 + VAT)

**Never mix these concerns**:
```typescript
// ❌ WRONG: Don't put server data in Zustand
const useProductStore = create((set) => ({
  products: [], // ❌ Use React Query instead
}));

// ❌ WRONG: Don't put UI state in React Query
const { data: isModalOpen } = useQuery(['modal']); // ❌ Use useState instead
```

### Supabase Integration

**Mobile app** (`packages/mobile/src/services/supabase.ts`):
- Uses Expo SecureStore for token storage
- Client-side RLS policies enforce security
- Anonymous key only (`EXPO_PUBLIC_SUPABASE_ANON_KEY`)

**Admin dashboard** (future implementation):
- Uses Next.js Server Components
- Service role key for admin operations (server-side only)
- `@supabase/ssr@0.7.0` with new cookie API

### French Market Requirements

**Always** include in order calculations:
- VAT: 20% (`APP_CONFIG.VAT_RATE`)
- Shipping: €10 flat rate (`APP_CONFIG.SHIPPING_COST`)
- Currency: EUR formatted as `299,99 €` (use `formatting.formatPrice()`)

**Validation**:
- Postal codes: 5 digits (use `validation.isValidPostalCode()`)
- Phone: `+33` or `0` prefix (use `validation.isValidPhone()`)

## Import Path Conventions

**Mobile app**: Use `@/` prefix
```typescript
import { Product } from '@/types';
import { supabase } from '@/services/supabase';
import { useCartStore } from '@/store/cartStore';
```

**Admin app**: Use `@/` prefix
```typescript
import { Product } from '@eesha/shared';
import { createClient } from '@/lib/supabase';
```

**Shared package**: Use relative imports
```typescript
import { APP_CONFIG } from '../config/constants';
```

## Database Schema Location

**Production schema**: `docs/getting-started/database-schema.sql`

This includes:
- Product variants with stock tracking
- Auto stock reduction trigger
- Order tracking system
- French VAT fields
- Inventory reservations (30-min holds)

**Never use** archived schemas in `docs/archive/`.

## Mobile App Entry Point

**Critical**: Entry point is `packages/mobile/index.js` (NOT `App.tsx` directly)

```javascript
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
```

`package.json` must have: `"main": "index.js"`

## Environment Variables

### Mobile (`packages/mobile/.env`)
```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Admin (`packages/admin/.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=                   # Server-side only!
```

**Never** commit `.env` or `.env.local` files.

## Design System Usage (Mobile Only)

**Always** use design tokens from `@/config/constants.ts`:

```typescript
import { UI_CONFIG, ECOMMERCE_CONFIG } from '@/config/constants';

// Spacing (8px base scale)
marginTop: UI_CONFIG.SPACING[3]  // 24px

// Colors
backgroundColor: UI_CONFIG.COLORS.primary
```

**Use design system components**:
- `@/components/common/Text` - NOT React Native `<Text>`
- `@/components/common/Button` - NOT custom buttons
- `@/components/product/ProductCard` - For all product displays

## Testing Strategy

**Mobile app**:
- Jest + React Native Testing Library
- 80% coverage threshold enforced
- Tests in `__tests__/` folders or `.test.ts` files

**Shared package**:
- Pure function tests
- No coverage threshold (utility library)

**Admin**:
- No tests currently (add Next.js + React Testing Library)

## Common Workflows

### Adding a New Database Field

1. Update `docs/getting-started/database-schema.sql`
2. Update `packages/shared/src/types/database.ts`
3. Both mobile and admin automatically get new types

### Adding a Shared Utility

1. Create in `packages/shared/src/utils/`
2. Export from `packages/shared/src/index.ts`
3. Use in mobile: `import { myUtil } from '@eesha/shared'`
4. Use in admin: `import { myUtil } from '@eesha/shared'`

### Fixing Mobile App Entry Point Issues

If "Cannot resolve entry file" error:
```bash
cd packages/mobile
# Verify index.js exists
# Verify package.json has "main": "index.js"
npx expo start --clear
```

### Working with Variants

**Always** fetch products with variants:
```typescript
import { variantsService } from '@/services/api/variantsService';

const product = await variantsService.getProductWithVariants(productId);
// Returns: { ...product, variants[], available_sizes[], available_colors[] }
```

**Cart items** must include:
```typescript
{
  variant_id: string;  // Required!
  product_id: string;
  size: string;
  color: string;
  sku: string;
  // ...
}
```

## Security Considerations

- **Supabase RLS**: All tables have row-level security
- **Stripe**: Never expose secret keys in client code
- **Admin service_role_key**: Server-side only (Next.js API routes/server components)
- **Expo SecureStore**: Used for auth tokens on mobile

## Documentation Structure

- `docs/README.md` - Main documentation hub
- `docs/getting-started/` - Setup guides, database schema
- `docs/development/` - Variants guide, state management, troubleshooting
- `docs/infrastructure/` - Admin setup, security, timeline
- `docs/archive/` - Old versions (reference only, don't use)

### Key Documentation Files

- **State Management**: `docs/development/state-management.md`
  - Complete architecture guide
  - Zustand stores (auth, cart)
  - React Query patterns
  - MMKV persistence
  - Authentication & cart flows
  - Best practices & troubleshooting

## Package Dependencies

**React version**: 19.1.0 (all packages)
**Expo SDK**: 54.0.12
**Next.js**: 15.5.4
**Supabase SSR**: 0.7.0 (uses new cookie API)

When installing packages that require peer dependencies with React 19:
```bash
npm install <package> --legacy-peer-deps
```

## Performance Patterns

**Mobile**:
- FlatList with `initialNumToRender: 10`, `windowSize: 5`
- React Query caching (5-min stale time)
- Expo Image for optimized loading
- MMKV for fast local storage

**Admin**:
- Next.js Server Components by default
- Client Components only when needed
- Streaming for large data sets

## Workspace Management

**Adding a new package**:
```bash
mkdir -p packages/new-package
cd packages/new-package
npm init -y
# Edit package.json name to "@eesha/new-package"
```

**Installing package-specific dependencies**:
```bash
npm install <package> --workspace=@eesha/mobile
```

**Linking workspace packages**:
Automatic via npm workspaces. Just run `npm install` from root.
