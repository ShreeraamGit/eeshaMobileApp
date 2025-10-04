import React from 'react';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/gluestack-ui-provider/button';
import { UI_CONFIG, TEXT_STYLES } from '@/config/constants';

export type EeshaButtonVariant = 'primary' | 'secondary' | 'coral' | 'golden' | 'ghost' | 'danger';
export type EeshaButtonSize = 'small' | 'medium' | 'large';

interface EeshaButtonProps {
  children: React.ReactNode;
  variant?: EeshaButtonVariant;
  size?: EeshaButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  className?: string;
}

export const EeshaButton: React.FC<EeshaButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  isDisabled = false,
  onPress,
  fullWidth = false,
  className = '',
}) => {
  // Variant styles based on your design system
  const variantStyles = {
    primary: 'bg-[#14142b] active:opacity-90',
    secondary: 'bg-[#dedede] active:opacity-90',
    coral: 'bg-[#dd8560] active:opacity-90',
    golden: 'bg-[#f9a000] active:opacity-90',
    ghost: 'bg-transparent border border-[#14142b] active:bg-[#14142b]/5',
    danger: 'bg-[#EF4444] active:opacity-90',
  };

  // Size styles based on COMPONENT_CONFIG
  const sizeStyles = {
    small: 'h-8 px-4',
    medium: 'h-12 px-6',
    large: 'h-14 px-8',
  };

  // Text color based on variant
  const textColorStyles = {
    primary: 'text-white',
    secondary: 'text-[#14142b]',
    coral: 'text-white',
    golden: 'text-white',
    ghost: 'text-[#14142b]',
    danger: 'text-white',
  };

  // Text size based on button size
  const textSizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled || isLoading}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} rounded-lg ${className}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {isLoading && <ButtonSpinner className="mr-2" />}
      <ButtonText
        className={`${textColorStyles[variant]} ${textSizeStyles[size]} font-semibold`}
        style={{
          fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
          letterSpacing: 0.3,
        }}
      >
        {children}
      </ButtonText>
    </Button>
  );
};
