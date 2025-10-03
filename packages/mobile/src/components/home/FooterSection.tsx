import React from 'react';
import { View, TouchableOpacity, ViewStyle, Linking } from 'react-native';
import { Text } from '@/components/common/Text';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONFIG } from '@/config/constants';

interface FooterSectionProps {
  style?: ViewStyle;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ style }) => {
  const containerStyle: ViewStyle = {
    paddingVertical: UI_CONFIG.SPACING[6], // 48px
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
    backgroundColor: UI_CONFIG.COLORS.background.default,
    alignItems: 'center',
    ...style,
  };

  const socialContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: UI_CONFIG.SPACING[3], // 24px
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  };

  const iconButtonStyle: ViewStyle = {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const contactContainerStyle: ViewStyle = {
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  };

  const linksContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: UI_CONFIG.SPACING[4], // 32px
    marginTop: UI_CONFIG.SPACING[3], // 24px
  };

  const handleSocialPress = (platform: string) => {
    const urls: { [key: string]: string } = {
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    };
    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  return (
    <View style={containerStyle}>
      {/* Social Media Icons */}
      <View style={socialContainerStyle}>
        <TouchableOpacity style={iconButtonStyle} onPress={() => handleSocialPress('twitter')}>
          <Ionicons name="logo-twitter" size={24} color={UI_CONFIG.COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={iconButtonStyle} onPress={() => handleSocialPress('instagram')}>
          <Ionicons name="logo-instagram" size={24} color={UI_CONFIG.COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={iconButtonStyle} onPress={() => handleSocialPress('youtube')}>
          <Ionicons name="logo-youtube" size={24} color={UI_CONFIG.COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={contactContainerStyle}>
        <Text variant="body-regular" color="text.secondary" style={{ marginBottom: 4 }}>
          support@openfashion.com
        </Text>
        <Text variant="body-regular" color="text.secondary" style={{ marginBottom: 4 }}>
          +33 123 456 7890
        </Text>
        <Text variant="body-regular" color="text.secondary">
          08:00 - 22:00 - Everyday
        </Text>
      </View>

      {/* Footer Links */}
      <View style={linksContainerStyle}>
        <TouchableOpacity>
          <Text variant="caption" color="text.secondary">
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text variant="caption" color="text.secondary">
            Contact
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text variant="caption" color="text.secondary">
            Blog
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
