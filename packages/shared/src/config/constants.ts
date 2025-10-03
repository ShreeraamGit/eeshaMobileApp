/**
 * Shared Constants
 * Configuration values used across mobile and admin
 */

export const APP_CONFIG = {
  VAT_RATE: 0.2, // 20% French VAT
  SHIPPING_COST: 10, // €10 flat rate shipping
  CURRENCY: 'EUR',
  CURRENCY_SYMBOL: '€',
  LOCALE: 'fr-FR',
  RESERVATION_DURATION_MINUTES: 30, // Cart reservation time
} as const;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  VENDOR: 'vendor',
} as const;

export const PRODUCT_CATEGORIES = [
  'Sarees',
  'Kurtis',
  'Lehengas',
  'Salwar Kameez',
  'Dupattas',
  'Accessories',
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] as const;

export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PRICE: 0.01,
  MAX_PRICE: 100000,
  POSTAL_CODE_REGEX: /^[0-9]{5}$/, // French postal code
  PHONE_REGEX: /^(\+33|0)[1-9](\d{2}){4}$/, // French phone
} as const;

/**
 * API Endpoints (if using custom API)
 */
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
  AUTH: '/api/auth',
  STRIPE: '/api/stripe',
} as const;

/**
 * Storage Keys (for local storage)
 */
export const STORAGE_KEYS = {
  CART: '@eesha/cart',
  USER: '@eesha/user',
  AUTH_TOKEN: '@eesha/auth_token',
  PREFERENCES: '@eesha/preferences',
} as const;

/**
 * Error Messages (French)
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  AUTH_REQUIRED: 'Vous devez être connecté pour effectuer cette action.',
  INSUFFICIENT_STOCK: 'Stock insuffisant pour cette variante.',
  PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',
  INVALID_EMAIL: 'Adresse e-mail invalide.',
  INVALID_PASSWORD: 'Le mot de passe doit contenir au moins 8 caractères.',
  INVALID_POSTAL_CODE: 'Code postal invalide (5 chiffres requis).',
  INVALID_PHONE: 'Numéro de téléphone invalide.',
} as const;
