import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { UI_CONFIG, COMPONENT_CONFIG } from '@/config/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  disabled?: boolean;
  showPasswordToggle?: boolean; // Auto-show for secureTextEntry
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  disabled = false,
  showPasswordToggle,
  style,
  onFocus,
  onBlur,
  secureTextEntry,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputConfig = COMPONENT_CONFIG.inputs.default;

  // Auto-enable password toggle for secure inputs
  const shouldShowPasswordToggle = showPasswordToggle !== false && secureTextEntry;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const containerStyles: ViewStyle = {
    marginBottom: UI_CONFIG.SPACING[2], // 16px
    ...containerStyle,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    height: inputConfig.height,
    borderWidth: 1,
    borderColor: error
      ? UI_CONFIG.COLORS.feedback.error
      : isFocused
      ? UI_CONFIG.COLORS.primary
      : UI_CONFIG.COLORS.border.light,
    borderRadius: inputConfig.borderRadius,
    backgroundColor: disabled ? UI_CONFIG.COLORS.background.secondary : UI_CONFIG.COLORS.background.default,
    paddingHorizontal: UI_CONFIG.SPACING[2], // 16px
    // Fix Android shadow issues - use only elevation on Android
    ...(isFocused && !error && Platform.OS === 'ios' && {
      shadowColor: UI_CONFIG.COLORS.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    }),
    ...(isFocused && !error && Platform.OS === 'android' && {
      elevation: 2,
    }),
  };

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: inputConfig.fontSize,
    fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
    color: disabled ? UI_CONFIG.COLORS.text.disabled : UI_CONFIG.COLORS.text.primary,
    paddingHorizontal: leftIcon || rightIcon ? UI_CONFIG.SPACING[1] : 0, // 8px if icons
  };

  return (
    <View style={containerStyles}>
      {label && (
        <Text
          variant="label"
          color={error ? 'feedback.error' : isFocused ? 'primary' : 'text.secondary'}
          style={{ marginBottom: UI_CONFIG.SPACING[1] }} // 8px
        >
          {label}
        </Text>
      )}

      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={{ marginRight: UI_CONFIG.SPACING[1] }}>
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={ref}
          style={[inputStyle, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          placeholderTextColor={UI_CONFIG.COLORS.text.disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />

        {shouldShowPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ marginLeft: UI_CONFIG.SPACING[1], padding: 4 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={UI_CONFIG.COLORS.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !shouldShowPasswordToggle && (
          <View style={{ marginLeft: UI_CONFIG.SPACING[1] }}>
            {rightIcon}
          </View>
        )}
      </View>

      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? 'feedback.error' : 'text.secondary'}
          style={{ marginTop: UI_CONFIG.SPACING[0.5] }} // 4px
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';