import React from 'react';
import { View } from 'react-native';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/gluestack-ui-provider/button';
import { UI_CONFIG } from '@/config/constants';
import { GoogleIcon } from './icons/GoogleIcon';

type SocialProvider = 'google';

interface EeshaSocialButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const providerConfig = {
  google: {
    text: 'Continuer avec Google',
    backgroundColor: '#FFFFFF',
    textColor: '#1F1F1F',
    borderColor: '#DADCE0',
  },
};

export const EeshaSocialButton: React.FC<EeshaSocialButtonProps> = ({
  provider,
  onPress,
  isLoading = false,
  isDisabled = false,
}) => {
  const config = providerConfig[provider];

  return (
    <Button
      onPress={onPress}
      isDisabled={isDisabled || isLoading}
      className="rounded-lg"
      style={{
        backgroundColor: config.backgroundColor,
        borderWidth: 1,
        borderColor: config.borderColor,
        height: 52,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <ButtonSpinner color="#1F1F1F" size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <GoogleIcon size={20} />
          <ButtonText
            style={{
              color: config.textColor,
              fontSize: 16,
              fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary,
              fontWeight: '600',
              letterSpacing: 0.3,
            }}
          >
            {config.text}
          </ButtonText>
        </View>
      )}
    </Button>
  );
};
