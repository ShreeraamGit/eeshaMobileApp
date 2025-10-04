import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '@/services/auth/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setSession: (session) => set({ session }),

  setLoading: (loading) => set({ isLoading: loading }),

  signIn: async (email, password) => {
    try {
      set({ isLoading: true });

      const { user, session, error } = await authService.signIn({ email, password });

      if (error) {
        console.error('[AuthStore] SignIn failed:', error.message);
        set({ isLoading: false });
        return { error: error.message };
      }

      set({
        user,
        session,
        isAuthenticated: true,
        isLoading: false
      });

      return { error: null };
    } catch (error) {
      console.error('[AuthStore] SignIn error:', error);
      set({ isLoading: false });
      return { error: 'An unexpected error occurred' };
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      set({ isLoading: true });

      const { user, session, error } = await authService.signUp({
        email,
        password,
        fullName,
      });

      if (error) {
        set({ isLoading: false });
        return { error: error.message };
      }

      set({
        user,
        session,
        isAuthenticated: true,
        isLoading: false
      });

      return { error: null };
    } catch (error) {
      set({ isLoading: false });
      return { error: 'An unexpected error occurred' };
    }
  },

  signInWithGoogle: async () => {
    try {
      console.log('[AuthStore] signInWithGoogle: Starting...');
      set({ isLoading: true });

      const { error } = await authService.signInWithGoogle();

      if (error) {
        console.error('[AuthStore] signInWithGoogle: Error returned:', error.message);
        set({ isLoading: false });
        return { error: error.message };
      }

      console.log('[AuthStore] signInWithGoogle: OAuth initiated, waiting for callback...');
      // OAuth flow will open browser
      // Session will be handled by onAuthStateChange listener
      // Keep loading state until auth state changes
      return { error: null };
    } catch (error) {
      console.error('[AuthStore] signInWithGoogle: Caught exception:', error);
      set({ isLoading: false });
      return { error: 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });

      await authService.signOut();

      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      console.error('SignOut error:', error);
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Get current session
      const session = await authService.getSession();

      if (session) {
        const user = await authService.getCurrentUser();
        set({
          user,
          session,
          isAuthenticated: !!user,
          isLoading: false
        });
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        });
      }

      // Listen to auth changes
      authService.onAuthStateChange((session) => {
        console.log('[AuthStore] Auth state changed, session exists:', !!session);

        if (session) {
          console.log('[AuthStore] Fetching user details...');
          authService.getCurrentUser().then((user) => {
            console.log('[AuthStore] User fetched:', user?.email);
            set({ user, session, isAuthenticated: true });
          });
        } else {
          console.log('[AuthStore] No session, setting user to null');
          set({ user: null, session: null, isAuthenticated: false });
        }
      });
    } catch (error) {
      console.error('[AuthStore] Initialize error:', error);
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },
}));
