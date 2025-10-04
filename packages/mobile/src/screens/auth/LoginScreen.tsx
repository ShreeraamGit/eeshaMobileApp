import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, AUTH_ERRORS } from '@eesha/shared';
import type { RootStackParamList } from '@/navigation/AppNavigator';

// Gluestack UI Components
import { VStack } from '@/components/ui/gluestack-ui-provider/vstack';
import { HStack } from '@/components/ui/gluestack-ui-provider/hstack';
import { Text } from '@/components/ui/gluestack-ui-provider/text';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/gluestack-ui-provider/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/gluestack-ui-provider/button';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText
} from '@/components/ui/gluestack-ui-provider/form-control';
import { Pressable } from '@/components/ui/gluestack-ui-provider/pressable';
import { SafeAreaView } from '@/components/ui/gluestack-ui-provider/safe-area-view';
import { ScrollView } from '@/components/ui/gluestack-ui-provider/scroll-view';
import { EyeIcon, EyeOffIcon } from 'lucide-react-native';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthStore();

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

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setGeneralError(error);
      }
    } catch (error) {
      console.error('[LoginScreen] Login error:', error);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="flex-grow">
        <VStack className="flex-1 px-6 pt-10 pb-6" space="xl">
          {/* Header */}
          <VStack space="xs" className="mb-2">
            <Text className="text-3xl font-bold text-black">Connexion</Text>
            <Text className="text-base text-gray-600">Accédez à votre compte</Text>
          </VStack>

          {/* Error Message */}
          {generalError && (
            <VStack className="bg-red-50 p-4 rounded-lg">
              <Text className="text-red-600 text-sm">{generalError}</Text>
            </VStack>
          )}

          {/* Form */}
          <VStack space="lg" className="flex-1">
            {/* Email Input */}
            <FormControl isInvalid={!!emailError}>
              <FormControlLabel>
                <FormControlLabelText>Adresse e-mail</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                    setGeneralError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!isLoading}
                />
              </Input>
              {emailError && (
                <FormControlError>
                  <FormControlErrorText>{emailError}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!passwordError}>
              <FormControlLabel>
                <FormControlLabelText>Mot de passe</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                    setGeneralError('');
                  }}
                  type={showPassword ? 'text' : 'password'}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!isLoading}
                />
                <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
                  <InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
                </InputSlot>
              </Input>
              {passwordError && (
                <FormControlError>
                  <FormControlErrorText>{passwordError}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Forgot Password */}
            <Pressable onPress={() => console.log('Forgot password')} className="self-end">
              <Text className="text-sm text-gray-600">Mot de passe oublié?</Text>
            </Pressable>
          </VStack>

          {/* Login Button */}
          <Button
            onPress={handleLogin}
            isDisabled={isLoading}
            className="bg-black"
          >
            {isLoading && <ButtonSpinner />}
            <ButtonText>Se connecter</ButtonText>
          </Button>

          {/* Register Link */}
          <HStack space="xs" className="justify-center items-center mt-4">
            <Text className="text-base text-gray-600">Vous n'avez pas de compte?</Text>
            <Pressable onPress={() => navigation.navigate('Register')} isDisabled={isLoading}>
              <Text className="text-base text-black font-semibold">Créer un compte</Text>
            </Pressable>
          </HStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
