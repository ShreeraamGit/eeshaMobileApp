/**
 * Shared Authentication Types
 * Used by both mobile app and admin dashboard
 */

/**
 * User roles in the system
 */
export type UserRole = 'customer' | 'admin' | 'vendor';

/**
 * User metadata stored in auth.users.user_metadata
 */
export interface UserMetadata {
  full_name?: string;
  phone?: string;
}

/**
 * App metadata stored in auth.users.app_metadata (system-controlled)
 */
export interface AppMetadata {
  role: UserRole;
  provider?: string;
  providers?: string[];
}

/**
 * Extended user type with metadata
 */
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * Sign up data
 */
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

/**
 * Sign in data
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * Auth response
 */
export interface AuthResponse<T = any> {
  data: T | null;
  error: AuthError | null;
}

/**
 * Auth error
 */
export interface AuthError {
  message: string;
  code?: string;
}

/**
 * Auth error messages (French)
 */
export const AUTH_ERRORS = {
  // Login errors
  INVALID_CREDENTIALS: 'Identifiants invalides',
  USER_NOT_FOUND: 'Utilisateur non trouvé',
  INVALID_EMAIL: 'Adresse e-mail invalide',

  // Signup errors
  EMAIL_ALREADY_EXISTS: 'Cette adresse e-mail est déjà utilisée',
  WEAK_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères',

  // Authorization errors
  UNAUTHORIZED: 'Non autorisé',
  ADMIN_ONLY: 'Accès réservé aux administrateurs',
  SESSION_EXPIRED: 'Votre session a expiré',

  // General errors
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite',
} as const;

/**
 * Auth session status
 */
export type AuthSessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  status: AuthSessionStatus;
  role: UserRole | null;
}

/**
 * Type guards
 */
export const isCustomer = (role: UserRole | null): boolean => role === 'customer';
export const isAdmin = (role: UserRole | null): boolean => role === 'admin';
export const isVendor = (role: UserRole | null): boolean => role === 'vendor';

/**
 * Password validation
 */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: AUTH_ERRORS.WEAK_PASSWORD,
    };
  }

  return { valid: true };
};

/**
 * Email validation
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      error: AUTH_ERRORS.INVALID_EMAIL,
    };
  }

  return { valid: true };
};
