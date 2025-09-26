import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface BrandLogosSectionProps {
  style?: ViewStyle;
}

export const BrandLogosSection: React.FC<BrandLogosSectionProps> = ({ style }) => {
  const brands = ['PRADA', 'BULGARI', 'BOSS', 'Cartier', 'GUCCI', 'TIFFANY&CO'];

  const containerStyle: ViewStyle = {
    paddingVertical: UI_CONFIG.SPACING[4], // 32px
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
    backgroundColor: UI_CONFIG.COLORS.background.default, // Consistent background
    ...style,
  };

  const brandsGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const brandItemStyle: ViewStyle = {
    width: '30%',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING[2], // 16px
  };

  return (
    <View style={containerStyle}>
      <View style={brandsGridStyle}>
        {brands.map((brand, index) => (
          <View key={index} style={brandItemStyle}>
            <Text
              variant="caption"
              color="text.secondary"
              style={{
                fontWeight: '600',
                letterSpacing: 1,
                textAlign: 'center'
              }}
            >
              {brand}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};