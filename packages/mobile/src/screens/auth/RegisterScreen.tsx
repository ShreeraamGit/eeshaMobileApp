import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from '@/components/common/Text';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/authStore';
import {
  validateEmail,
  validatePassword,
  AUTH_ERRORS,
  VALIDATION_RULES,
} from '@eesha/shared';
import { UI_CONFIG } from '@/config/constants';
import type { RootStackParamList } from '@/navigation/AppNavigator';

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

  // Refs for input navigation
  const fullNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { signUp } = useAuthStore();

  // Auto-focus full name input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fullNameRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

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
      fullNameRef.current?.focus();
      hasError = true;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error || AUTH_ERRORS.INVALID_EMAIL);
      if (!hasError) emailRef.current?.focus();
      hasError = true;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error || AUTH_ERRORS.WEAK_PASSWORD);
      if (!hasError) passwordRef.current?.focus();
      hasError = true;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      if (!hasError) confirmPasswordRef.current?.focus();
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        // Check for common Supabase errors
        if (error.includes('already') || error.includes('exists')) {
          setEmailError(AUTH_ERRORS.EMAIL_ALREADY_EXISTS);
        } else {
          setGeneralError(error);
        }
      } else {
        // Success - auth state will automatically navigate to Home
        // No need to manually navigate
      }
    } catch (error) {
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
              Créer un compte
            </Text>
            <Text variant="body-regular" color="text.secondary" style={styles.subtitle}>
              Rejoignez-nous pour commencer vos achats
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
              ref={fullNameRef}
              label="Nom complet"
              placeholder="Jean Dupont"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                setFullNameError('');
                setGeneralError('');
              }}
              error={fullNameError}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              editable={!isLoading}
            />

            <Input
              ref={emailRef}
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
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isLoading}
            />

            <Input
              ref={passwordRef}
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
                setGeneralError('');
              }}
              error={passwordError}
              helperText={`Minimum ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} caractères`}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              editable={!isLoading}
            />

            <Input
              ref={confirmPasswordRef}
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
                setGeneralError('');
              }}
              error={confirmPasswordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
              editable={!isLoading}
            />
          </View>

          {/* Register Button */}
          <Button
            title="Créer un compte"
            variant="primary"
            size="large"
            fullWidth
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
          />

          {/* Terms */}
          <Text
            variant="body-small"
            color="text.secondary"
            style={styles.terms}
          >
            En créant un compte, vous acceptez nos conditions d'utilisation et
            notre politique de confidentialité.
          </Text>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text variant="body-regular" color="text.secondary">
              Vous avez déjà un compte?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text variant="body-regular" color="primary">
                Se connecter
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
  terms: {
    textAlign: 'center',
    marginTop: UI_CONFIG.SPACING[3], // 24px
    paddingHorizontal: UI_CONFIG.SPACING[2],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING[4], // 32px
  },
});

export default RegisterScreen;
