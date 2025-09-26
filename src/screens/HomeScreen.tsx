import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderSection } from '@/components/home/HeaderSection';
import { HeroSection } from '@/components/home/HeroSection';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { JustForYouSection } from '@/components/home/JustForYouSection';
import { BottomNavigation } from '@/components/home/BottomNavigation';
import { UI_CONFIG } from '@/config/constants';

const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: UI_CONFIG.COLORS.background.default,
        paddingTop: insets.top,
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={UI_CONFIG.COLORS.background.default}
      />

      {/* Top Navigation with User and Notifications */}
      <HeaderSection userName="Sarah Johnson" />

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: UI_CONFIG.SPACING[3] }} // Add some padding for last item
        >
          {/* Hero Section with Luxury Fashion Accessories */}
          <HeroSection />

          {/* New Arrivals Product Grid */}
          <NewArrivalsSection />

          {/* Collections Section */}
          <CollectionsSection />

          {/* Just for You Section */}
          <JustForYouSection />
        </ScrollView>
      </View>

      {/* Bottom Navigation - extends to screen edge */}
      <BottomNavigation
        activeTab="search"
        cartItemCount={3}
        style={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
};

export default HomeScreen;
