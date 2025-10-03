import React from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle } from 'react-native';
import { Card } from '@/components/common/Card';
import { Text, ProductTitle, PriceText } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { UI_CONFIG, ECOMMERCE_CONFIG } from '@/config/constants';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  style?: ViewStyle;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  style,
}) => {
  const cartConfig = ECOMMERCE_CONFIG.cart;

  const containerStyle: ViewStyle = {
    height: cartConfig.itemHeight,
    flexDirection: 'row',
    padding: UI_CONFIG.SPACING[2], // 16px
    gap: UI_CONFIG.SPACING[2], // 16px
    ...style,
  };

  const imageStyle: ImageStyle = {
    width: cartConfig.thumbnailSize,
    height: cartConfig.thumbnailSize,
    borderRadius: UI_CONFIG.COMPONENT_RADIUS.thumbnail,
    backgroundColor: ECOMMERCE_CONFIG.product.image.placeholder,
    resizeMode: 'cover',
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'space-between',
    gap: UI_CONFIG.SPACING[1], // 8px
  };

  const quantityContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_CONFIG.SPACING[2], // 16px
    marginTop: UI_CONFIG.SPACING[1], // 8px
  };

  const quantityButtonStyle: ViewStyle = {
    width: 32,
    height: 32,
    borderRadius: UI_CONFIG.BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: UI_CONFIG.COLORS.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: UI_CONFIG.COLORS.background.default,
  };

  const quantityDisplayStyle: ViewStyle = {
    minWidth: 40,
    alignItems: 'center',
  };

  const priceContainerStyle: ViewStyle = {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  };

  const totalPrice = item.price * item.quantity;

  return (
    <Card style={containerStyle} shadow={false}>
      {/* Product Image */}
      <Image
        source={{ uri: item.image_url || ECOMMERCE_CONFIG.product.image.placeholder }}
        style={imageStyle}
      />

      {/* Product Details */}
      <View style={contentStyle}>
        <View>
          <ProductTitle numberOfLines={2} ellipsizeMode="tail">
            {item.product_name}
          </ProductTitle>

          <Text variant="caption" color="text.secondary">
            Taille: {item.size} • Couleur: {item.color}
          </Text>
        </View>

        {/* Quantity Controls */}
        <View style={quantityContainerStyle}>
          <TouchableOpacity
            style={quantityButtonStyle}
            onPress={() => onUpdateQuantity(item.variant_id, Math.max(0, item.quantity - 1))}
          >
            <Text variant="body-regular">−</Text>
          </TouchableOpacity>

          <View style={quantityDisplayStyle}>
            <Text variant="body-regular">{item.quantity}</Text>
          </View>

          <TouchableOpacity
            style={quantityButtonStyle}
            onPress={() => onUpdateQuantity(item.variant_id, item.quantity + 1)}
          >
            <Text variant="body-regular">+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onRemove(item.variant_id)}
            style={{ marginLeft: 'auto' }}
          >
            <Text variant="caption" color="feedback.error">
              Supprimer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Price Section */}
      <View style={priceContainerStyle}>
        <PriceText size="regular">
          €{totalPrice.toFixed(2)}
        </PriceText>

        {item.quantity > 1 && (
          <Text variant="caption" color="text.secondary">
            €{item.price.toFixed(2)} chacun
          </Text>
        )}
      </View>
    </Card>
  );
};