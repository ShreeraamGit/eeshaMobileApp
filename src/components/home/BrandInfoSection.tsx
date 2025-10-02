import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Text } from '@/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONFIG } from '@/config/constants';

interface BrandInfoSectionProps {
  style?: ViewStyle;
}

export const BrandInfoSection: React.FC<BrandInfoSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    paddingTop: 48, // Add top spacing
    paddingBottom: 48, // Add bottom spacing
    paddingHorizontal: 16,
    backgroundColor: '#F8F0E7', // Peach/cream background from design
    alignItems: 'center',
    ...style,
  };

  const logoContainerStyle: ViewStyle = {
    marginBottom: 24, // Spacing below logo
  };

  const taglineContainerStyle: ViewStyle = {
    marginBottom: 32, // Spacing before features grid
    paddingHorizontal: 16,
  };

  const taglineTextStyle: TextStyle = {
    textAlign: 'center',
  };

  const featuresGridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
  };

  const featureItemStyle: ViewStyle = {
    width: '48%',
    alignItems: 'center',
    marginBottom: 32,
  };

  const iconContainerStyle: ViewStyle = {
    marginBottom: 16,
  };

  const featureTextStyle: TextStyle = {
    textAlign: 'center',
    paddingHorizontal: UI_CONFIG.SPACING[1], // 8px
  };

  return (
    <View style={containerStyle}>
      {/* Logo */}
      <View style={logoContainerStyle}>
        <Text variant="h2" color="text.primary" style={{ letterSpacing: 2 }}>
          Open
        </Text>
        <Text variant="h2" color="text.primary" style={{ letterSpacing: 2 }}>
          Fashion
        </Text>
      </View>

      {/* Tagline */}
      <View style={taglineContainerStyle}>
        <Text variant="body-regular" color="text.secondary" style={taglineTextStyle}>
          Making a luxurious lifestyle accessible for a generous group of women is our daily drive.
        </Text>
      </View>

      {/* Features Grid */}
      <View style={featuresGridStyle}>
        {/* Fast Shipping */}
        <View style={featureItemStyle}>
          <View style={iconContainerStyle}>
            <Ionicons name="airplane-outline" size={32} color={UI_CONFIG.COLORS.text.primary} />
          </View>
          <Text variant="caption" color="text.secondary" style={featureTextStyle}>
            Fast shipping. Free on orders over $25.
          </Text>
        </View>

        {/* Sustainable Process */}
        <View style={featureItemStyle}>
          <View style={iconContainerStyle}>
            <Ionicons name="leaf-outline" size={32} color={UI_CONFIG.COLORS.text.primary} />
          </View>
          <Text variant="caption" color="text.secondary" style={featureTextStyle}>
            Sustainable process from start to finish.
          </Text>
        </View>

        {/* Unique Designs */}
        <View style={featureItemStyle}>
          <View style={iconContainerStyle}>
            <Ionicons name="diamond-outline" size={32} color={UI_CONFIG.COLORS.text.primary} />
          </View>
          <Text variant="caption" color="text.secondary" style={featureTextStyle}>
            Unique designs and high-quality materials.
          </Text>
        </View>

        {/* Fast Shipping (duplicate) */}
        <View style={featureItemStyle}>
          <View style={iconContainerStyle}>
            <Ionicons name="checkmark-circle-outline" size={32} color={UI_CONFIG.COLORS.text.primary} />
          </View>
          <Text variant="caption" color="text.secondary" style={featureTextStyle}>
            Fast shipping. Free on orders over $25.
          </Text>
        </View>
      </View>
    </View>
  );
};
