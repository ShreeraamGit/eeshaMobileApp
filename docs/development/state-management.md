# State Management Architecture

> **Production-Grade State Management Guide for Eesha Silks Mobile App**
> Last Updated: October 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Client State - Zustand](#client-state---zustand)
4. [Server State - React Query](#server-state---react-query)
5. [Persistence Layer - MMKV](#persistence-layer---mmkv)
6. [Authentication Flow](#authentication-flow)
7. [Shopping Cart Flow](#shopping-cart-flow)
8. [Best Practices](#best-practices)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Eesha Silks mobile app uses a **hybrid state management approach** that separates concerns between client-side and server-side state:

```
┌─────────────────────────────────────────────────────┐
│                   State Management                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   Zustand   │  │ React Query  │  │   MMKV    │ │
│  │ (Client)    │  │  (Server)    │  │ (Storage) │ │
│  └─────────────┘  └──────────────┘  └───────────┘ │
│         │                │                 │        │
│         │                │                 │        │
│   ┌─────▼─────┐    ┌────▼────┐      ┌────▼────┐  │
│   │  authStore │    │Products │      │  Cart   │  │
│   │  cartStore │    │ Orders  │      │  Auth   │  │
│   └───────────┘    └─────────┘      └─────────┘  │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Library | Version | Purpose |
|-------|---------|---------|---------|
| **Client State** | `zustand` | 4.4.7 | UI state, cart, auth session |
| **Server State** | `@tanstack/react-query` | 5.8.4 | API data fetching & caching |
| **Persistence** | `react-native-mmkv` | 2.12.2 | Fast local storage |
| **Backend** | `@supabase/supabase-js` | 2.38.4 | Database & auth |

---

## Architecture Principles

### Separation of Concerns

```typescript
// ✅ CORRECT: Client state in Zustand
const { user, isAuthenticated } = useAuthStore();
const { items, total, addItem } = useCartStore();

// ✅ CORRECT: Server state in React Query
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsService.getProducts(),
});

// ❌ WRONG: Don't mix concerns
const useProductStore = create((set) => ({
  products: [], // ❌ Server data shouldn't be in Zustand
}));
```

### Decision Tree: Which State Manager to Use?

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

---

## Client State - Zustand

### Location
```
packages/mobile/src/store/
├── authStore.ts    # Authentication & user session
└── cartStore.ts    # Shopping cart & checkout
```

### 1. Authentication Store

**File**: `src/store/authStore.ts`

#### State Interface

```typescript
interface AuthState {
  // Data
  user: User | null;              // Current user object
  session: Session | null;         // Supabase session
  isLoading: boolean;              // Auth operation in progress
  isAuthenticated: boolean;        // Computed: !!user

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}
```

#### Usage Examples

```typescript
// 1. In Login Screen
import { useAuthStore } from '@/store/authStore';

export const LoginScreen = () => {
  const { signIn, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
    }
    // Navigation handled automatically via isAuthenticated change
  };
};

// 2. Protected Route Check
import { useAuthStore } from '@/store/authStore';

export const ProfileScreen = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return <UserProfile user={user} />;
};

// 3. App Initialization (App.tsx or AppNavigator)
React.useEffect(() => {
  const { initialize } = useAuthStore.getState();
  initialize(); // Restore session from storage
}, []);

// 4. Accessing outside components (in services)
import { useAuthStore } from '@/store/authStore';

export const apiService = {
  async makeRequest() {
    const { session } = useAuthStore.getState();
    const token = session?.access_token;
    // Use token in API call
  }
};
```

#### Key Features

- **Auto-persists** session via Supabase's built-in storage
- **Listens to auth changes** via `onAuthStateChange`
- **Triggers navigation** when `isAuthenticated` changes
- **Handles token refresh** automatically

---

### 2. Shopping Cart Store

**File**: `src/store/cartStore.ts`

#### State Interface

```typescript
interface CartItem {
  variant_id: string;      // Product variant ID (PRIMARY KEY)
  product_id: string;      // Parent product ID
  name: string;            // Product name
  size: string;            // Selected size (e.g., "M")
  color: string;           // Selected color (e.g., "Red")
  sku: string;             // SKU for tracking (e.g., "SAR-M-RED")
  price: number;           // Variant price (may override base price)
  quantity: number;        // Quantity in cart
  image_url?: string;      // Product image
  stock_quantity?: number; // Available stock
}

interface CartState {
  // Data
  items: CartItem[];
  isLoading: boolean;

  // Computed Values (auto-calculated)
  itemCount: number;       // Total items
  subtotal: number;        // Pre-tax total
  vatAmount: number;       // 20% French VAT
  shippingAmount: number;  // €10 flat rate
  total: number;           // Final total

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
  getItemQuantity: (variantId: string) => number;
}
```

#### Business Logic

```typescript
// French market requirements
const VAT_RATE = 0.20;           // 20% TVA
const SHIPPING_FLAT_RATE = 10.0; // €10 flat rate for France

// Total calculation
subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
vatAmount = subtotal * VAT_RATE;
total = subtotal + vatAmount + SHIPPING_FLAT_RATE;
```

#### Usage Examples

```typescript
// 1. Add to Cart
import { useCartStore } from '@/store/cartStore';

export const ProductCard = ({ product, selectedVariant }) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      variant_id: selectedVariant.id,
      product_id: product.id,
      name: product.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      price: selectedVariant.price || product.base_price,
      quantity: 1,
      image_url: product.images[0],
      stock_quantity: selectedVariant.stock_quantity,
    });
  };

  return <Button onPress={handleAddToCart}>Ajouter au panier</Button>;
};

// 2. Cart Badge (Header)
import { useCartStore } from '@/store/cartStore';

export const CartBadge = () => {
  const itemCount = useCartStore((state) => state.itemCount);

  return (
    <View>
      <ShoppingCartIcon />
      {itemCount > 0 && <Badge>{itemCount}</Badge>}
    </View>
  );
};

// 3. Cart Screen
import { useCartStore } from '@/store/cartStore';

export const CartScreen = () => {
  const { items, subtotal, vatAmount, total, removeItem, updateQuantity } = useCartStore();

  return (
    <View>
      {items.map((item) => (
        <CartItem
          key={item.variant_id}
          item={item}
          onRemove={() => removeItem(item.variant_id)}
          onUpdateQuantity={(qty) => updateQuantity(item.variant_id, qty)}
        />
      ))}

      <View>
        <Text>Sous-total: {formatPrice(subtotal)}</Text>
        <Text>TVA (20%): {formatPrice(vatAmount)}</Text>
        <Text>Livraison: {formatPrice(10.0)}</Text>
        <Text>Total: {formatPrice(total)}</Text>
      </View>
    </View>
  );
};

// 4. Checkout Flow
import { useCartStore } from '@/store/cartStore';

export const CheckoutScreen = () => {
  const { items, total, clearCart } = useCartStore();

  const handlePayment = async () => {
    const order = await createOrder({
      items,
      total,
      // ... other order data
    });

    if (order.success) {
      clearCart(); // Clear cart after successful payment
      navigation.navigate('OrderConfirmation');
    }
  };
};

// 5. Persisting Cart on App Start
import { useCartStore } from '@/store/cartStore';

export const App = () => {
  React.useEffect(() => {
    const { loadCart } = useCartStore.getState();
    loadCart(); // Restore cart from MMKV storage
  }, []);
};
```

#### Key Features

- **Variant-based**: Cart items reference `variant_id`, not `product_id`
- **Auto-persistence**: Saves to MMKV on every change
- **Computed totals**: Automatically recalculates subtotal, VAT, total
- **Optimistic updates**: UI updates immediately, no loading states
- **Stock awareness**: Stores `stock_quantity` for validation

---

## Server State - React Query

### Configuration

**Location**: `packages/mobile/App.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes - data fresh time
      gcTime: 10 * 60 * 1000,         // 10 minutes - cache time
      retry: 3,                        // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,                        // Retry mutations once
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* App content */}
    </QueryClientProvider>
  );
}
```

### Services

**Location**: `packages/mobile/src/services/api/`

#### 1. Products Service

**File**: `src/services/api/productsService.ts`

```typescript
import { supabase } from '../supabase';

class ProductsService {
  async getProducts(filters = {}, page = 1, pageSize = 20) {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('active', true)
      // ... apply filters
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    return {
      products: data,
      total: count,
      page,
      pageSize,
    };
  }

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}

export const productsService = new ProductsService();
```

**Usage**:

```typescript
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/api/productsService';

// 1. Fetch all products
export const ProductsScreen = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorView error={error} />;

  return <ProductGrid products={data.products} />;
};

// 2. Fetch products by category
export const CategoryScreen = ({ category }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['products', { category }],
    queryFn: () => productsService.getProducts({ category }),
  });
};

// 3. Fetch single product with cache
export const ProductDetailScreen = ({ productId }) => {
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsService.getProductById(productId),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};
```

#### 2. Variants Service

**File**: `src/services/api/variantsService.ts`

```typescript
class VariantsService {
  async getProductWithVariants(productId: string) {
    const product = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', productId)
      .single();

    return {
      ...product.data,
      variants: product.data.product_variants,
      available_sizes: [...new Set(product.data.product_variants.map(v => v.size))],
      available_colors: [...new Set(product.data.product_variants.map(v => v.color))],
    };
  }
}

export const variantsService = new VariantsService();
```

#### 3. Orders Service

**File**: `src/services/api/ordersService.ts`

```typescript
class OrdersService {
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

export const ordersService = new OrdersService();
```

**Usage**:

```typescript
// Mutation example: Create order
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/api/ordersService';

export const CheckoutScreen = () => {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => ordersService.createOrder(orderData),
    onSuccess: () => {
      // Invalidate orders cache to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleCheckout = async () => {
    try {
      const order = await createOrderMutation.mutateAsync({
        user_id: user.id,
        items: cartItems,
        total: cartTotal,
      });

      navigation.navigate('OrderConfirmation', { orderId: order.id });
    } catch (error) {
      showError(error.message);
    }
  };
};
```

---

## Persistence Layer - MMKV

### Why MMKV?

| Feature | MMKV | AsyncStorage | SecureStore |
|---------|------|--------------|-------------|
| **Speed** | ⚡⚡⚡ Fastest | 🐌 Slow | 🐌 Slow |
| **Synchronous** | ✅ Yes | ❌ No | ❌ No |
| **Encryption** | ⚠️ Optional | ❌ No | ✅ Yes |
| **Size Limit** | ✅ No limit | ⚠️ 6MB | ⚠️ 2KB |
| **Use Case** | Cart, Preferences | Legacy | Sensitive tokens |

### Implementation

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Save
storage.set('cart_items', JSON.stringify(cartItems));

// Load
const cartData = storage.getString('cart_items');
const items = cartData ? JSON.parse(cartData) : [];

// Delete
storage.delete('cart_items');
```

### Current Usage

| Store | Data | Storage |
|-------|------|---------|
| `cartStore` | Cart items | MMKV (`cart_items`) |
| `authStore` | Session tokens | Expo SecureStore (via Supabase) |

---

## Authentication Flow

### Complete Login Flow

```typescript
┌─────────────────────────────────────────────────────────┐
│ 1. User enters email/password in LoginScreen           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. LoginScreen.handleLogin()                            │
│    - Validates email format                             │
│    - Validates password length                          │
│    - Shows loading spinner (2 seconds minimum)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. useAuthStore.signIn(email, password)                 │
│    - Sets isLoading = true                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. authService.signIn({ email, password })              │
│    - Calls Supabase auth.signInWithPassword()           │
│    - Returns { user, session, error }                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Zustand updates state                                │
│    - user: User object                                  │
│    - session: { access_token, refresh_token, ... }      │
│    - isAuthenticated: true                              │
│    - isLoading: false                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. AppNavigator detects isAuthenticated change          │
│    - Subscribes to useAuthStore.isAuthenticated         │
│    - Renders HomeStack instead of AuthStack             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. User sees Home screen                                │
│    - Cart is restored from MMKV                         │
│    - Session is persisted via Supabase                  │
└─────────────────────────────────────────────────────────┘
```

### Code Example

```typescript
// LoginScreen.tsx
const handleLogin = async () => {
  setIsLoading(true);

  // Minimum 2-second loading for UX
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { error } = await signIn(email, password);

  if (error) {
    setIsLoading(false);
    setGeneralError(error);
  } else {
    setIsLoading(false);
    // Navigation handled automatically via isAuthenticated
  }
};

// AppNavigator.tsx
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <HomeStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};
```

---

## Shopping Cart Flow

### Add to Cart Flow

```typescript
┌─────────────────────────────────────────────────────────┐
│ 1. User selects product variant (size, color)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. ProductCard calls addItem()                          │
│    - Passes variant_id, product_id, price, etc.        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. cartStore.addItem(item)                              │
│    - Checks if variant already in cart                  │
│    - If exists: Increment quantity                      │
│    - If new: Add to items array                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Recalculate totals                                   │
│    - subtotal = sum(item.price * item.quantity)         │
│    - vatAmount = subtotal * 0.20                        │
│    - total = subtotal + vatAmount + 10.0                │
│    - itemCount = sum(item.quantity)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Persist to MMKV                                      │
│    - storage.set('cart_items', JSON.stringify(items))   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Update Zustand state                                 │
│    - All components using cartStore re-render           │
│    - Cart badge shows new count                         │
└─────────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. ✅ DO: Selective Subscriptions

```typescript
// ✅ GOOD: Subscribe to specific values
const itemCount = useCartStore((state) => state.itemCount);
const addItem = useCartStore((state) => state.addItem);

// ❌ BAD: Subscribe to entire store
const cartStore = useCartStore(); // Re-renders on ANY change
```

### 2. ✅ DO: Use Query Keys Correctly

```typescript
// ✅ GOOD: Hierarchical query keys
useQuery({
  queryKey: ['products', { category: 'sarees', page: 1 }],
  queryFn: () => productsService.getProducts({ category: 'sarees' }),
});

// ❌ BAD: Generic query keys
useQuery({
  queryKey: ['data'],
  queryFn: () => productsService.getProducts(),
});
```

### 3. ✅ DO: Invalidate Queries After Mutations

```typescript
// ✅ GOOD: Invalidate related queries
const createOrderMutation = useMutation({
  mutationFn: ordersService.createOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['products'] }); // Update stock
  },
});

// ❌ BAD: No invalidation (stale data)
const createOrderMutation = useMutation({
  mutationFn: ordersService.createOrder,
});
```

### 4. ✅ DO: Handle Loading & Error States

```typescript
// ✅ GOOD: Comprehensive error handling
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: productsService.getProducts,
});

if (isLoading) return <Spinner />;
if (error) return <ErrorView error={error} onRetry={refetch} />;

return <ProductGrid products={data.products} />;

// ❌ BAD: No error handling
const { data } = useQuery({ ... });
return <ProductGrid products={data.products} />; // Crashes if error
```

### 5. ✅ DO: Use Optimistic Updates

```typescript
// ✅ GOOD: Optimistic cart update
const addItem = useCartStore((state) => state.addItem);

addItem(item); // Updates UI immediately
// No loading state needed - feels instant
```

---

## Common Patterns

### Pattern 1: Authenticated API Call

```typescript
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

const ProfileScreen = () => {
  const { user, session } = useAuthStore();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return data;
    },
    enabled: !!user, // Only fetch if user exists
  });
};
```

### Pattern 2: Paginated List

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const ProductsScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      productsService.getProducts({}, pageParam, 20),
    getNextPageParam: (lastPage) =>
      lastPage.page < Math.ceil(lastPage.total / 20)
        ? lastPage.page + 1
        : undefined,
  });

  return (
    <FlatList
      data={data?.pages.flatMap(page => page.products)}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
    />
  );
};
```

### Pattern 3: Cart with Stock Validation

```typescript
const ProductCard = ({ product, variant }) => {
  const addItem = useCartStore((state) => state.addItem);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);

  const currentQuantity = getItemQuantity(variant.id);
  const canAddMore = currentQuantity < variant.stock_quantity;

  const handleAddToCart = () => {
    if (!canAddMore) {
      Alert.alert('Stock insuffisant', 'Quantité maximale atteinte');
      return;
    }

    addItem({
      variant_id: variant.id,
      product_id: product.id,
      // ... other fields
      quantity: 1,
      stock_quantity: variant.stock_quantity,
    });
  };
};
```

---

## Troubleshooting

### Issue 1: Cart not persisting after app restart

**Symptom**: Cart is empty when app reopens

**Solution**: Call `loadCart()` on app start

```typescript
// App.tsx or AppNavigator.tsx
React.useEffect(() => {
  const { loadCart } = useCartStore.getState();
  loadCart();
}, []);
```

### Issue 2: Stale data after mutation

**Symptom**: UI doesn't update after creating/updating data

**Solution**: Invalidate queries in mutation's `onSuccess`

```typescript
const mutation = useMutation({
  mutationFn: ordersService.createOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  },
});
```

### Issue 3: Re-renders on every cart change

**Symptom**: Component re-renders too frequently

**Solution**: Use selective subscriptions

```typescript
// ❌ BAD: Re-renders on ANY cart change
const cart = useCartStore();

// ✅ GOOD: Only re-renders when total changes
const total = useCartStore((state) => state.total);
```

### Issue 4: Auth state not syncing

**Symptom**: Navigation doesn't update after login

**Solution**: Ensure `initialize()` is called on app start

```typescript
// App.tsx
React.useEffect(() => {
  const { initialize } = useAuthStore.getState();
  initialize(); // Sets up auth listener
}, []);
```

---

## Summary

### Quick Reference

| State Type | Use | Tool |
|------------|-----|------|
| **Auth Session** | Current user, login status | Zustand (`authStore`) |
| **Shopping Cart** | Cart items, totals | Zustand (`cartStore`) + MMKV |
| **Products List** | Server data, caching | React Query |
| **Orders History** | Server data, mutations | React Query |
| **Form Inputs** | Temporary UI state | `useState` |
| **Modal Visibility** | Temporary UI state | `useState` |

### File Structure

```
packages/mobile/src/
├── store/
│   ├── authStore.ts          # Authentication state
│   └── cartStore.ts           # Shopping cart state
├── services/
│   ├── supabase.ts            # Supabase client
│   ├── auth/
│   │   └── authService.ts     # Auth API calls
│   └── api/
│       ├── productsService.ts # Products API
│       ├── variantsService.ts # Variants API
│       └── ordersService.ts   # Orders API
└── App.tsx                    # QueryClientProvider setup
```

---

**This architecture is production-ready and scales with your business needs!** 🚀

For questions or improvements, refer to the [CLAUDE.md](../../CLAUDE.md) file.
