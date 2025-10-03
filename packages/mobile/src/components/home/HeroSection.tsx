import React from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface HeroSectionProps {
  style?: ViewStyle;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    height: 600, // From Figma: Banner height = 600px
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: UI_CONFIG.COLORS.background.default,
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

  const buttonStyle: ViewStyle = {
    marginTop: 40, // From Figma: Button at y=520
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop',
      }}
      style={containerStyle}
      resizeMode="cover"
    >
      <View style={overlayStyle} />

      <View style={contentStyle}>
        <Text variant="h1" color="text.inverse" style={titleStyle}>
          LUXURY{'\n'}FASHION{'\n'}ACCESSORIES
        </Text>

        <TouchableOpacity style={buttonStyle}>
          <Text variant="body-regular" color="text.inverse" style={{ textAlign: 'center' }}>
            Explore Collection
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
