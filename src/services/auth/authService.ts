import { supabase } from '../supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

class AuthService {
  /**
   * Register a new user
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { email, password, fullName, phone } = data;

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
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
}

export const authService = new AuthService();
