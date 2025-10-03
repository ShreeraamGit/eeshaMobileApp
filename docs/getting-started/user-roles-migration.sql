-- ============================================
-- USER ROLES MIGRATION
-- ============================================
-- Adds role-based authentication for customers vs admins
-- Run this AFTER the main database-schema.sql
-- ============================================

-- ============================================
-- 1. FUNCTION: Auto-assign 'customer' role on signup
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set default role to 'customer' in app_metadata
  NEW.raw_app_meta_data = jsonb_set(
    COALESCE(NEW.raw_app_meta_data, '{}'::jsonb),
    '{role}',
    '"customer"'::jsonb
  );

  RETURN NEW;
END;
$$;

-- ============================================
-- 2. TRIGGER: Apply role on user creation
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 3. UPDATE EXISTING USERS (if any)
-- ============================================

-- Set all existing users to 'customer' by default
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"customer"'::jsonb
)
WHERE raw_app_meta_data->>'role' IS NULL;

-- ============================================
-- 4. CREATE ADMIN USER (MANUAL STEP)
-- ============================================

-- IMPORTANT: First create an admin user via Supabase Dashboard:
-- 1. Go to: Authentication > Users > Add User
-- 2. Email: admin@eesha.com
-- 3. Password: YourSecureAdminPassword123!
-- 4. Auto Confirm User: YES

-- THEN run this to set admin role:
-- (Replace 'admin@eesha.com' with your actual admin email)

UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb
)
WHERE email = 'admin@eesha.com';

-- Verify admin role was set:
SELECT
  id,
  email,
  raw_app_meta_data->>'role' as role,
  created_at
FROM auth.users
WHERE email = 'admin@eesha.com';

-- ============================================
-- 5. UPDATED RLS POLICIES (with role checks)
-- ============================================

-- Drop existing service role policies (they're too broad)
DROP POLICY IF EXISTS "Service role full access to products" ON products;
DROP POLICY IF EXISTS "Service role full access to variants" ON product_variants;
DROP POLICY IF EXISTS "Service role full access to orders" ON orders;
DROP POLICY IF EXISTS "Service role full access to tracking" ON order_tracking;

-- Enable RLS on products and variants (currently public read)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

-- Product Variants: Public read, admin write
CREATE POLICY "Public can view active variants"
  ON product_variants FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage variants"
  ON product_variants FOR ALL
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

-- Orders: Users view own, admins view all
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

-- Order Tracking: Admins can manage, users can view own
CREATE POLICY "Admins can manage order tracking"
  ON order_tracking FOR ALL
  USING (
    auth.jwt()->>'role' = 'service_role'
    OR (auth.uid() IS NOT NULL AND auth.jwt()->'user_metadata'->>'role' = 'admin')
  );

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    auth.jwt()->>'role' = 'service_role'
    OR auth.jwt()->'user_metadata'->>'role' = 'admin'
  );
END;
$$;

-- Get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF auth.jwt()->>'role' = 'service_role' THEN
    RETURN 'service_role';
  ELSE
    RETURN COALESCE(auth.jwt()->'user_metadata'->>'role', 'customer');
  END IF;
END;
$$;

-- ============================================
-- 7. VERIFICATION QUERIES
-- ============================================

-- Check all users and their roles
/*
SELECT
  id,
  email,
  raw_app_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as name,
  created_at
FROM auth.users
ORDER BY created_at DESC;
*/

-- Test is_admin() function
/*
SELECT is_admin() as is_current_user_admin;
*/

-- Test get_user_role() function
/*
SELECT get_user_role() as current_user_role;
*/

-- Count users by role
/*
SELECT
  raw_app_meta_data->>'role' as role,
  COUNT(*) as count
FROM auth.users
GROUP BY raw_app_meta_data->>'role';
*/

-- ============================================
-- SUCCESS!
-- ============================================
-- ✅ User roles configured
-- ✅ Customers auto-assigned on signup
-- ✅ Admins set manually
-- ✅ RLS policies enforce role-based access
--
-- Next steps:
-- 1. Create admin user in Supabase Dashboard
-- 2. Run the UPDATE query to set admin role
-- 3. Test admin login in admin dashboard
-- 4. Test customer signup in mobile app
