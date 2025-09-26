import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';
import { UI_CONFIG, COMPONENT_CONFIG } from '@/config/constants';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  size = 'medium',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const sizeConfig = COMPONENT_CONFIG.buttons.sizes[size];
  const variantConfig = COMPONENT_CONFIG.buttons.variants[variant];

  const buttonStyle: ViewStyle = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingX,
    backgroundColor: variantConfig.background,
    borderRadius: UI_CONFIG.COMPONENT_RADIUS.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_CONFIG.SPACING[1], // 8px
    ...(fullWidth && { width: '100%' }),
    ...(variantConfig.border && { borderWidth: 1, borderColor: variantConfig.border.split(' ')[3] }),
    ...(disabled && { opacity: 0.6 }),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...(typeof style === 'object' ? style : {}),
  };

  const textVariant = size === 'large' ? 'button-large' : size === 'small' ? 'button-small' : 'button-regular';

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantConfig.color}
        />
      ) : (
        <>
          {leftIcon}
          <Text variant={textVariant} style={{ color: variantConfig.color }}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

// Convenience components for different button variants
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
);