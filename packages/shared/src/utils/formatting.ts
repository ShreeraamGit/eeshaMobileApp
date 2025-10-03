/**
 * Shared Formatting Utilities
 * Consistent formatting across mobile and admin
 */

import { APP_CONFIG } from '../config/constants';

export const formatting = {
  /**
   * Format price in EUR
   */
  formatPrice: (amount: number): string => {
    return new Intl.NumberFormat(APP_CONFIG.LOCALE, {
      style: 'currency',
      currency: APP_CONFIG.CURRENCY,
    }).format(amount);
  },

  /**
   * Format date
   */
  formatDate: (date: string | Date): string => {
    return new Intl.DateTimeFormat(APP_CONFIG.LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  },

  /**
   * Format date and time
   */
  formatDateTime: (date: string | Date): string => {
    return new Intl.DateTimeFormat(APP_CONFIG.LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },

  /**
   * Format phone number
   */
  formatPhone: (phone: string): string => {
    // Format: +33 6 12 34 56 78
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('33')) {
      return `+33 ${cleaned.slice(2, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(
        5,
        7
      )} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
    }
    return phone;
  },

  /**
   * Format postal code
   */
  formatPostalCode: (postalCode: string): string => {
    return postalCode.replace(/\D/g, '').slice(0, 5);
  },

  /**
   * Calculate VAT amount
   */
  calculateVAT: (amount: number): number => {
    return Math.round(amount * APP_CONFIG.VAT_RATE * 100) / 100;
  },

  /**
   * Calculate order total
   */
  calculateOrderTotal: (
    subtotal: number,
    includeShipping = true
  ): {
    subtotal: number;
    vat: number;
    shipping: number;
    total: number;
  } => {
    const vat = formatting.calculateVAT(subtotal);
    const shipping = includeShipping ? APP_CONFIG.SHIPPING_COST : 0;
    const total = subtotal + vat + shipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      shipping,
      total: Math.round(total * 100) / 100,
    };
  },

  /**
   * Truncate text
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
  },

  /**
   * Format SKU for display
   */
  formatSKU: (sku: string): string => {
    return sku.toUpperCase();
  },
};
