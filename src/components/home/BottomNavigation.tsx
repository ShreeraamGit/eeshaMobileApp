import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/common/Text';
import { UI_CONFIG } from '@/config/constants';
import { getScaledFontSize } from '@/utils/responsive';

interface BottomNavigationProps {
  activeTab?: 'home' | 'search' | 'favorites' | 'cart' | 'account';
  cartItemCount?: number;
  style?: ViewStyle;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  cartItemCount = 0,
  style
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: UI_CONFIG.COLORS.background.default,
    borderTopWidth: 1,
    borderTopColor: UI_CONFIG.COLORS.border.light,
    paddingTop: UI_CONFIG.SPACING[1], // Reduced from 16px to 8px
    paddingBottom: 0, // Remove bottom padding
    paddingHorizontal: UI_CONFIG.SPACING[1], // 8px
    ...style,
  };

  const tabItemStyle: ViewStyle = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4, // Reduced from 8px to 4px
  };

  const cartIconContainer: ViewStyle = {
    position: 'relative',
  };

  const cartBadgeStyle: ViewStyle = {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: UI_CONFIG.COLORS.ecommerce.sale,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  };

  const getIconColor = (tabName: string) => {
    return activeTab === tabName ? UI_CONFIG.COLORS.coral : UI_CONFIG.COLORS.text.secondary;
  };

  const getTextColor = (tabName: string) => {
    return activeTab === tabName ? 'accent' : 'text.secondary';
  };

  const TabItem: React.FC<{
    name: string;
    iconName: keyof typeof Ionicons.glyphMap;
    label: string;
    showBadge?: boolean;
    badgeCount?: number;
  }> = ({ name, iconName, label, showBadge, badgeCount }) => (
    <TouchableOpacity style={tabItemStyle}>
      <View style={showBadge ? cartIconContainer : {}}>
        <Ionicons
          name={iconName}
          size={24}
          color={getIconColor(name)}
        />
        {showBadge && badgeCount! > 0 && (
          <View style={cartBadgeStyle}>
            <Text style={{ color: 'white', fontSize: getScaledFontSize(10), fontWeight: '600' }}>
              {badgeCount! > 99 ? '99+' : badgeCount}
            </Text>
          </View>
        )}
      </View>
      <Text
        variant="caption"
        color={getTextColor(name)}
        style={{
          fontSize: getScaledFontSize(10),
          marginTop: 1, // Reduced from 2px to 1px
          fontWeight: activeTab === name ? '600' : '400'
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={containerStyle}>
      <TabItem
        name="search"
        iconName="search-outline"
        label="Search"
      />

      <TabItem
        name="favorites"
        iconName="heart-outline"
        label="Favorites"
      />

      <TabItem
        name="cart"
        iconName="bag-outline"
        label="Cart"
        showBadge={true}
        badgeCount={cartItemCount}
      />

      <TabItem
        name="account"
        iconName="person-outline"
        label="Account"
      />
    </View>
  );
};