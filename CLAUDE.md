# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Project Setup
```bash
npm install                    # Install dependencies
cp .env.example .env          # Create environment file (configure before running)
npx expo install              # Install Expo dependencies
```

### Development
```bash
npm start                     # Start Expo development server
npm run android              # Run on Android device/emulator
npm run ios                  # Run on iOS device/simulator
npm run web                  # Run in web browser (development only)
```

### Code Quality & Testing
```bash
npm run lint                 # Run ESLint
npm run lint:fix             # Fix auto-fixable lint issues
npm run typecheck            # Run TypeScript type checking
npm test                     # Run Jest unit tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate test coverage report
```

### Building & Deployment
```bash
npm run prebuild             # Generate native code
npm run build:android        # Build Android app with EAS
npm run build:ios            # Build iOS app with EAS
npm run submit:android       # Submit to Google Play Store
npm run submit:ios           # Submit to Apple App Store
```

## Architecture Overview

### Core Technology Stack
- **React Native 0.73** with **Expo SDK 50** for cross-platform mobile development
- **Supabase** as backend-as-a-service (PostgreSQL, Auth, Storage, Edge Functions)
- **Stripe** for payment processing with React Native integration
- **React Query** for server state management and caching
- **Zustand** for client-side state management
- **React Navigation 6** for navigation between screens

### Project Structure Philosophy
The codebase follows a **feature-based architecture** with strict TypeScript and absolute import paths:

```
src/
├── components/    # Reusable UI components organized by domain
├── screens/       # Full-screen components for navigation
├── services/      # Business logic and API integrations
├── navigation/    # Navigation configuration and route definitions
├── store/         # Global state management (Zustand stores)
├── hooks/         # Custom React hooks for shared logic
├── utils/         # Pure utility functions
├── types/         # TypeScript type definitions
└── config/        # App configuration and constants
```

### Import Path Strategy
Use absolute imports with the `@/` prefix for all internal modules:
```typescript
import { supabase } from '@/config/supabase';
import { Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
```

### E-commerce Domain Model
The application is built around these core entities:

**Products with Variants**: Products have size/color variants with individual stock tracking. Each variant has its own SKU, price override capability, and stock quantity.

**Cart System**: Shopping cart persists locally and syncs with Supabase for authenticated users. Cart items reference specific product variants, not just products.

**Order Management**: Orders include French VAT calculation (20%), flat-rate shipping (€10), and integrated tracking system with 6 status levels.

**Authentication**: Uses Supabase Auth with secure token storage via Expo SecureStore for biometric protection.

### Data Flow Architecture
- **React Query** manages all server state with 5-minute cache stale time
- **Zustand** stores handle UI state (cart, user preferences, navigation state)
- **Supabase RLS** enforces row-level security policies
- **Stripe Elements** ensures PCI compliance by never touching card data

### French Market Specifics
The app is designed for the French market with:
- 20% VAT calculation on all orders
- French address validation (5-digit postal codes)
- Euro currency throughout
- French phone number validation (`+33` or `0` prefix)
- Tracking status messages in French

### Performance Optimizations
- **FlatList** with `initialNumToRender: 10` and `windowSize: 5` for product lists
- **React Query** caching with smart invalidation strategies
- **Expo Image** for optimized image loading and caching
- **MMKV** for high-performance local storage

### Environment Variables
Required environment variables in `.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=           # Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anonymous key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe publishable key
EXPO_PUBLIC_APP_ENV=                # development|staging|production
```

### Feature Flags
The app uses feature flags for progressive enhancement:
- `MULTI_VENDOR`: Enable marketplace features (Phase 2)
- `ADVANCED_SEARCH`: Enable Elasticsearch integration (Phase 3)
- `PUSH_NOTIFICATIONS`: Enable push notification system

### Database Integration
Supabase client is configured with:
- **Secure token storage** using Expo SecureStore
- **Auto-refresh tokens** for seamless authentication
- **Type-safe database operations** with generated TypeScript types
- **Row Level Security** policies for data protection

### Testing Strategy
- **Unit tests** with Jest and React Native Testing Library
- **80% coverage threshold** enforced for branches, functions, lines, and statements
- **TypeScript strict mode** with comprehensive type checking
- **ESLint** with React hooks and TypeScript rules

### State Management Patterns
- **Server state**: React Query for API data, caching, and synchronization
- **Client state**: Zustand stores for UI state and user preferences
- **Authentication state**: Supabase Auth with automatic token refresh
- **Cart persistence**: Local storage with cloud sync for authenticated users

### Code Quality Standards
- **TypeScript strict mode** with no implicit any
- **ESLint** with React hooks exhaustive deps rule
- **Absolute imports** using `@/` prefix for all internal modules
- **Consistent naming**: PascalCase for components, camelCase for functions/variables
- **File naming**: kebab-case for files, PascalCase for component files

### Security Implementation
- **Expo SecureStore** for sensitive data (auth tokens, payment info)
- **Supabase RLS** policies prevent unauthorized data access
- **Stripe Elements** for PCI-compliant payment processing
- **HTTPS enforcement** via Cloudflare
- **Input validation** using Zod schemas (to be implemented)

## Design System Integration

The codebase implements a **comprehensive design system** based on the enhanced design-system.json file:

### Design System Components
All UI components are built using the design system tokens from `@/config/constants.ts`:

**Common Components (`@/components/common/`)**:
- `Text` - Typography with variants (h1-h6, body, price, product, button styles)
- `Button` - Primary, secondary, ghost, danger variants with size options
- `Card` - Consistent card styling with shadow and radius
- `Input` - Form inputs with focus states and validation
- `Badge` - E-commerce badges (sale, new, bestseller, etc.)

**Product Components (`@/components/product/`)**:
- `ProductCard` - Standardized product display with 3:4 aspect ratio
- `ProductGrid` - Responsive grid with performance optimizations

**Cart Components (`@/components/cart/`)**:
- `CartItem` - Shopping cart item with quantity controls
- `CartSummary` - Order summary with French VAT calculation

### Design Token Usage
```typescript
// Always use design tokens instead of hardcoded values
import { UI_CONFIG, ECOMMERCE_CONFIG, TEXT_STYLES } from '@/config/constants';

// Spacing (8px base scale)
marginTop: UI_CONFIG.SPACING[3] // 24px

// Colors (semantic naming)
backgroundColor: UI_CONFIG.COLORS.primary
color: UI_CONFIG.COLORS.text.secondary

// Typography (predefined text styles)
<Text variant="product-title" color="text.primary">

// E-commerce specific tokens
padding: ECOMMERCE_CONFIG.product.card.padding
```

### Component Guidelines
1. **Always use design system components** instead of raw React Native components
2. **Use semantic color paths** (e.g., 'text.primary', 'feedback.error')
3. **Follow spacing scale** (multiples of 8px base unit)
4. **Use predefined text variants** for consistent typography
5. **Apply shadows and borders** from the design system
6. **Respect breakpoints** for responsive design

### French Market Design
- **E-commerce badges** with French text ("SOLDE", "NOUVEAU")
- **VAT calculation** (20%) integrated in pricing displays
- **Euro currency** formatting (€XX.XX)
- **French labels** throughout the interface

When working with this codebase, prioritize type safety, follow the established import patterns, maintain the feature-based architecture, and **always use design system components** for 100% consistency. Always use React Query for server state and Zustand for client state management.