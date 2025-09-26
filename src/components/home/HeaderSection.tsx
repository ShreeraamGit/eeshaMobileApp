import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';
import { getScaledFontSize } from '@/utils/responsive';

interface HeaderSectionProps {
  userName?: string;
  style?: ViewStyle;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  userName = 'Sarah Johnson',
  style,
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING[3], // 24px
    paddingVertical: UI_CONFIG.SPACING[2], // 16px
    backgroundColor: UI_CONFIG.COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.border.black,
    ...style,
  };

  const userSectionStyle: ViewStyle = {
    flex: 1,
  };

  const notificationStyle: ViewStyle = {
    position: 'relative',
  };

  const badgeStyle: ViewStyle = {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: UI_CONFIG.COLORS.ecommerce.sale,
    borderRadius: 6,
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View style={containerStyle}>
      {/* User Section */}
      <View style={userSectionStyle}>
        <Text
          variant="caption"
          color="text.secondary"
          style={{ fontSize: getScaledFontSize(12) }}
        >
          Good morning
        </Text>
        <Text
          variant="body-regular"
          color="text.primary"
          style={{ fontWeight: '600', fontSize: getScaledFontSize(16) }}
        >
          {userName}
        </Text>
      </View>

      {/* Notification Icon */}
      <TouchableOpacity style={notificationStyle}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={UI_CONFIG.COLORS.text.primary}
        />
        {/* Notification Badge */}
        <View style={badgeStyle}>
          <Text
            style={{
              color: 'white',
              fontSize: getScaledFontSize(8),
              fontWeight: '600',
            }}
          >
            3
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
