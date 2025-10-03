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

export const AppStripeProvider: React.FC<StripeProviderProps> = (props) => {
  // For web platform, always use the web fallback
  if (Platform.OS === 'web') {
    return <WebStripeProvider>{props.children}</WebStripeProvider>;
  }

  // For native platforms, dynamically load Stripe provider
  const [NativeProvider, setNativeProvider] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    const loadNativeProvider = async () => {
      try {
        // Use dynamic import to avoid Metro bundling this for web
        const module = await import('@stripe/stripe-react-native');
        setNativeProvider(() => module.StripeProvider);
      } catch (error) {
        console.warn('Stripe React Native not available, using fallback');
        setNativeProvider(() => WebStripeProvider);
      }
    };

    loadNativeProvider();
  }, []);

  // While loading native provider, show web fallback
  if (!NativeProvider) {
    return <WebStripeProvider>{props.children}</WebStripeProvider>;
  }

  // Use the loaded native provider
  return <NativeProvider {...props} />;
};