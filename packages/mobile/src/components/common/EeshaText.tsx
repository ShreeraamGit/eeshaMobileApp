import React from 'react';
import { Text } from '@/components/ui/gluestack-ui-provider/text';
import { UI_CONFIG, TEXT_STYLES } from '@/config/constants';

export type EeshaTextVariant =
  | 'display-large'
  | 'display-medium'
  | 'display-small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-large'
  | 'body-regular'
  | 'body-small'
  | 'price-large'
  | 'price-regular'
  | 'price-small'
  | 'price-sale'
  | 'product-title'
  | 'product-description'
  | 'button-large'
  | 'button-regular'
  | 'button-small'
  | 'label'
  | 'caption'
  | 'overline'
  | 'badge'
  | 'category-title';

export type EeshaTextColor = 'primary' | 'secondary' | 'disabled' | 'inverse' | 'link' | 'price' | 'sale' | 'coral' | 'golden';

interface EeshaTextProps {
  children: React.ReactNode;
  variant?: EeshaTextVariant;
  color?: EeshaTextColor;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const EeshaText: React.FC<EeshaTextProps> = ({
  children,
  variant = 'body-regular',
  color = 'primary',
  align = 'left',
  className = '',
}) => {
  // Color mapping to your design system
  const colorStyles = {
    primary: UI_CONFIG.COLORS.text.primary,
    secondary: UI_CONFIG.COLORS.text.secondary,
    disabled: UI_CONFIG.COLORS.text.disabled,
    inverse: UI_CONFIG.COLORS.text.inverse,
    link: UI_CONFIG.COLORS.text.link,
    price: UI_CONFIG.COLORS.text.price,
    sale: UI_CONFIG.COLORS.text.sale,
    coral: UI_CONFIG.COLORS.coral,
    golden: UI_CONFIG.COLORS.golden,
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const textStyle = TEXT_STYLES[variant];

  return (
    <Text
      className={`${alignStyles[align]} ${className}`}
      style={{
        fontFamily: textStyle.fontFamily,
        fontSize: textStyle.fontSize,
        fontWeight: textStyle.fontWeight,
        lineHeight: textStyle.lineHeight,
        letterSpacing: textStyle.letterSpacing,
        color: colorStyles[color],
        ...(variant.includes('price-sale') && { textDecorationLine: 'line-through' }),
        ...(variant === 'label' || variant === 'overline' || variant === 'badge'
          ? { textTransform: 'uppercase' }
          : {}),
      }}
    >
      {children}
    </Text>
  );
};
