import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { TEXT_STYLES, UI_CONFIG } from '@/config/constants';

type TextVariant = keyof typeof TEXT_STYLES;
type ColorPath = string;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: ColorPath;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body-regular',
  color,
  style,
  children,
  ...props
}) => {
  const getColorFromPath = (path: string): string => {
    const keys = path.split('.');
    let value: any = UI_CONFIG.COLORS;
    for (const key of keys) {
      value = value?.[key];
      if (!value) break;
    }
    return value || UI_CONFIG.COLORS.text.primary;
  };

  const textStyle: TextStyle = {
    ...TEXT_STYLES[variant],
    ...(color && { color: getColorFromPath(color) }),
    ...(typeof style === 'object' ? style : {}),
  };

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

// Convenience components for common text variants
export const Heading1: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

export const Heading5: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h5" {...props} />
);

export const Heading6: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="h6" {...props} />
);

export const BodyText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-regular" {...props} />
);

export const BodyLarge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-large" {...props} />
);

export const BodySmall: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="body-small" {...props} />
);

export const ProductTitle: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="product-title" {...props} />
);

export const ProductDescription: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="product-description" {...props} />
);

export const PriceText: React.FC<Omit<TextProps, 'variant'> & { size?: 'small' | 'regular' | 'large' }> = ({
  size = 'regular',
  ...props
}) => (
  <Text variant={`price-${size}` as TextVariant} color="text.price" {...props} />
);

export const SalePriceText: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="price-sale" color="text.secondary" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="caption" {...props} />
);

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="label" {...props} />
);

export const Overline: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="overline" {...props} />
);

export const Badge: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="badge" {...props} />
);

export const CategoryTitle: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="category-title" {...props} />
);

export const SearchPlaceholder: React.FC<Omit<TextProps, 'variant'>> = (props) => (
  <Text variant="search-placeholder" {...props} />
);