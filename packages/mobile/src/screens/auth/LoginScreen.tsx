import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, AUTH_ERRORS } from '@eesha/shared';
import type { RootStackParamList } from '@/navigation/AppNavigator';

// Eesha Branded Components
import { EeshaButton, EeshaInput, EeshaFormControl, EeshaText } from '@/components/common';
import { EeshaSocialButton } from '@/components/common/EeshaSocialButton';

// Gluestack UI Layout Components
import { VStack } from '@/components/ui/gluestack-ui-provider/vstack';
import { HStack } from '@/components/ui/gluestack-ui-provider/hstack';
import { Pressable } from '@/components/ui/gluestack-ui-provider/pressable';
import { ScrollView } from '@/components/ui/gluestack-ui-provider/scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const { signIn, signInWithGoogle } = useAuthStore();

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || AUTH_ERRORS.INVALID_EMAIL);
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || AUTH_ERRORS.WEAK_PASSWORD);
      return;
    }

    setIsLoading(true);

    // Show loading for minimum 2 seconds for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setIsLoading(false);
        setGeneralError(error);
      } else {
        setIsLoading(false);
        // Navigation will be handled by auth state change
      }
    } catch (error) {
      setIsLoading(false);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('[LoginScreen] handleGoogleSignIn: User clicked Google button');
    setGeneralError('');
    setIsSocialLoading(true);

    try {
      console.log('[LoginScreen] handleGoogleSignIn: Calling signInWithGoogle...');
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('[LoginScreen] handleGoogleSignIn: Error received:', error);
        setIsSocialLoading(false);
        setGeneralError(error);
      } else {
        console.log('[LoginScreen] handleGoogleSignIn: OAuth flow initiated successfully');
      }
      // Keep loading until OAuth callback completes
    } catch (error) {
      console.error('[LoginScreen] handleGoogleSignIn: Exception caught:', error);
      setIsSocialLoading(false);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView className="flex-1" contentContainerClassName="flex-grow">
        <VStack className="flex-1 px-6 pt-10 pb-6" space="xl">
          {/* Header */}
          <VStack space="xs" className="mb-2">
            <EeshaText variant="h1">Connexion</EeshaText>
            <EeshaText variant="body-regular" color="secondary">
              Accédez à votre compte
            </EeshaText>
          </VStack>

          {/* Error Message */}
          {generalError && (
            <VStack className="bg-red-50 p-4 rounded-lg">
              <EeshaText variant="body-small" className="text-red-600">
                {generalError}
              </EeshaText>
            </VStack>
          )}

          {/* Social Login Button */}
          <EeshaSocialButton
            provider="google"
            onPress={handleGoogleSignIn}
            isLoading={isSocialLoading}
            isDisabled={isLoading || isSocialLoading}
          />

          {/* Divider */}
          <HStack className="items-center" space="md">
            <VStack className="flex-1 h-[1px] bg-gray-200" />
            <EeshaText variant="body-small" color="secondary">
              OU
            </EeshaText>
            <VStack className="flex-1 h-[1px] bg-gray-200" />
          </HStack>

          {/* Form */}
          <VStack space="lg" className="flex-1">
            {/* Email Input */}
            <EeshaFormControl
              label="Adresse e-mail"
              error={emailError}
              isInvalid={!!emailError}
            >
              <EeshaInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  setGeneralError('');
                }}
                placeholder="votre@email.com"
                type="email"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="next"
                isDisabled={isLoading}
                isInvalid={!!emailError}
              />
            </EeshaFormControl>

            {/* Password Input */}
            <EeshaFormControl
              label="Mot de passe"
              error={passwordError}
              isInvalid={!!passwordError}
            >
              <EeshaInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                  setGeneralError('');
                }}
                placeholder="••••••••"
                type="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                isDisabled={isLoading}
                isInvalid={!!passwordError}
              />
            </EeshaFormControl>

            {/* Forgot Password */}
            <Pressable onPress={() => console.log('Forgot password')} className="self-end">
              <EeshaText variant="body-small" color="secondary">
                Mot de passe oublié?
              </EeshaText>
            </Pressable>
          </VStack>

          {/* Login Button */}
          <EeshaButton
            onPress={handleLogin}
            isLoading={isLoading}
            isDisabled={isLoading}
            variant="primary"
            size="large"
            fullWidth
          >
            Se connecter
          </EeshaButton>

          {/* Register Link */}
          <HStack space="xs" className="justify-center items-center mt-4">
            <EeshaText variant="body-regular" color="secondary">
              Vous n'avez pas de compte?
            </EeshaText>
            <Pressable onPress={() => navigation.navigate('Register')} disabled={isLoading}>
              <EeshaText variant="body-regular" className="font-semibold">
                Créer un compte
              </EeshaText>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
