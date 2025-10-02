import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface BrandLogosSectionProps {
  style?: ViewStyle;
}

export const BrandLogosSection: React.FC<BrandLogosSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    paddingVertical: 0, // No vertical padding
    paddingHorizontal: 0,
    backgroundColor: UI_CONFIG.COLORS.background.default,
    alignItems: 'center',
    height: 180, // From Figma: Brand section height = 180px
    justifyContent: 'center',
    ...style,
  };

  const dividerStyle: ViewStyle = {
    height: 1,
    width: 125, // From Figma: Divider width = 124.96px ≈ 125px
    backgroundColor: UI_CONFIG.COLORS.border.default,
    marginVertical: 0,
  };

  const brandRowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20, // Spacing between brand rows
  };

  return (
    <View style={containerStyle}>
      {/* Top divider */}
      <View style={dividerStyle} />

      {/* First row: Cartier, Gucci, Tiffany & Co */}
      <View style={brandRowStyle}>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          Cartier
        </Text>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          GUCCI
        </Text>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          Tiffany & Co
        </Text>
      </View>

      {/* Second row: Prada, Burberry, Boss */}
      <View style={brandRowStyle}>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          PRADA
        </Text>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          Burberry
        </Text>
        <Text variant="body-regular" color="text.primary" style={{ letterSpacing: 1 }}>
          BOSS
        </Text>
      </View>

      {/* Bottom divider */}
      <View style={dividerStyle} />
    </View>
  );
};
