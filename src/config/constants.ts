// Application constants and configuration

export const APP_CONFIG = {
  NAME: 'Eesha Silks',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.EXPO_PUBLIC_APP_ENV || 'development',
} as const;

export const API_CONFIG = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
} as const;

export const BUSINESS_CONFIG = {
  VAT_RATE: 0.20, // 20% French VAT
  SHIPPING_COST: 10.00, // Flat rate for France
  CURRENCY: 'EUR',
  COUNTRY: 'FR',
  DEFAULT_LANGUAGE: 'fr',
} as const;

export const UI_CONFIG = {
  COLORS: {
    // Semantic colors from enhanced design system
    primary: '#14142b',
    secondary: '#dedede',
    accent: '#dd8560', // Updated from Figma - warm coral accent
    attention: '#ff5e00',

    // New accent colors from Figma design
    coral: '#dd8560',     // Primary warm accent
    golden: '#f9a000',    // Highlight color
    vibrantOrange: '#ff5e00', // Secondary accent
    saleRed: '#ed0006',   // Strong call-to-action

    // Text colors
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
      disabled: '#A0A0A0',
      inverse: '#FFFFFF',
      link: '#0066CC',
      price: '#FF4444',
      sale: '#00AA00',
    },

    // Background colors
    background: {
      default: '#FFFFFF',
      secondary: '#F8F8F8',
      tertiary: '#F0F0F0',
      inverse: '#1A1A1A',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Border colors
    border: {
      light: '#E5E5E5',
      default: '#D0D0D0',
      dark: '#999999',
    },

    // Feedback colors
    feedback: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      neutral: '#6B7280',
    },

    // E-commerce specific colors - updated with Figma colors
    ecommerce: {
      sale: '#ed0006',        // Strong red from Figma
      newArrival: '#f9a000',  // Golden yellow from Figma
      outOfStock: '#979797',  // Gray from Figma
      inStock: '#00AA00',
      limitedStock: '#ff5e00', // Orange from Figma
      exclusive: '#6d6dbb',    // Purple from Figma
      trending: '#dd8560',     // Coral from Figma
      wishlist: '#FF1493',
      cart: '#dd8560',        // Updated to coral
      checkout: '#00AA00',
    },
  },

  // Updated spacing scale - includes Figma-specific values alongside 8px grid
  SPACING: {
    0: 0,
    1: 8,     // base unit
    2: 16,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
    7: 56,
    8: 64,
    9: 72,
    10: 80,
    11: 88,
    12: 96,
    14: 112,
    16: 128,
    20: 160,
    24: 192,
    28: 224,
    32: 256,
    px: 1,
    0.5: 4,
    1.5: 12,
    2.5: 20,
    3.5: 28,

    // Additional Figma-specific spacing values
    figma: {
      2: 2,    // Figma specific
      3: 3,    // Figma specific
      4: 4,    // Figma specific
      6: 6,    // Figma specific
      10: 10,  // Figma specific
      11: 11,  // Figma specific
      13: 13,  // Figma specific
      25: 25,  // Figma specific
      30: 30,  // Figma specific
      33: 33,  // Figma specific
      93: 93,  // Figma specific
      103: 103, // Figma specific
      125: 125, // Figma specific
    },
  },

  // Component specific spacing
  COMPONENT_SPACING: {
    button: { x: 24, y: 12 },
    input: { x: 16, y: 12 },
    card: { padding: 16, gap: 12 },
    badge: { x: 8, y: 4 },
    chip: { x: 12, y: 6 },
    listItem: 12,
    section: 48,
    component: 16,
  },

  // Layout spacing for responsive design
  LAYOUT_SPACING: {
    page: {
      mobile: 16,
      tablet: 32,
      desktop: 48,
      wide: 64,
    },
    section: {
      mobile: 32,
      tablet: 48,
      desktop: 64,
    },
    grid: {
      mobile: 16,
      tablet: 24,
      desktop: 32,
    },
  },

  // Border radius scale
  BORDER_RADIUS: {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    full: 9999,
    pill: 9999,
  },

  // Component specific border radius
  COMPONENT_RADIUS: {
    button: 8,
    buttonRounded: 24,
    input: 8,
    card: 12,
    cardImage: 12,
    badge: 4,
    chip: 16,
    modal: 16,
    dropdown: 8,
    tooltip: 4,
    avatar: 9999,
    thumbnail: 8,
    productImage: 8,
  },

  // Typography system from design system - updated with Figma fonts
  TYPOGRAPHY: {
    fonts: {
      primary: 'Tenor Sans',   // Updated from Figma - main UI font
      secondary: 'Poppins',    // Secondary font for buttons/labels
      display: 'Agne',        // Large display text (hero sections)
      body: 'Manrope',        // Alternative body text
      modern: 'Neurial Grotesk', // Modern accent font
      mono: 'SF Mono, Consolas, monospace',
    },

    sizes: {
      '2xs': 10,
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
      '6xl': 60,
      '7xl': 72,
      '8xl': 96,
      '9xl': 128,
    },

    weights: {
      thin: 100,
      extralight: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Shadows and elevation
  SHADOWS: {
    elevation: {
      0: 'none',
      1: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      2: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      3: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      4: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      5: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      6: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },

    semantic: {
      card: '0 2px 4px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      cardHover: '0 8px 16px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
      productCard: '0 2px 8px rgba(0, 0, 0, 0.08)',
      productCardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
      dropdown: '0 4px 12px rgba(0, 0, 0, 0.15)',
      modal: '0 20px 40px rgba(0, 0, 0, 0.2)',
      button: '0 2px 4px rgba(0, 0, 0, 0.1)',
      buttonHover: '0 4px 8px rgba(0, 0, 0, 0.15)',
      inputFocus: '0 0 0 3px rgba(66, 153, 225, 0.1)',
      stickyNav: '0 2px 4px rgba(0, 0, 0, 0.06)',
    },
  },

  // Breakpoints for responsive design
  BREAKPOINTS: {
    xs: { min: 0, max: 479, container: '100%', columns: 4, margin: 16, gutter: 16 },
    sm: { min: 480, max: 767, container: '100%', columns: 6, margin: 20, gutter: 20 },
    md: { min: 768, max: 1023, container: 720, columns: 8, margin: 32, gutter: 24 },
    lg: { min: 1024, max: 1279, container: 960, columns: 12, margin: 48, gutter: 32 },
    xl: { min: 1280, max: 1535, container: 1200, columns: 12, margin: 64, gutter: 32 },
    '2xl': { min: 1536, max: null, container: 1400, columns: 12, margin: 80, gutter: 40 },
  },

  // Animation system
  ANIMATIONS: {
    durations: {
      instant: 0,
      fast: 150,
      normal: 250,
      slow: 350,
      slower: 500,
      slowest: 1000,
    },

    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
} as const;

export const TRACKING_STATUSES = {
  order_placed: 'Commande reçue',
  payment_confirmed: 'Paiement confirmé',
  preparing: 'En préparation',
  shipped: 'Expédiée',
  out_for_delivery: 'En cours de livraison',
  delivered: 'Livrée',
} as const;

export const ORDER_STATUSES = {
  pending: 'En attente',
  processing: 'En traitement',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  refunded: 'Remboursée',
} as const;

export const PAYMENT_STATUSES = {
  pending: 'En attente',
  paid: 'Payé',
  failed: 'Échoué',
  refunded: 'Remboursé',
  partially_refunded: 'Partiellement remboursé',
} as const;

export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: 'user_profile',
  CART: 'cart',
  ORDERS: 'orders',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  CART_ITEMS: 'cart_items',
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

export const FEATURE_FLAGS = {
  MULTI_VENDOR: process.env.EXPO_PUBLIC_ENABLE_MULTI_VENDOR === 'true',
  ADVANCED_SEARCH: process.env.EXPO_PUBLIC_ENABLE_ADVANCED_SEARCH === 'true',
  PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^(\+33|0)[1-9](\d{8})$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  POSTAL_CODE_REGEX: /^\d{5}$/,
} as const;

export const PERFORMANCE_CONFIG = {
  PRODUCT_LIST_INITIAL_RENDER: 10,
  PRODUCT_LIST_WINDOW_SIZE: 5,
  CACHE_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  API_TIMEOUT: 10000, // 10 seconds
} as const;

// E-commerce specific design system configurations
export const ECOMMERCE_CONFIG = {
  product: {
    card: {
      width: { mobile: '100%', desktop: 280 },
      imageRatio: '3:4',
      padding: 12,
      gap: 8,
      borderRadius: 12,
      shadow: UI_CONFIG.SHADOWS.semantic.productCard,
    },
    grid: {
      columns: { mobile: 2, tablet: 3, desktop: 4 },
      gap: { mobile: 16, tablet: 24, desktop: 32 },
    },
    image: {
      aspectRatio: '3:4',
      borderRadius: 8,
      placeholder: '#F0F0F0',
    },
    badge: {
      position: { top: 8, right: 8 },
      padding: { x: 8, y: 4 },
      fontSize: 11,
      borderRadius: 4,
    },
    price: {
      regular: { fontSize: 18, fontWeight: 600, color: UI_CONFIG.COLORS.text.primary },
      sale: { fontSize: 16, fontWeight: 400, color: '#999999', textDecoration: 'line-through' },
      discount: { fontSize: 14, fontWeight: 700, color: UI_CONFIG.COLORS.ecommerce.sale },
    },
    rating: {
      starSize: 16,
      activeColor: '#FFD700',
      inactiveColor: '#E0E0E0',
    },
  },
  cart: {
    itemHeight: 120,
    thumbnailSize: 80,
    quantityInput: { width: 80, height: 36 },
    summary: { padding: 24, gap: 16, borderTop: '1px solid #E5E5E5' },
  },
  checkout: {
    steps: {
      height: 60,
      activeColor: UI_CONFIG.COLORS.primary,
      inactiveColor: '#999999',
      completedColor: UI_CONFIG.COLORS.feedback.success,
    },
    form: { gap: 24, sectionGap: 32 },
    payment: { methodHeight: 60, iconSize: 32 },
  },
  filters: {
    sidebar: { width: 280, padding: 24, gap: 24 },
    chip: { padding: { x: 12, y: 6 }, gap: 8, borderRadius: 16 },
    priceRange: { sliderHeight: 4, handleSize: 20 },
  },
  badges: {
    types: {
      sale: { background: UI_CONFIG.COLORS.ecommerce.sale, color: '#FFFFFF', text: 'SALE' },
      new: { background: UI_CONFIG.COLORS.ecommerce.newArrival, color: '#FFFFFF', text: 'NEW' },
      bestseller: { background: '#FFD700', color: '#1A1A1A', text: 'BESTSELLER' },
      limited: { background: UI_CONFIG.COLORS.ecommerce.limitedStock, color: '#FFFFFF', text: 'LIMITED' },
      exclusive: { background: UI_CONFIG.COLORS.ecommerce.exclusive, color: '#FFFFFF', text: 'EXCLUSIVE' },
      outOfStock: { background: UI_CONFIG.COLORS.ecommerce.outOfStock, color: '#FFFFFF', text: 'OUT OF STOCK' },
    },
  },
  navigation: {
    megaMenu: { columns: 4, imageWidth: 240, padding: 32 },
    breadcrumb: { separator: '/', fontSize: 14, gap: 8 },
  },
  search: {
    bar: { height: 48, borderRadius: 24, iconSize: 20 },
    suggestions: { maxHeight: 400, itemHeight: 48 },
  },
} as const;

// Component design system tokens
export const COMPONENT_CONFIG = {
  buttons: {
    sizes: {
      small: { height: 32, paddingX: 16, fontSize: 14 },
      medium: { height: 40, paddingX: 24, fontSize: 16 },
      large: { height: 48, paddingX: 32, fontSize: 18 },
    },
    variants: {
      primary: {
        background: UI_CONFIG.COLORS.primary,
        color: '#FFFFFF',
        hover: { opacity: 0.9 },
      },
      secondary: {
        background: 'transparent',
        color: UI_CONFIG.COLORS.primary,
        border: `1px solid ${UI_CONFIG.COLORS.primary}`,
        hover: { background: 'rgba(0,0,0,0.05)' },
      },
      ghost: {
        background: 'transparent',
        color: UI_CONFIG.COLORS.primary,
        hover: { background: 'rgba(0,0,0,0.05)' },
      },
      danger: {
        background: UI_CONFIG.COLORS.feedback.error,
        color: '#FFFFFF',
      },
    },
  },
  inputs: {
    default: {
      height: 48,
      padding: 16,
      borderRadius: UI_CONFIG.COMPONENT_RADIUS.input,
      border: `1px solid ${UI_CONFIG.COLORS.border.light}`,
      fontSize: 16,
      focus: {
        borderColor: UI_CONFIG.COLORS.primary,
        shadow: UI_CONFIG.SHADOWS.semantic.inputFocus,
      },
    },
  },
  cards: {
    default: {
      padding: 24,
      borderRadius: UI_CONFIG.COMPONENT_RADIUS.card,
      background: UI_CONFIG.COLORS.background.default,
      shadow: UI_CONFIG.SHADOWS.semantic.card,
    },
  },
} as const;

// Text styles from the design system - mapped to React Native compatible format
export const TEXT_STYLES = {
  'display-large': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display, // Use Agne for large displays
    fontSize: 96,
    fontWeight: '700',
    lineHeight: 96,
    letterSpacing: -0.96,
  },
  'display-medium': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display,
    fontSize: 72,
    fontWeight: '700',
    lineHeight: 72,
    letterSpacing: -0.72,
  },
  'display-small': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display,
    fontSize: 60,
    fontWeight: '600',
    lineHeight: 66,
    letterSpacing: -0.6,
  },
  h1: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display, // Large headings use Agne
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 58,
    letterSpacing: -0.48,
  },
  h2: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display,
    fontSize: 36,
    fontWeight: '600',
    lineHeight: 45,
    letterSpacing: -0.18,
  },
  h3: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 39,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32.4,
    letterSpacing: 0,
  },
  h5: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 28,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26.1,
    letterSpacing: 0,
  },
  'body-large': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28.8,
    letterSpacing: 0,
  },
  'body-regular': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'body-small': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0,
  },
  'price-large': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.32,
  },
  'price-regular': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
  },
  'price-small': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0,
  },
  'price-sale': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0,
    textDecorationLine: 'line-through',
  },
  'product-title': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 23.4,
    letterSpacing: 0,
  },
  'product-description': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0,
  },
  'button-large': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.36,
  },
  'button-regular': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.32,
  },
  'button-small': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.28,
  },
  label: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14.4,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: 0.3,
  },
  overline: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16.5,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  badge: {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 11,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  'category-title': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28.6,
    letterSpacing: -0.11,
  },
  'search-placeholder': {
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0,
  },
} as const;