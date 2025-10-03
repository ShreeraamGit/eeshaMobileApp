# Authentication Architecture

## Overview

Eesha has **two separate applications** with **different authentication requirements**:

1. **Mobile App** (Public Users) - E-commerce customers
2. **Admin Dashboard** (Admin Users) - Store administrators

---

## Current State Analysis

✅ **What exists:**
- Supabase Auth configured
- Mobile auth service (`packages/mobile/src/services/auth/authService.ts`)
- Mobile auth store with Zustand (`packages/mobile/src/store/authStore.ts`)
- Database schema with RLS policies
- Service role policies for admin access

❌ **What's missing:**
- User role differentiation (customer vs admin)
- Admin-specific auth implementation
- Shared auth types in `@eesha/shared`

---

## Architecture Decision

### **Mobile App Authentication**

**Purpose:** Public customer authentication for e-commerce
**Auth Type:** Supabase Auth (anon key)
**User Role:** `customer` (default)
**Access Level:**
- ✅ Read products/variants (public)
- ✅ Create orders (own orders only)
- ✅ View own orders (RLS policy)
- ❌ Cannot modify products/variants
- ❌ Cannot view other users' orders

**Implementation:**
```typescript
// packages/mobile/src/services/auth/authService.ts
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**User Metadata:**
```json
{
  "role": "customer",
  "full_name": "Jane Doe",
  "phone": "+33612345678"
}
```

---

### **Admin Dashboard Authentication**

**Purpose:** Admin users managing products, orders, inventory
**Auth Type:** Supabase Auth (service_role key - **server-side only**)
**User Role:** `admin`
**Access Level:**
- ✅ Full CRUD on products/variants
- ✅ View all orders
- ✅ Update order status
- ✅ Manage inventory
- ✅ View analytics

**Implementation:**
```typescript
// packages/admin/src/lib/supabase-server.ts (Server Components)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// packages/admin/src/lib/supabase-client.ts (Client Components)
const supabase = createClient(SUPABASE_URL, ANON_KEY);
```

**Security:**
- Service role key **NEVER** exposed to client
- Used only in Next.js Server Components/API Routes
- Admin users stored in `auth.users` with `app_metadata.role = 'admin'`

---

## Shared Auth Logic

### **Can we share auth service?**

**Answer:** ❌ **No, but we share types and utilities**

**Why not share the service:**
1. **Different Supabase clients:**
   - Mobile: Uses Expo SecureStore + anon key
   - Admin: Uses Next.js cookies + service_role key (server-side)

2. **Different storage mechanisms:**
   - Mobile: Expo SecureStore
   - Admin: Next.js cookies (via `@supabase/ssr`)

3. **Different permissions:**
   - Mobile: Customer-only operations
   - Admin: Service-role operations

**What we DO share (via `@eesha/shared`):**
- ✅ User role types
- ✅ Auth validation utilities
- ✅ Auth error messages (French)
- ✅ JWT token types

---

## Implementation Plan

### **1. Database: Add User Roles**

Update Supabase to store user roles in `auth.users.app_metadata`:

```sql
-- Function to set user role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Default role is 'customer'
  NEW.raw_app_meta_data = jsonb_set(
    COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"customer"'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to set role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Manually set admin users (run after creating admin account)
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'admin@eesha.com';
```

---

### **2. Shared Package: Add Auth Types**

Create `packages/shared/src/types/auth.ts`:

```typescript
export type UserRole = 'customer' | 'admin' | 'vendor';

export interface UserMetadata {
  full_name?: string;
  phone?: string;
  role?: UserRole;
}

export interface AppMetadata {
  role: UserRole;
  provider?: string;
  providers?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
  created_at: string;
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Identifiants invalides',
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  EMAIL_ALREADY_EXISTS: 'Cette adresse e-mail est déjà utilisée',
  WEAK_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères',
  UNAUTHORIZED: 'Non autorisé',
  ADMIN_ONLY: 'Accès réservé aux administrateurs',
} as const;
```

---

### **3. Mobile App: Update Auth Service**

Update `packages/mobile/src/services/auth/authService.ts`:

```typescript
import { supabase } from '../supabase';
import { UserRole } from '@eesha/shared';

class AuthService {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const { email, password, fullName, phone } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: 'customer', // Default role
        },
      },
    });

    // ... rest of implementation
  }

  async getUserRole(): Promise<UserRole | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.app_metadata?.role || 'customer';
  }
}
```

---

### **4. Admin Dashboard: Create Auth Service**

Create `packages/admin/src/lib/auth/adminAuthService.ts`:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UserRole } from '@eesha/shared';

// Server-side only!
export async function getAdminUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is admin
  const role = user?.app_metadata?.role as UserRole;
  if (role !== 'admin') {
    throw new Error('Unauthorized: Admin access only');
  }

  return user;
}

// Middleware to protect admin routes
export async function requireAdmin() {
  try {
    const user = await getAdminUser();
    return user;
  } catch (error) {
    // Redirect to login
    redirect('/admin/login');
  }
}
```

---

## Summary: Mobile vs Admin Auth

| Feature | Mobile App | Admin Dashboard |
|---------|-----------|-----------------|
| **Auth Provider** | Supabase Auth | Supabase Auth |
| **API Key** | Anon key | Anon key (client) + Service role (server) |
| **Storage** | Expo SecureStore | Next.js Cookies |
| **User Role** | `customer` (default) | `admin` (manual set) |
| **Signup** | ✅ Public signup | ❌ No signup (admin created manually) |
| **Access** | Own orders only | All products/orders |
| **RLS Policies** | Customer-level | Service-role bypass |
| **Shared Code** | Types from `@eesha/shared` | Types from `@eesha/shared` |

---

## Security Checklist

- [ ] Service role key NEVER exposed to client (Next.js server-side only)
- [ ] Mobile app uses anon key only
- [ ] Admin users created manually via SQL
- [ ] RLS policies enforce customer can only see own orders
- [ ] Admin routes protected with `requireAdmin()` middleware
- [ ] JWT tokens validated on every request
- [ ] Passwords min 8 characters, hashed by Supabase

---

## Next Steps

1. ✅ Run user role SQL migration
2. ✅ Create shared auth types in `@eesha/shared`
3. ✅ Update mobile auth service
4. ✅ Create admin auth service
5. ✅ Build login screens (mobile + admin)
6. ✅ Test auth flow end-to-end
