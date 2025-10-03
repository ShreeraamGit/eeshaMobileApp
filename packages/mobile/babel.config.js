module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/store': './src/store',
            '@/config': './src/config',
          },
        },
      ],
      // Temporarily commented out to fix bundling issues
      // 'react-native-reanimated/plugin',
    ],
  };
};