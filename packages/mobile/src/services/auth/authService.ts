import { supabase } from '../supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import {
  SignUpData,
  SignInData,
  UserRole,
  validateEmail,
  validatePassword,
  AUTH_ERRORS,
} from '@eesha/shared';

// Warm up the browser for faster OAuth
WebBrowser.maybeCompleteAuthSession();

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Register a new user (customer role)
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, phone } = data;

      // Validate email
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return {
          user: null,
          session: null,
          error: { message: emailValidation.error || AUTH_ERRORS.INVALID_EMAIL, name: 'ValidationError' } as AuthError,
        };
      }

      // Validate password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return {
          user: null,
          session: null,
          error: { message: passwordValidation.error || AUTH_ERRORS.WEAK_PASSWORD, name: 'ValidationError' } as AuthError,
        };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('SignUp error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { email, password } = data;

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('SignIn error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('GetSession error:', error);
        return null;
      }
      return data.session;
    } catch (error) {
      console.error('GetSession error:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('GetCurrentUser error:', error);
        return null;
      }
      return data.user;
    } catch (error) {
      console.error('GetCurrentUser error:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'eeshaapp://reset-password',
      });
      return { error };
    } catch (error) {
      console.error('ResetPassword error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      console.error('UpdatePassword error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    fullName?: string;
    phone?: string;
  }): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          phone: data.phone,
        },
      });
      return { error };
    } catch (error) {
      console.error('UpdateProfile error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Sign in with Google OAuth
   * Automatically creates account if user doesn't exist
   */
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      console.log('[AuthService] signInWithGoogle: Starting Google OAuth flow...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'eeshaapp://auth/callback',
          skipBrowserRedirect: true, // We'll handle the redirect manually
        },
      });

      if (error) {
        console.error('[AuthService] signInWithGoogle: OAuth error:', error);
        return { user: null, session: null, error };
      }

      if (!data?.url) {
        console.error('[AuthService] signInWithGoogle: No OAuth URL returned');
        return {
          user: null,
          session: null,
          error: { message: 'No OAuth URL returned', name: 'OAuthError' } as AuthError,
        };
      }

      console.log('[AuthService] signInWithGoogle: OAuth URL:', data.url);
      console.log('[AuthService] signInWithGoogle: Opening browser...');

      // Open OAuth URL in browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        'eeshaapp://auth/callback'
      );

      console.log('[AuthService] signInWithGoogle: Browser result:', result.type);

      if (result.type === 'success' && result.url) {
        console.log('[AuthService] signInWithGoogle: OAuth callback received:', result.url);
        // Supabase SDK will automatically handle the callback URL via deep linking
      } else if (result.type === 'cancel') {
        console.log('[AuthService] signInWithGoogle: User cancelled OAuth');
        return {
          user: null,
          session: null,
          error: { message: 'Authentification annulée', name: 'UserCancelled' } as AuthError,
        };
      }

      // Session will be handled by onAuthStateChange
      return {
        user: null,
        session: null,
        error: null,
      };
    } catch (error) {
      console.error('[AuthService] signInWithGoogle: Caught exception:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthService] onAuthStateChange: Event:', event);
      console.log('[AuthService] onAuthStateChange: Session exists:', !!session);

      if (session) {
        console.log('[AuthService] onAuthStateChange: User ID:', session.user?.id);
        console.log('[AuthService] onAuthStateChange: User email:', session.user?.email);
        console.log('[AuthService] onAuthStateChange: Provider:', session.user?.app_metadata?.provider);
      }

      callback(session);
    });
  }

  /**
   * Get user role from metadata
   */
  async getUserRole(): Promise<UserRole> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return (user?.app_metadata?.role as UserRole) || 'customer';
    } catch (error) {
      console.error('GetUserRole error:', error);
      return 'customer';
    }
  }

  /**
   * Check if current user is admin
   */
  async isAdmin(): Promise<boolean> {
    const role = await this.getUserRole();
    return role === 'admin';
  }
}

export const authService = new AuthService();
