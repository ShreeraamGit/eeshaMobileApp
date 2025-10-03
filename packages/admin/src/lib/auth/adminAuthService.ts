/**
 * Admin Authentication Service (Server-side)
 * Uses Supabase with Next.js Server Components/Actions
 *
 * IMPORTANT: This file contains server-side auth logic only.
 * Never use service_role key on the client side.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole, AUTH_ERRORS } from '@eesha/shared';
import type { User } from '@supabase/supabase-js';

/**
 * Create Supabase server client for Server Components/Actions
 * Uses cookies for session management
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookies) => {
          try {
            cookies.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Cookie setting can fail in Server Components
            // This is expected behavior
          }
        },
      },
    }
  );
}

/**
 * Get current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Get user role from app_metadata
 */
export async function getUserRole(user: User): Promise<UserRole> {
  return (user.app_metadata?.role as UserRole) || 'customer';
}

/**
 * Check if user is admin
 */
export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  const role = await getUserRole(user);
  return role === 'admin';
}

/**
 * Get admin user or throw error
 * Use this in protected admin routes
 */
export async function getAdminUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error(AUTH_ERRORS.UNAUTHORIZED);
  }

  const userIsAdmin = await isAdmin(user);
  if (!userIsAdmin) {
    throw new Error(AUTH_ERRORS.ADMIN_ONLY);
  }

  return user;
}

/**
 * Require admin authentication middleware
 * Redirects to login if not authenticated or not admin
 *
 * Usage in Server Components:
 * ```tsx
 * export default async function AdminPage() {
 *   const user = await requireAdmin(); // Redirects if not admin
 *   return <div>Admin content</div>;
 * }
 * ```
 */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    console.log('[AdminAuth] No user found, redirecting to login');
    redirect('/admin/login');
  }

  const userIsAdmin = await isAdmin(user);
  if (!userIsAdmin) {
    console.log('[AdminAuth] User is not admin, redirecting to login');
    redirect('/admin/login');
  }

  console.log('[AdminAuth] Admin access granted:', user.email);
  return user;
}

/**
 * Sign in admin user
 * Returns user or error
 */
export async function signInAdmin(email: string, password: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  // Verify user is admin
  const role = await getUserRole(data.user);
  if (role !== 'admin') {
    // Sign out non-admin user
    await supabase.auth.signOut();
    return { user: null, error: AUTH_ERRORS.ADMIN_ONLY };
  }

  return { user: data.user, error: null };
}

/**
 * Sign out admin user
 */
export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

/**
 * Get Supabase session
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
