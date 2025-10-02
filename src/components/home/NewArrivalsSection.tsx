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
    paddingHorizontal: 16, // From Figma: Products start at x=16
    paddingTop: 32, // Add spacing from Hero section
    paddingBottom: 40, // Add spacing before next section
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const headerStyle: ViewStyle = {
    alignItems: 'center',
    marginTop: 8, // From Figma: Title at y=8
    marginBottom: 49, // From Figma: Products at y=113, Tabs at y=64, gap = 113-64 = 49px
  };

  const gridContainerStyle: ViewStyle = {
    alignItems: 'center',
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12, // From Figma: Row 1 products at y=113, Row 2 at y=385, gap = 385-113-260 = 12px
  };

  const productItemStyle: ViewStyle = {
    width: 165, // Fixed width from Figma: Product at x=16, width=165; Product at x=194, width=165
  };

  const productImageStyle: ImageStyle = {
    width: 165,
    height: 200,
    borderRadius: 0, // No border radius in design
    marginBottom: UI_CONFIG.SPACING[1], // 8px
  };

  const productInfoStyle: ViewStyle = {
    alignItems: 'center',
  };


  const viewMoreStyle: ViewStyle = {
    alignItems: 'center',
    marginTop: 12, // From Figma: Button at y=673, last product ends around y=645 (385+260)
    marginBottom: 0,
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity key={product.id} style={productItemStyle}>
      <Image
        source={{ uri: product.image }}
        style={productImageStyle}
        resizeMode="cover"
      />
      <View style={productInfoStyle}>
        <Text variant="body-small" color="text.primary" style={{ textAlign: 'center', marginBottom: 4, fontSize: 12 }}>
          {product.name}
        </Text>
        <Text variant="body-regular" color="text.secondary" style={{ fontSize: 14 }}>
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

      <View style={gridContainerStyle}>
        {/* First Row: Products 1 & 2 */}
        <View style={rowStyle}>
          {renderProduct(products[0])}
          {renderProduct(products[1])}
        </View>

        {/* Second Row: Products 3 & 4 */}
        <View style={rowStyle}>
          {renderProduct(products[2])}
          {renderProduct(products[3])}
        </View>
      </View>

      <TouchableOpacity style={viewMoreStyle}>
        <Text variant="button-regular" color="text.primary">
          Explore More →
        </Text>
      </TouchableOpacity>
    </View>
  );
};