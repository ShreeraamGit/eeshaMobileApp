'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { UserRole, AUTH_ERRORS } from '@eesha/shared';

/**
 * Server Action: Sign in admin user
 */
export async function signInAdminAction(email: string, password: string) {
  try {
    console.log('🔐 [AdminAction] Starting sign in for:', email);

    const cookieStore = await cookies();

    const supabase = createServerClient(
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
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('🔐 [AdminAction] Supabase auth response:', {
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      hasError: !!error,
      errorMessage: error?.message,
    });

    if (error) {
      console.error('🔐 [AdminAction] Auth error:', error.message);
      return { success: false, error: error.message };
    }

    // Log user metadata
    console.log('🔐 [AdminAction] User metadata:', {
      userId: data.user.id,
      email: data.user.email,
      app_metadata: data.user.app_metadata,
      user_metadata: data.user.user_metadata,
    });

    // Verify user is admin
    const role = (data.user.app_metadata?.role as UserRole) || 'customer';
    console.log('🔐 [AdminAction] User role:', role);

    if (role !== 'admin') {
      console.error('🔐 [AdminAction] User is not admin, role:', role);
      // Sign out non-admin user
      await supabase.auth.signOut();
      return { success: false, error: AUTH_ERRORS.ADMIN_ONLY };
    }

    console.log('🔐 [AdminAction] Admin verified, login successful');
    return { success: true };
  } catch (error: any) {
    console.error('🔐 [AdminAction] SignIn error:', error);
    return { success: false, error: error.message || AUTH_ERRORS.UNKNOWN_ERROR };
  }
}
