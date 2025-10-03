'use server';

import { signOutAdmin } from '@/lib/auth/adminAuthService';
import { redirect } from 'next/navigation';

/**
 * Server Action: Sign out admin user
 */
export async function signOutAdminAction() {
  try {
    await signOutAdmin();
    redirect('/admin/login');
  } catch (error) {
    console.error('[AdminAction] SignOut error:', error);
    // Still redirect to login even if signout fails
    redirect('/admin/login');
  }
}
