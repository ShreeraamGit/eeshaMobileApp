import React from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle, ScrollView } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface JustForYouSectionProps {
  style?: ViewStyle;
}

export const JustForYouSection: React.FC<JustForYouSectionProps> = ({ style }) => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Harris Tweed Three button Jacket',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    },
    {
      id: '2',
      name: 'Cashmere Tank + Bag',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'
    },
    {
      id: '3',
      name: 'Reversible Angora Cardigan',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop'
    },
    {
      id: '4',
      name: 'Wool Blend Cardigan',
      price: '$90',
      image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=500&fit=crop'
    },
  ];

  const containerStyle: ViewStyle = {
    paddingTop: 32, // Add top spacing from previous section
    paddingBottom: 48, // Add bottom spacing before next section
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const headerStyle: ViewStyle = {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 24, // Spacing below title
    paddingHorizontal: 16,
  };

  const productItemStyle: ViewStyle = {
    width: 255, // Fixed width from Figma design
    marginRight: UI_CONFIG.SPACING[2], // 16px
    alignItems: 'center',
  };

  const productImageStyle: ImageStyle = {
    width: 255,
    height: 320,
    borderRadius: 0,
    marginBottom: UI_CONFIG.SPACING[1], // 8px
  };

  const indicatorContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16, // Spacing below products
    marginBottom: 0,
  };

  const dotStyle: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_CONFIG.COLORS.border.default,
    marginHorizontal: 4,
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: UI_CONFIG.SPACING[3] }}
      >
        {products.map((product) => (
          <TouchableOpacity key={product.id} style={productItemStyle}>
            <Image
              source={{ uri: product.image }}
              style={productImageStyle}
              resizeMode="cover"
            />
            <Text variant="body-small" color="text.primary" style={{ textAlign: 'center', marginBottom: 4, fontSize: 12 }}>
              {product.name}
            </Text>
            <Text variant="body-regular" color="text.secondary" style={{ fontSize: 14 }}>
              {product.price}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={indicatorContainerStyle}>
        <View style={[dotStyle, { backgroundColor: UI_CONFIG.COLORS.text.primary }]} />
        <View style={dotStyle} />
        <View style={dotStyle} />
        <View style={dotStyle} />
      </View>
    </View>
  );
};