import React from 'react';
import { View, ImageBackground, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';
import { getScaledFontSize } from '@/utils/responsive';

interface HeroSectionProps {
  style?: ViewStyle;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    height: 465,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: UI_CONFIG.COLORS.background.default, // Consistent background
    ...style,
  };

  const overlayStyle: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(221, 133, 96, 0.5)', // #dd8560 with 50% opacity from Figma
  };

  const contentStyle: ViewStyle = {
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING[4], // 32px
    zIndex: 1,
  };

  const titleStyle: TextStyle = {
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING[3], // 24px
  };

  const subtitleStyle: TextStyle = {
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING[6], // 48px
    paddingHorizontal: UI_CONFIG.SPACING[2], // 16px
  };

  const featuresStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: UI_CONFIG.SPACING[4], // 32px
  };

  const featureItemStyle: ViewStyle = {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: UI_CONFIG.SPACING[1], // 8px
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop' }}
      style={containerStyle}
      resizeMode="cover"
    >
      <View style={overlayStyle} />

      <View style={contentStyle}>
        <Text
          variant="h1"
          color="text.inverse"
          style={titleStyle}
        >
          LUXURY{'\n'}FASHION{'\n'}ACCESSORIES
        </Text>

        <Text
          variant="body-large"
          color="text.inverse"
          style={subtitleStyle}
        >
          Making a luxurious lifestyle accessible for a generous group of women is our daily drive.
        </Text>

        {/* Feature highlights */}
        <View style={featuresStyle}>
          <View style={featureItemStyle}>
            <Text variant="caption" color="text.inverse" style={{ textAlign: 'center' }}>
              Fast shipping.{'\n'}Free on orders over $25.
            </Text>
          </View>

          <View style={featureItemStyle}>
            <Text variant="caption" color="text.inverse" style={{ textAlign: 'center' }}>
              Sustainable process{'\n'}from start to finish.
            </Text>
          </View>

          <View style={featureItemStyle}>
            <Text variant="caption" color="text.inverse" style={{ textAlign: 'center' }}>
              Unique designs{'\n'}and high-quality materials.
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};