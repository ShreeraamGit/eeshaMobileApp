import React from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface NewArrivalsSectionProps {
  style?: ViewStyle;
}

export const NewArrivalsSection: React.FC<NewArrivalsSectionProps> = ({ style }) => {
  // Sample products based on the Figma design
  const products: Product[] = [
    {
      id: '1',
      name: 'Reversible Angora Cardigan',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop'
    },
    {
      id: '2',
      name: 'Cashmere Turtleneck',
      price: '$180',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
    },
    {
      id: '3',
      name: 'Wool Blend Cardigan',
      price: '$90',
      image: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=500&fit=crop'
    },
    {
      id: '4',
      name: 'Tailored Blazer',
      price: '$220',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop'
    },
  ];

  const containerStyle: ViewStyle = {
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
    paddingVertical: UI_CONFIG.SPACING[5], // 40px
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const headerStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  };

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  const productItemStyle: ViewStyle = {
    width: '48%',
    marginBottom: UI_CONFIG.SPACING[3], // 24px
  };

  const productImageStyle: ImageStyle = {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: UI_CONFIG.SPACING[1], // 8px
  };

  const productInfoStyle: ViewStyle = {
    alignItems: 'center',
  };


  const viewMoreStyle: ViewStyle = {
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING[3], // 24px
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity key={product.id} style={productItemStyle}>
      <Image
        source={{ uri: product.image }}
        style={productImageStyle}
        resizeMode="cover"
      />
      <View style={productInfoStyle}>
        <Text variant="product-title" color="text.primary" style={{ textAlign: 'center', marginBottom: 4 }}>
          {product.name}
        </Text>
        <Text variant="price-regular" color="text.secondary">
          {product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={containerStyle}>
      <View style={headerStyle}>
        <Text variant="h2" color="text.primary" style={{ marginBottom: 8 }}>
          NEW ARRIVAL
        </Text>

        {/* Category navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: UI_CONFIG.SPACING[3] }}>
          <Text variant="body-regular" color="text.primary" style={{ fontWeight: '600' }}>All</Text>
          <Text variant="body-regular" color="text.secondary">Apparel</Text>
          <Text variant="body-regular" color="text.secondary">Dress</Text>
          <Text variant="body-regular" color="text.secondary">Tshirt</Text>
          <Text variant="body-regular" color="text.secondary">Bag</Text>
        </View>
      </View>

      <View style={gridStyle}>
        {products.map(renderProduct)}
      </View>

      <TouchableOpacity style={viewMoreStyle}>
        <Text variant="button-regular" color="text.primary">
          Explore More →
        </Text>
      </TouchableOpacity>
    </View>
  );
};