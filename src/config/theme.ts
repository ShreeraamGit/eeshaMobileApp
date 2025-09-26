import { UI_CONFIG, ECOMMERCE_CONFIG, COMPONENT_CONFIG, TEXT_STYLES } from './constants';

// Create a unified theme object that combines all design system tokens
export const theme = {
  // Colors
  colors: UI_CONFIG.COLORS,

  // Spacing
  spacing: UI_CONFIG.SPACING,
  componentSpacing: UI_CONFIG.COMPONENT_SPACING,
  layoutSpacing: UI_CONFIG.LAYOUT_SPACING,

  // Typography
  typography: UI_CONFIG.TYPOGRAPHY,
  textStyles: TEXT_STYLES,

  // Border radius
  borderRadius: UI_CONFIG.BORDER_RADIUS,
  componentRadius: UI_CONFIG.COMPONENT_RADIUS,

  // Shadows
  shadows: UI_CONFIG.SHADOWS,

  // Breakpoints
  breakpoints: UI_CONFIG.BREAKPOINTS,

  // Animations
  animations: UI_CONFIG.ANIMATIONS,

  // E-commerce specific
  ecommerce: ECOMMERCE_CONFIG,

  // Components
  components: COMPONENT_CONFIG,
} as const;

// Type for the theme
export type Theme = typeof theme;

// Helper functions for accessing theme values
export const getSpacing = (value: keyof typeof UI_CONFIG.SPACING) => UI_CONFIG.SPACING[value];
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = UI_CONFIG.COLORS;
  for (const key of keys) {
    value = value?.[key];
  }
  return value;
};

export const getTextStyle = (style: keyof typeof TEXT_STYLES) => TEXT_STYLES[style];
export const getShadow = (type: 'elevation' | 'semantic', key: string) => {
  return UI_CONFIG.SHADOWS[type][key as keyof typeof UI_CONFIG.SHADOWS[typeof type]];
};

export const getComponentConfig = (component: keyof typeof COMPONENT_CONFIG, property?: string) => {
  const config = COMPONENT_CONFIG[component];
  return property ? config[property as keyof typeof config] : config;
};

export const getEcommerceConfig = (section: keyof typeof ECOMMERCE_CONFIG, property?: string) => {
  const config = ECOMMERCE_CONFIG[section];
  return property ? config[property as keyof typeof config] : config;
};

// Responsive breakpoint helpers
export const getBreakpoint = (size: keyof typeof UI_CONFIG.BREAKPOINTS) => UI_CONFIG.BREAKPOINTS[size];

// Animation helpers
export const getDuration = (speed: keyof typeof UI_CONFIG.ANIMATIONS.durations) =>
  UI_CONFIG.ANIMATIONS.durations[speed];

export const getEasing = (type: keyof typeof UI_CONFIG.ANIMATIONS.easings) =>
  UI_CONFIG.ANIMATIONS.easings[type];

// Default export
export default theme;