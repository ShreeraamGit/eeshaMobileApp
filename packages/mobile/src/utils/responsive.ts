import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling (iPhone 12/13/14 standard)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale font size based on screen width
 * Ensures consistent typography across different device sizes
 */
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  // Ensure minimum readable size and maximum size constraints
  const minSize = size * 0.85; // Don't go below 85% of original
  const maxSize = size * 1.15; // Don't go above 115% of original

  return Math.max(minSize, Math.min(maxSize, newSize));
};

/**
 * Scale spacing/padding based on screen width
 */
export const scaleSpacing = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size * scale;
};

/**
 * Get responsive font size based on device type
 */
export const getResponsiveFontSize = (baseSize: number) => {
  // Small phones (iPhone SE, etc.)
  if (SCREEN_WIDTH < 375) {
    return baseSize * 0.9;
  }
  // Large phones (iPhone Plus, Pro Max, etc.)
  else if (SCREEN_WIDTH > 414) {
    return baseSize * 1.1;
  }
  // Standard phones
  return baseSize;
};

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;

  return (adjustedWidth >= 1000 || adjustedHeight >= 1000);
};

/**
 * Get device size category
 */
export const getDeviceSize = (): 'small' | 'medium' | 'large' | 'tablet' => {
  if (isTablet()) return 'tablet';
  if (SCREEN_WIDTH < 375) return 'small';
  if (SCREEN_WIDTH > 414) return 'large';
  return 'medium';
};

/**
 * Responsive typography multipliers
 */
export const TYPOGRAPHY_SCALE = {
  small: 0.9,   // iPhone SE, mini devices
  medium: 1.0,  // iPhone 12/13/14 standard
  large: 1.1,   // iPhone Plus/Pro Max
  tablet: 1.2,  // iPad and tablets
};

/**
 * Get scaled font size for current device
 */
export const getScaledFontSize = (baseSize: number): number => {
  const deviceSize = getDeviceSize();
  const scale = TYPOGRAPHY_SCALE[deviceSize];
  return Math.round(baseSize * scale);
};