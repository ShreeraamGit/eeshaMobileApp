import React, { useState } from 'react';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/gluestack-ui-provider/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { UI_CONFIG } from '@/config/constants';

export type EeshaInputType = 'text' | 'email' | 'password' | 'number';

interface EeshaInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  type?: EeshaInputType;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  isDisabled?: boolean;
  isInvalid?: boolean;
  className?: string;
}

export const EeshaInput: React.FC<EeshaInputProps> = ({
  value,
  onChangeText,
  placeholder,
  type = 'text',
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  isDisabled = false,
  isInvalid = false,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  // Border color based on state
  const borderColor = isInvalid ? 'border-[#EF4444]' : 'border-[#dedede]';
  const focusBorderColor = isInvalid ? 'focus:border-[#EF4444]' : 'focus:border-[#14142b]';

  return (
    <Input
      className={`h-12 ${borderColor} ${focusBorderColor} rounded-lg bg-white ${className}`}
      style={{
        borderWidth: 1,
      }}
    >
      <InputField
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        type={isPassword && !showPassword ? 'password' : 'text'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        editable={!isDisabled}
        className="text-base px-4"
        placeholderTextColor="#A0A0A0"
        style={{
          fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
          color: UI_CONFIG.COLORS.text.primary,
        }}
      />
      {isPassword && (
        <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
          <InputIcon
            as={showPassword ? EyeOffIcon : EyeIcon}
            className="text-[#666666]"
            size={20}
          />
        </InputSlot>
      )}
    </Input>
  );
};
