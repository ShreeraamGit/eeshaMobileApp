const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.assetExts.push('db');

// Enable TypeScript support
config.resolver.sourceExts.push('ts', 'tsx');

// Add alias support for absolute imports
config.resolver.alias = {
  '@': './src',
  '@/components': './src/components',
  '@/screens': './src/screens',
  '@/services': './src/services',
  '@/utils': './src/utils',
  '@/types': './src/types',
  '@/hooks': './src/hooks',
  '@/store': './src/store',
  '@/config': './src/config',
};

module.exports = withNativeWind(config, { input: './global.css' });