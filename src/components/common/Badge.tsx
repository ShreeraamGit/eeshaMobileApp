import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from './Text';
import { UI_CONFIG, ECOMMERCE_CONFIG } from '@/config/constants';

type BadgeType = keyof typeof ECOMMERCE_CONFIG.badges.types;

interface BadgeProps {
  type: BadgeType;
  text?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, style }) => {
  const badgeConfig = ECOMMERCE_CONFIG.badges.types[type];
  const productBadgeConfig = ECOMMERCE_CONFIG.product.badge;

  // Safety check for invalid badge types
  if (!badgeConfig) {
    console.warn(`Invalid badge type: ${type}. Available types:`, Object.keys(ECOMMERCE_CONFIG.badges.types));
    return null;
  }

  const badgeStyle: ViewStyle = {
    backgroundColor: badgeConfig.background,
    paddingHorizontal: productBadgeConfig.padding.x,
    paddingVertical: productBadgeConfig.padding.y,
    borderRadius: productBadgeConfig.borderRadius,
    alignSelf: 'flex-start',
    ...style,
  };

  return (
    <View style={badgeStyle}>
      <Text variant="badge" color={badgeConfig.color}>
        {text || badgeConfig.text}
      </Text>
    </View>
  );
};

// Convenience components for specific badge types
export const SaleBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="sale" {...props} />
);

export const NewBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="new" {...props} />
);

export const BestsellerBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="bestseller" {...props} />
);

export const LimitedBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="limited" {...props} />
);

export const ExclusiveBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="exclusive" {...props} />
);

export const OutOfStockBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="outOfStock" {...props} />
);