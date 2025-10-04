import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from '@/components/ui/gluestack-ui-provider/form-control';
import { UI_CONFIG } from '@/config/constants';

interface EeshaFormControlProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  helper?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  className?: string;
}

export const EeshaFormControl: React.FC<EeshaFormControlProps> = ({
  children,
  label,
  error,
  helper,
  isRequired = false,
  isInvalid = false,
  className = '',
}) => {
  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired} className={className}>
      {label && (
        <FormControlLabel className="mb-2">
          <FormControlLabelText
            className="text-sm font-medium"
            style={{
              fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
              color: UI_CONFIG.COLORS.text.primary,
            }}
          >
            {label}
            {isRequired && <FormControlLabelText className="text-[#EF4444]"> *</FormControlLabelText>}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      {children}

      {helper && !error && (
        <FormControlHelper className="mt-1">
          <FormControlHelperText
            className="text-xs"
            style={{
              fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
              color: UI_CONFIG.COLORS.text.secondary,
            }}
          >
            {helper}
          </FormControlHelperText>
        </FormControlHelper>
      )}

      {error && (
        <FormControlError className="mt-1">
          <FormControlErrorText
            className="text-xs"
            style={{
              fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
              color: UI_CONFIG.COLORS.feedback.error,
            }}
          >
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
};
