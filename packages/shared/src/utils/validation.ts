/**
 * Shared Validation Utilities
 * Used across mobile and admin for consistent validation
 */

import { VALIDATION_RULES } from '../config/constants';

export const validation = {
  /**
   * Validate email address
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= VALIDATION_RULES.MIN_PASSWORD_LENGTH;
  },

  /**
   * Validate French postal code (5 digits)
   */
  isValidPostalCode: (postalCode: string): boolean => {
    return VALIDATION_RULES.POSTAL_CODE_REGEX.test(postalCode);
  },

  /**
   * Validate French phone number
   */
  isValidPhone: (phone: string): boolean => {
    return VALIDATION_RULES.PHONE_REGEX.test(phone);
  },

  /**
   * Validate price
   */
  isValidPrice: (price: number): boolean => {
    return (
      price >= VALIDATION_RULES.MIN_PRICE &&
      price <= VALIDATION_RULES.MAX_PRICE
    );
  },

  /**
   * Validate stock quantity
   */
  isValidStock: (stock: number): boolean => {
    return stock >= 0 && Number.isInteger(stock);
  },

  /**
   * Validate SKU format
   */
  isValidSKU: (sku: string): boolean => {
    const skuRegex = /^[A-Z0-9-]+$/;
    return sku.length >= 3 && sku.length <= 50 && skuRegex.test(sku);
  },
};
