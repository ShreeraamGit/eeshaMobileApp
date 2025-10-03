# Authentication Setup Guide

## ✅ What's Complete

1. **Auth architecture documented** → `docs/infrastructure/AUTH_ARCHITECTURE.md`
2. **Database user roles migration** → `docs/getting-started/user-roles-migration.sql`
3. **Shared auth types** → `packages/shared/src/types/auth.ts`
4. **Mobile auth service** → Updated with validation
5. **Admin auth service** → `packages/admin/src/lib/auth/adminAuthService.ts`

---

## 🎯 Next Steps (Do These Now)

### Step 1: Run Database Migration

Open your Supabase SQL Editor and run:

```bash
docs/getting-started/user-roles-migration.sql
```

This will:
- ✅ Auto-assign `customer` role to new signups
- ✅ Enable role-based RLS policies
- ✅ Add helper functions (`is_admin()`, `get_user_role()`)

### Step 2: Create Admin User

**Method A: Via Supabase Dashboard**
1. Go to: Authentication → Users → Add User
2. Email: `admin@eesha.com`
3. Password: `YourSecurePassword123!`
4. Auto Confirm User: ✅ YES

**Method B: Via SQL (after signup)**
```sql
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'admin@eesha.com';
```

### Step 3: Verify Setup

Run these queries in Supabase SQL Editor:

```sql
-- Check all users and roles
SELECT
  id,
  email,
  raw_app_meta_data->>'role' as role,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Test role functions
SELECT get_user_role() as my_role;
SELECT is_admin() as am_i_admin;
```

---

## 📱 Mobile App Auth Flow

### How it works:
1. User signs up → Auto-assigned `customer` role
2. Can view products (public)
3. Can create and view **own** orders only
4. Cannot modify products/inventory

### Usage:
```typescript
import { authService } from '@/services/auth/authService';

// Sign up (customer role auto-assigned)
const { error } = await authService.signUp({
  email: 'customer@example.com',
  password: 'SecurePass123',
  fullName: 'Jane Doe',
});

// Check user role
const role = await authService.getUserRole(); // 'customer'
```

---

## 🔐 Admin Dashboard Auth Flow

### How it works:
1. Admin logs in via Next.js admin panel
2. Server validates user has `admin` role
3. Full access to products, orders, inventory

### Usage (Server Component):
```typescript
import { requireAdmin } from '@/lib/auth/adminAuthService';

export default async function AdminProductsPage() {
  // Redirects to /admin/login if not admin
  const user = await requireAdmin();

  return <div>Admin products page</div>;
}
```

### Usage (Server Action):
```typescript
'use server';
import { getAdminUser } from '@/lib/auth/adminAuthService';

export async function updateProduct(formData: FormData) {
  const user = await getAdminUser(); // Throws if not admin
  // ... update product logic
}
```

---

## 🔒 Security Notes

### Mobile App:
- ✅ Uses `EXPO_PUBLIC_SUPABASE_ANON_KEY` (public, safe)
- ✅ RLS policies enforce customer-only access
- ✅ Tokens stored in Expo SecureStore (encrypted)

### Admin Dashboard:
- ⚠️ **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client
- ✅ Service role only in Server Components/Actions
- ✅ Admin routes protected with `requireAdmin()`
- ✅ Session stored in Next.js cookies (httpOnly)

---

## 📋 File Structure

```
packages/
├── shared/
│   └── src/
│       └── types/
│           └── auth.ts           # ✅ Shared types
├── mobile/
│   └── src/
│       ├── services/
│       │   └── auth/
│       │       └── authService.ts # ✅ Updated with validation
│       └── store/
│           └── authStore.ts       # Uses authService
└── admin/
    └── src/
        └── lib/
            ├── auth/
            │   └── adminAuthService.ts  # ✅ Admin-only auth
            └── supabase/
                ├── server.ts      # ✅ Server Components
                └── client.ts      # ✅ Client Components
```

---

## 🚀 Ready to Build Auth Screens?

Once you've completed Steps 1-3 above, you can proceed to build:

1. **Mobile screens:**
   - LoginScreen
   - RegisterScreen
   - (Uses `authService` and `useAuthStore`)

2. **Admin screens:**
   - Admin login page (`/admin/login`)
   - Protected admin layout
   - (Uses `requireAdmin()` middleware)

---

## 🆘 Troubleshooting

**Q: Users can't sign up?**
- Check if `on_auth_user_created` trigger is active
- Verify Supabase email confirmations are disabled (for testing)

**Q: Admin can't access dashboard?**
- Verify user has `role: 'admin'` in `app_metadata`
- Check admin login redirects to `/admin/login`

**Q: RLS policies blocking access?**
- Run verification queries to check user roles
- Test with Supabase SQL Editor as authenticated user

**Q: Shared package import errors?**
- Run: `npm install` from root
- Verify `@eesha/shared` is in package.json dependencies
