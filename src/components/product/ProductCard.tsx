import React from 'react';
import { View, Image, TouchableOpacity, ViewStyle, ImageStyle } from 'react-native';
import { Card } from '@/components/common/Card';
import { Text, ProductTitle, PriceText, SalePriceText } from '@/components/common/Text';
import { Badge } from '@/components/common/Badge';
import { UI_CONFIG, ECOMMERCE_CONFIG } from '@/config/constants';
import { Product, ProductVariant } from '@/types';

interface ProductCardProps {
  product: Product;
  selectedVariant?: ProductVariant;
  onPress: (product: Product) => void;
  style?: ViewStyle;
  showBadges?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedVariant,
  onPress,
  style,
  showBadges = true,
}) => {
  const cardConfig = ECOMMERCE_CONFIG.product.card;
  const imageConfig = ECOMMERCE_CONFIG.product.image;
  const priceConfig = ECOMMERCE_CONFIG.product.price;

  // Use selected variant or first available variant
  const variant = selectedVariant || product.variants[0];
  const displayPrice = variant?.price || product.base_price;
  const isOnSale = product.compare_at_price && product.compare_at_price > displayPrice;
  const discountPercentage = isOnSale
    ? Math.round(((product.compare_at_price! - displayPrice) / product.compare_at_price!) * 100)
    : 0;

  const cardStyle: ViewStyle = {
    padding: cardConfig.padding,
    ...style,
  };

  const imageContainerStyle: ViewStyle = {
    aspectRatio: 3 / 4, // 3:4 ratio from design system
    borderRadius: imageConfig.borderRadius,
    backgroundColor: imageConfig.placeholder,
    marginBottom: cardConfig.gap,
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  };

  const badgeContainerStyle: ViewStyle = {
    position: 'absolute',
    top: ECOMMERCE_CONFIG.product.badge.position.top,
    right: ECOMMERCE_CONFIG.product.badge.position.right,
    zIndex: 1,
    gap: UI_CONFIG.SPACING[1], // 8px
  };

  const priceContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_CONFIG.SPACING[1], // 8px
    marginTop: UI_CONFIG.SPACING[0.5], // 4px
  };

  const getBadgeType = () => {
    if (variant && variant.stock_quantity === 0) return 'outOfStock';
    if (isOnSale) return 'sale';
    if (product.status === 'active' && product.created_at) {
      const createdDate = new Date(product.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (createdDate > thirtyDaysAgo) return 'new';
    }
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <TouchableOpacity onPress={() => onPress(product)} activeOpacity={0.8}>
      <Card style={cardStyle} shadow>
        {/* Product Image */}
        <View style={imageContainerStyle}>
          <Image
            source={{ uri: product.images[0] || imageConfig.placeholder }}
            style={imageStyle}
          />

          {/* Badges */}
          {showBadges && badgeType && (
            <View style={badgeContainerStyle}>
              <Badge type={badgeType} />
              {isOnSale && discountPercentage > 0 && (
                <Badge
                  type="sale"
                  text={`-${discountPercentage}%`}
                />
              )}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={{ gap: UI_CONFIG.SPACING[0.5] }}>
          {/* Product Title */}
          <ProductTitle numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </ProductTitle>

          {/* Category */}
          {product.category && (
            <Text variant="caption" color="text.secondary">
              {product.category.toUpperCase()}
            </Text>
          )}

          {/* Price */}
          <View style={priceContainerStyle}>
            <PriceText size="small">
              €{displayPrice.toFixed(2)}
            </PriceText>

            {isOnSale && product.compare_at_price && (
              <SalePriceText>
                €{product.compare_at_price.toFixed(2)}
              </SalePriceText>
            )}
          </View>

          {/* Stock Info */}
          {variant && variant.stock_quantity <= 5 && variant.stock_quantity > 0 && (
            <Text variant="caption" color="ecommerce.limitedStock">
              Seulement {variant.stock_quantity} en stock
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};