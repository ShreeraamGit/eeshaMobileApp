import React from 'react';
import { Platform } from 'react-native';

interface StripeProviderProps {
  children: React.ReactNode;
  publishableKey?: string;
  merchantIdentifier?: string;
}

// Web fallback component
const WebStripeProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

// Native Stripe provider
let NativeStripeProvider: React.ComponentType<StripeProviderProps>;

if (Platform.OS !== 'web') {
  try {
    const { StripeProvider } = require('@stripe/stripe-react-native');
    NativeStripeProvider = StripeProvider;
  } catch (error) {
    console.warn('Stripe React Native not available, using fallback');
    NativeStripeProvider = WebStripeProvider as any;
  }
} else {
  NativeStripeProvider = WebStripeProvider as any;
}

export const AppStripeProvider: React.FC<StripeProviderProps> = (props) => {
  if (Platform.OS === 'web') {
    return <WebStripeProvider>{props.children}</WebStripeProvider>;
  }

  return <NativeStripeProvider {...props} />;
};