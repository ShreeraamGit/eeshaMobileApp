import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card } from '@/components/common/Card';
import { Text, PriceText } from '@/components/common/Text';
import { PrimaryButton } from '@/components/common/Button';
import { UI_CONFIG, ECOMMERCE_CONFIG, BUSINESS_CONFIG } from '@/config/constants';
import { Cart } from '@/types';

interface CartSummaryProps {
  cart: Cart;
  onCheckout: () => void;
  loading?: boolean;
  style?: ViewStyle;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onCheckout,
  loading = false,
  style,
}) => {
  const summaryConfig = ECOMMERCE_CONFIG.cart.summary;

  const containerStyle: ViewStyle = {
    padding: summaryConfig.padding,
    gap: summaryConfig.gap,
    borderTopWidth: 1,
    borderTopColor: UI_CONFIG.COLORS.border.light,
    backgroundColor: UI_CONFIG.COLORS.background.default,
    ...style,
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const totalRowStyle: ViewStyle = {
    ...rowStyle,
    paddingTop: UI_CONFIG.SPACING[2], // 16px
    borderTopWidth: 1,
    borderTopColor: UI_CONFIG.COLORS.border.light,
    marginTop: UI_CONFIG.SPACING[1], // 8px
  };

  return (
    <View style={containerStyle}>
      {/* Subtotal */}
      <View style={rowStyle}>
        <Text variant="body-regular" color="text.secondary">
          Sous-total
        </Text>
        <PriceText size="regular">
          €{cart.subtotal.toFixed(2)}
        </PriceText>
      </View>

      {/* VAT */}
      <View style={rowStyle}>
        <Text variant="body-regular" color="text.secondary">
          TVA ({(BUSINESS_CONFIG.VAT_RATE * 100).toFixed(0)}%)
        </Text>
        <PriceText size="regular">
          €{cart.vat_amount.toFixed(2)}
        </PriceText>
      </View>

      {/* Shipping */}
      <View style={rowStyle}>
        <Text variant="body-regular" color="text.secondary">
          Livraison
        </Text>
        <PriceText size="regular">
          €{cart.shipping_amount.toFixed(2)}
        </PriceText>
      </View>

      {/* Total */}
      <View style={totalRowStyle}>
        <Text variant="h6">
          Total
        </Text>
        <PriceText size="large">
          €{cart.total.toFixed(2)}
        </PriceText>
      </View>

      {/* Checkout Button */}
      <PrimaryButton
        title="Procéder au paiement"
        size="large"
        fullWidth
        onPress={onCheckout}
        loading={loading}
        style={{ marginTop: UI_CONFIG.SPACING[2] }} // 16px
      />

      {/* Additional Info */}
      <Text
        variant="caption"
        color="text.secondary"
        style={{ textAlign: 'center', marginTop: UI_CONFIG.SPACING[1] }}
      >
        Livraison gratuite pour les commandes de plus de €100
      </Text>
    </View>
  );
};