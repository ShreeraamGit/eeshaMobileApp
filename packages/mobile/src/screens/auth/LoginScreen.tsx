import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';
import { validateEmail, validatePassword, AUTH_ERRORS } from '@eesha/shared';
import { UI_CONFIG } from '@/config/constants';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Success - auth state will automatically navigate to Home
    } catch (error) {
      console.error('[LoginScreen] Login error:', error);
      setGeneralError(AUTH_ERRORS.UNKNOWN_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text variant="display-medium" style={styles.title}>
              Connexion
            </Text>
            <Text variant="body-regular" color="text.secondary" style={styles.subtitle}>
              Accédez à votre compte
            </Text>
          </View>

          {/* Error Message */}
          {generalError ? (
            <View style={styles.errorContainer}>
              <Text variant="body-small" color="feedback.error">
                {generalError}
              </Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Adresse e-mail"
              placeholder="votre@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
                setGeneralError('');
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isLoading}
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                setGeneralError('');
              }}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              editable={!isLoading}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => {
                // TODO: Implement forgot password screen
                console.log('Forgot password tapped');
              }}
              disabled={isLoading}
              style={styles.forgotPassword}
            >
              <Text variant="body-small" color="text.secondary">
                Mot de passe oublié?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Button
            title="Se connecter"
            variant="primary"
            size="large"
            fullWidth
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
          />

          {/* Register Link */}
          <View style={styles.footer}>
            <Text variant="body-regular" color="text.secondary">
              Vous n'avez pas de compte?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text variant="body-regular" color="primary">
                Créer un compte
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
    paddingTop: UI_CONFIG.SPACING[5], // 40px
    paddingBottom: UI_CONFIG.SPACING[4], // 32px
  },
  header: {
    marginBottom: UI_CONFIG.SPACING[5], // 40px
  },
  title: {
    color: UI_CONFIG.COLORS.text.primary,
    marginBottom: UI_CONFIG.SPACING[1], // 8px
  },
  subtitle: {
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2', // Light red background
    padding: UI_CONFIG.SPACING[2],
    borderRadius: UI_CONFIG.COMPONENT_RADIUS.card,
    marginBottom: UI_CONFIG.SPACING[3],
  },
  form: {
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -UI_CONFIG.SPACING[1], // -8px (closer to input)
    marginBottom: UI_CONFIG.SPACING[3], // 24px
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING[4], // 32px
  },
});

export default LoginScreen;
