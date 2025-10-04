import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import {
  validateEmail,
  validatePassword,
  AUTH_ERRORS,
  VALIDATION_RULES,
} from '@eesha/shared';
import type { RootStackParamList } from '@/navigation/AppNavigator';

// Eesha Branded Components
import { EeshaButton, EeshaInput, EeshaFormControl, EeshaText } from '@/components/common';

// Gluestack UI Layout Components
import { VStack } from '@/components/ui/gluestack-ui-provider/vstack';
import { HStack } from '@/components/ui/gluestack-ui-provider/hstack';
import { Pressable } from '@/components/ui/gluestack-ui-provider/pressable';
import { ScrollView } from '@/components/ui/gluestack-ui-provider/scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuthStore();

  const handleRegister = async () => {
    // Reset errors
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Le nom complet est requis');
      hasError = true;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || AUTH_ERRORS.INVALID_EMAIL);
      hasError = true;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || AUTH_ERRORS.WEAK_PASSWORD);
      hasError = true;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    // Show loading for minimum 2 seconds for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        setIsLoading(false);
        // Check for common Supabase errors
        if (error.includes('already') || error.includes('exists')) {
          setEmailError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
        } else {
          setGeneralError(error);
        }
      } else {
        setIsLoading(false);
        // Navigation will be handled by auth state change
      }
    } catch (error) {
      setIsLoading(false);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView className="flex-1" contentContainerClassName="flex-grow">
        <VStack className="flex-1 px-6 pt-10 pb-6" space="xl">
          {/* Header */}
          <VStack space="xs" className="mb-6">
            <EeshaText variant="h1">Créer un compte</EeshaText>
            <EeshaText variant="body-regular" color="secondary">
              Rejoignez-nous pour commencer vos achats
            </EeshaText>
          </VStack>

          {/* Error Message */}
          {generalError && (
            <VStack className="bg-red-50 p-4 rounded-lg mb-4">
              <EeshaText variant="body-small" className="text-red-600">
                {generalError}
              </EeshaText>
            </VStack>
          )}

          {/* Form */}
          <VStack space="lg" className="flex-1">
            {/* Full Name Input */}
            <EeshaFormControl
              label="Nom complet"
              error={fullNameError}
              isInvalid={!!fullNameError}
            >
              <EeshaInput
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setFullNameError('');
                  setGeneralError('');
                }}
                placeholder="Jean Dupont"
                autoCapitalize="words"
                returnKeyType="next"
                isDisabled={isLoading}
                isInvalid={!!fullNameError}
              />
            </EeshaFormControl>

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
              helper={`Minimum ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} caractères`}
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
                returnKeyType="next"
                isDisabled={isLoading}
                isInvalid={!!passwordError}
              />
            </EeshaFormControl>

            {/* Confirm Password Input */}
            <EeshaFormControl
              label="Confirmer le mot de passe"
              error={confirmPasswordError}
              isInvalid={!!confirmPasswordError}
            >
              <EeshaInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                  setGeneralError('');
                }}
                placeholder="••••••••"
                type="password"
                returnKeyType="done"
                onSubmitEditing={handleRegister}
                isDisabled={isLoading}
                isInvalid={!!confirmPasswordError}
              />
            </EeshaFormControl>
          </VStack>

          {/* Register Button */}
          <EeshaButton
            onPress={handleRegister}
            isLoading={isLoading}
            isDisabled={isLoading}
            variant="primary"
            size="large"
            fullWidth
          >
            Créer un compte
          </EeshaButton>

          {/* Terms */}
          <EeshaText
            variant="body-small"
            color="secondary"
            align="center"
            className="mt-6 px-4"
          >
            En créant un compte, vous acceptez nos conditions d'utilisation et
            notre politique de confidentialité.
          </EeshaText>

          {/* Login Link */}
          <HStack space="xs" className="justify-center items-center mt-6">
            <EeshaText variant="body-regular" color="secondary">
              Vous avez déjà un compte?
            </EeshaText>
            <Pressable onPress={() => navigation.navigate('Login')} disabled={isLoading}>
              <EeshaText variant="body-regular" className="font-semibold">
                Se connecter
              </EeshaText>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
