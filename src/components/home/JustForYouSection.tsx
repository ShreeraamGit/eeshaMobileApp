import React from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface JustForYouSectionProps {
  style?: ViewStyle;
}

export const JustForYouSection: React.FC<JustForYouSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    paddingVertical: UI_CONFIG.SPACING[4], // 32px
    backgroundColor: UI_CONFIG.COLORS.background.default, // Consistent background
    ...style,
  };

  const headerStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING[4], // 32px
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
  };

  const productGridStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
  };

  const productItemStyle: ViewStyle = {
    width: '48%',
    alignItems: 'center',
  };

  const productImageStyle: ImageStyle = {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: UI_CONFIG.SPACING[1], // 8px
  };

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <Text
          variant="h2"
          color="text.primary"
          style={{
            letterSpacing: 1,
            marginBottom: UI_CONFIG.SPACING[1], // 8px
          }}
        >
          JUST FOR YOU
        </Text>
      </View>

      <View style={productGridStyle}>
        <TouchableOpacity style={productItemStyle}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop' }}
            style={productImageStyle}
            resizeMode="cover"
          />
          <Text variant="product-title" color="text.primary" style={{ textAlign: 'center', marginBottom: 4 }}>
            Harris Tweed Three button Jacket
          </Text>
          <Text variant="price-regular" color="text.secondary">
            $120
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={productItemStyle}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop' }}
            style={productImageStyle}
            resizeMode="cover"
          />
          <Text variant="product-title" color="text.primary" style={{ textAlign: 'center', marginBottom: 4 }}>
            Cashmere Tank + Bag
          </Text>
          <Text variant="price-regular" color="text.secondary">
            $120
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};