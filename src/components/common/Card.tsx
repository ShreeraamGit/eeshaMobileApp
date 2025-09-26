import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { UI_CONFIG, COMPONENT_CONFIG } from '@/config/constants';

interface CardProps extends ViewProps {
  padding?: keyof typeof UI_CONFIG.SPACING | number;
  shadow?: boolean;
  borderRadius?: keyof typeof UI_CONFIG.BORDER_RADIUS | number;
  backgroundColor?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  padding,
  shadow = true,
  borderRadius,
  backgroundColor,
  style,
  children,
  ...props
}) => {
  const defaultConfig = COMPONENT_CONFIG.cards.default;

  const cardStyle: ViewStyle = {
    backgroundColor: backgroundColor || defaultConfig.background,
    borderRadius: borderRadius
      ? (typeof borderRadius === 'number' ? borderRadius : UI_CONFIG.BORDER_RADIUS[borderRadius])
      : defaultConfig.borderRadius,
    padding: padding
      ? (typeof padding === 'number' ? padding : UI_CONFIG.SPACING[padding])
      : defaultConfig.padding,
    ...(shadow && {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    }),
    ...(typeof style === 'object' ? style : {}),
  };

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};