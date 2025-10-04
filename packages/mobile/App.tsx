import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppStripeProvider } from '@/components/providers/StripeProvider';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider/gluestack-ui-provider';
import { useFonts, TenorSans_400Regular } from '@expo-google-fonts/tenor-sans';
import * as SplashScreen from 'expo-splash-screen';
import { API_CONFIG } from '@/config/constants';

// Import navigation
import { AppNavigator } from '@/navigation/AppNavigator';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Tenor Sans': TenorSans_400Regular,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppStripeProvider
            publishableKey={API_CONFIG.STRIPE_PUBLISHABLE_KEY}
            merchantIdentifier="merchant.com.eeshasilks.app"
          >
            <StatusBar style="auto" />
            <AppNavigator />
          </AppStripeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
