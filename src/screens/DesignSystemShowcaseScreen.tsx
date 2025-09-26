import React, { useState } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Button,
  Card,
  Input,
  Badge,
  SaleBadge,
  NewBadge,
  BestsellerBadge,
  LimitedBadge,
  ExclusiveBadge,
  OutOfStockBadge,
} from '@/components/common';
import { UI_CONFIG } from '@/config/constants';

export const DesignSystemShowcaseScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);

  const sectionStyle: ViewStyle = {
    marginBottom: UI_CONFIG.SPACING[6], // 48px
    padding: UI_CONFIG.SPACING[3], // 24px
  };

  const titleStyle: ViewStyle = {
    marginBottom: UI_CONFIG.SPACING[4], // 32px
    paddingBottom: UI_CONFIG.SPACING[2], // 16px
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.border.light,
  };

  const componentRowStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONFIG.SPACING[2], // 16px
    marginBottom: UI_CONFIG.SPACING[3], // 24px
  };

  const textGridStyle: ViewStyle = {
    flexDirection: 'column',
    gap: UI_CONFIG.SPACING[2], // 16px
    marginBottom: UI_CONFIG.SPACING[3], // 24px
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: UI_CONFIG.COLORS.background.default }}>
      <ScrollView contentContainerStyle={{ paddingBottom: UI_CONFIG.SPACING[8] }}>

        {/* Header */}
        <View style={sectionStyle}>
          <Text variant="h1" color="text.primary">Design System Showcase</Text>
          <Text variant="body-regular" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[2] }}>
            Complete overview of all design system components and their variants
          </Text>
        </View>

        {/* Typography Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Updated Typography System (From Figma)</Text>
            <Text variant="body-small" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              Primary font changed from Agne to Tenor Sans based on Figma design
            </Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Font Family Updates</Text>
          <View style={textGridStyle}>
            <Text variant="body-regular" style={{ fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.primary }}>
              Primary: {UI_CONFIG.TYPOGRAPHY.fonts.primary} (✅ Loaded from Google Fonts)
            </Text>
            <Text variant="body-regular" style={{ fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.secondary }}>
              Secondary: {UI_CONFIG.TYPOGRAPHY.fonts.secondary}
            </Text>
            <Text variant="body-regular" style={{ fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.display }}>
              Display: {UI_CONFIG.TYPOGRAPHY.fonts.display} (Large headings)
            </Text>
            <Text variant="body-regular" style={{ fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.body }}>
              Body: {UI_CONFIG.TYPOGRAPHY.fonts.body} (Alternative body text)
            </Text>
            <Text variant="body-regular" style={{ fontFamily: UI_CONFIG.TYPOGRAPHY.fonts.modern }}>
              Modern: {UI_CONFIG.TYPOGRAPHY.fonts.modern} (Accent font)
            </Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Font Test - Tenor Sans in Action</Text>
          <View style={{
            padding: UI_CONFIG.SPACING[3],
            backgroundColor: UI_CONFIG.COLORS.background.secondary,
            borderRadius: 12,
            marginBottom: UI_CONFIG.SPACING[3]
          }}>
            <Text variant="h4" style={{ fontFamily: 'Tenor Sans', marginBottom: UI_CONFIG.SPACING[2] }}>
              Tenor Sans H4 Heading
            </Text>
            <Text variant="body-regular" style={{ fontFamily: 'Tenor Sans', marginBottom: UI_CONFIG.SPACING[2] }}>
              This text uses Tenor Sans font loaded from Google Fonts. Notice the elegant, readable styling that matches the Figma design system.
            </Text>
            <Text variant="product-title" style={{ fontFamily: 'Tenor Sans', color: UI_CONFIG.COLORS.coral }}>
              Elegant Silk Saree Collection
            </Text>
          </View>

          <View style={textGridStyle}>
            {/* Display */}
            <Text variant="display-large">Display Large - Hero Text</Text>
            <Text variant="display-medium">Display Medium - Main Headlines</Text>
            <Text variant="display-small">Display Small - Section Headers</Text>

            {/* Headings */}
            <Text variant="h1">H1 - Page Title</Text>
            <Text variant="h2">H2 - Section Title</Text>
            <Text variant="h3">H3 - Subsection Title</Text>
            <Text variant="h4">H4 - Component Title</Text>
            <Text variant="h5">H5 - Card Title</Text>
            <Text variant="h6">H6 - Minor Heading</Text>

            {/* Body Text */}
            <Text variant="body-large">Body Large - Important content</Text>
            <Text variant="body-regular">Body Regular - Standard text</Text>
            <Text variant="body-small">Body Small - Secondary info</Text>

            {/* Price Text */}
            <Text variant="price-large" color="text.price">€99.99 - Large Price</Text>
            <Text variant="price-regular" color="text.price">€49.99 - Regular Price</Text>
            <Text variant="price-small" color="text.price">€29.99 - Small Price</Text>
            <Text variant="price-sale" color="text.secondary">€59.99 - Sale Price</Text>

            {/* Product Text */}
            <Text variant="product-title">Elegant Silk Saree - Product Title</Text>
            <Text variant="product-description" color="text.secondary">
              Beautiful handcrafted saree with intricate designs - Product Description
            </Text>

            {/* Button Text */}
            <Text variant="button-large">BUTTON LARGE TEXT</Text>
            <Text variant="button-regular">Button Regular Text</Text>
            <Text variant="button-small">Button Small</Text>

            {/* Utility Text */}
            <Text variant="category-title">Category Title - Fashion</Text>
            <Text variant="search-placeholder" color="text.disabled">Search placeholder text</Text>
            <Text variant="label" color="text.secondary">FORM LABEL</Text>
            <Text variant="caption" color="text.secondary">Caption text for additional info</Text>
            <Text variant="overline" color="text.secondary">OVERLINE TEXT</Text>
            <Text variant="badge" color="text.primary">BADGE TEXT</Text>
          </View>
        </Card>

        {/* Button Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Buttons (4 Variants × 3 Sizes)</Text>
          </View>

          {/* Primary Buttons */}
          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Primary Buttons</Text>
          <View style={componentRowStyle}>
            <Button title="Large Primary" size="large" variant="primary" />
            <Button title="Medium Primary" size="medium" variant="primary" />
            <Button title="Small Primary" size="small" variant="primary" />
          </View>

          {/* Secondary Buttons */}
          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Secondary Buttons</Text>
          <View style={componentRowStyle}>
            <Button title="Large Secondary" size="large" variant="secondary" />
            <Button title="Medium Secondary" size="medium" variant="secondary" />
            <Button title="Small Secondary" size="small" variant="secondary" />
          </View>

          {/* Ghost Buttons */}
          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Ghost Buttons</Text>
          <View style={componentRowStyle}>
            <Button title="Large Ghost" size="large" variant="ghost" />
            <Button title="Medium Ghost" size="medium" variant="ghost" />
            <Button title="Small Ghost" size="small" variant="ghost" />
          </View>

          {/* Danger Buttons */}
          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Danger Buttons</Text>
          <View style={componentRowStyle}>
            <Button title="Large Danger" size="large" variant="danger" />
            <Button title="Medium Danger" size="medium" variant="danger" />
            <Button title="Small Danger" size="small" variant="danger" />
          </View>

          {/* Button States */}
          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Button States</Text>
          <View style={componentRowStyle}>
            <Button title="Loading" loading={true} />
            <Button title="Disabled" disabled={true} />
            <Button title="Full Width" fullWidth={true} />
          </View>
        </Card>

        {/* Input Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Input Components</Text>
          </View>

          <Input
            label="Standard Input"
            placeholder="Enter your text here"
            value={inputValue}
            onChangeText={setInputValue}
            helperText="This is helper text"
          />

          <Input
            label="Input with Error"
            placeholder="Enter invalid text"
            value="invalid@"
            error="Please enter a valid email address"
          />

          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            value="Cannot edit this"
            disabled={true}
          />
        </Card>

        {/* Badge Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">E-commerce Badges</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Badge Types</Text>
          <View style={componentRowStyle}>
            <SaleBadge />
            <NewBadge />
            <BestsellerBadge />
            <LimitedBadge />
            <ExclusiveBadge />
            <OutOfStockBadge />
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Custom Badge Text</Text>
          <View style={componentRowStyle}>
            <Badge type="sale" text="50% OFF" />
            <Badge type="new" text="NOUVEAU" />
            <Badge type="bestseller" text="TOP VENTE" />
          </View>
        </Card>

        {/* Card Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Card Components</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Default Card with Shadow</Text>
          <Card style={{ marginBottom: UI_CONFIG.SPACING[3] }}>
            <Text variant="h6">Card Title</Text>
            <Text variant="body-regular" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              This is a card with default styling including shadow and padding.
            </Text>
          </Card>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Card without Shadow</Text>
          <Card shadow={false} style={{ backgroundColor: UI_CONFIG.COLORS.background.secondary }}>
            <Text variant="h6">No Shadow Card</Text>
            <Text variant="body-regular" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              This card has no shadow and custom background color.
            </Text>
          </Card>
        </Card>

        {/* Colors Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Updated Color Palette (From Figma)</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>New Accent Colors</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: UI_CONFIG.SPACING[2], marginBottom: UI_CONFIG.SPACING[3] }}>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.coral, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 120 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Coral</Text>
              <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>#dd8560</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.golden, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 120 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Golden</Text>
              <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>#f9a000</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.saleRed, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 120 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Sale Red</Text>
              <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>#ed0006</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.vibrantOrange, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 120 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Vibrant Orange</Text>
              <Text variant="caption" style={{ color: '#FFFFFF', fontSize: 10 }}>#ff5e00</Text>
            </View>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Updated E-commerce Colors</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: UI_CONFIG.SPACING[2], marginBottom: UI_CONFIG.SPACING[3] }}>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.ecommerce.sale, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 100 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Sale</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.ecommerce.newArrival, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 100 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>New</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.ecommerce.trending, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 100 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Trending</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.ecommerce.exclusive, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 100 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Exclusive</Text>
            </View>
            <View style={{ backgroundColor: UI_CONFIG.COLORS.ecommerce.limitedStock, padding: UI_CONFIG.SPACING[2], borderRadius: 8, minWidth: 100 }}>
              <Text variant="caption" style={{ color: '#FFFFFF' }}>Limited</Text>
            </View>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Text Colors</Text>
          <View style={textGridStyle}>
            <Text variant="body-regular" color="text.primary">Primary Text Color</Text>
            <Text variant="body-regular" color="text.secondary">Secondary Text Color</Text>
            <Text variant="body-regular" color="text.disabled">Disabled Text Color</Text>
            <Text variant="body-regular" color="text.link">Link Text Color</Text>
            <Text variant="body-regular" color="text.price">Price Text Color</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Feedback Colors</Text>
          <View style={textGridStyle}>
            <Text variant="body-regular" color="feedback.success">Success Message</Text>
            <Text variant="body-regular" color="feedback.warning">Warning Message</Text>
            <Text variant="body-regular" color="feedback.error">Error Message</Text>
            <Text variant="body-regular" color="feedback.info">Info Message</Text>
            <Text variant="body-regular" color="feedback.neutral">Neutral Message</Text>
          </View>
        </Card>

        {/* Spacing Showcase */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Updated Spacing System (From Figma)</Text>
            <Text variant="body-small" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              8px grid system maintained with additional Figma-specific spacing values
            </Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Standard 8px Grid</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: UI_CONFIG.SPACING[3] }}>
            {([0, 1, 2, 3, 4, 5, 6] as const).map(key => {
              const spacingValue = UI_CONFIG.SPACING[key];
              return (
                <View key={key} style={{ alignItems: 'center' }}>
                  <View style={{
                    height: typeof spacingValue === 'number' ? spacingValue : 0,
                    width: 40,
                    backgroundColor: UI_CONFIG.COLORS.coral,
                    borderRadius: 2,
                    marginBottom: 4
                  }} />
                  <Text variant="caption" style={{ fontSize: 10 }}>
                    {key} ({typeof spacingValue === 'number' ? spacingValue : 0}px)
                  </Text>
                </View>
              );
            })}
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>Figma-Specific Spacing</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: UI_CONFIG.SPACING[3] }}>
            {Object.entries(UI_CONFIG.SPACING.figma).slice(0, 6).map(([key, value]) => (
              <View key={key} style={{ alignItems: 'center' }}>
                <View style={{
                  height: value as number,
                  width: 40,
                  backgroundColor: UI_CONFIG.COLORS.golden,
                  borderRadius: 2,
                  marginBottom: 4
                }} />
                <Text variant="caption" style={{ fontSize: 10 }}>{value}px</Text>
              </View>
            ))}
          </View>

          <Text variant="body-small" color="text.secondary">
            🟠 Orange bars = 8px grid system • 🟡 Yellow bars = Figma-specific values
          </Text>
        </Card>

        {/* Figma Components Recommendation */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">AI-Recommended Components</Text>
            <Text variant="body-small" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              Based on Figma design analysis, these components should be prioritized
            </Text>
          </View>

          <View style={{ gap: UI_CONFIG.SPACING[2] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: UI_CONFIG.SPACING[2] }}>
              <View style={{ width: 8, height: 8, backgroundColor: UI_CONFIG.COLORS.ecommerce.trending, borderRadius: 4 }} />
              <Text variant="body-regular"><Text style={{ fontWeight: '600' }}>ProductCard:</Text> Repeated product display pattern detected</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: UI_CONFIG.SPACING[2] }}>
              <View style={{ width: 8, height: 8, backgroundColor: UI_CONFIG.COLORS.ecommerce.newArrival, borderRadius: 4 }} />
              <Text variant="body-regular"><Text style={{ fontWeight: '600' }}>NavigationBar:</Text> Common navigation pattern across screens</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: UI_CONFIG.SPACING[2] }}>
              <View style={{ width: 8, height: 8, backgroundColor: UI_CONFIG.COLORS.ecommerce.exclusive, borderRadius: 4 }} />
              <Text variant="body-regular"><Text style={{ fontWeight: '600' }}>Button Variants:</Text> Multiple button styles identified in designs</Text>
            </View>
          </View>

          <Text variant="h6" style={{ marginTop: UI_CONFIG.SPACING[4], marginBottom: UI_CONFIG.SPACING[2] }}>Detected User Flows</Text>
          <View style={{ gap: UI_CONFIG.SPACING[2] }}>
            <Text variant="body-regular">🔍 <Text style={{ fontWeight: '600' }}>Product Discovery:</Text> Browse → Filter → View Details</Text>
            <Text variant="body-regular">🛒 <Text style={{ fontWeight: '600' }}>Purchase Flow:</Text> Add to Cart → Checkout → Payment</Text>
          </View>
        </Card>

        {/* Summary */}
        <Card style={sectionStyle}>
          <View style={titleStyle}>
            <Text variant="h3" color="text.primary">Updated Design System Summary</Text>
            <Text variant="body-small" color="text.secondary" style={{ marginTop: UI_CONFIG.SPACING[1] }}>
              Changes implemented based on Figma AI analysis
            </Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>✅ Updated Elements</Text>
          <View style={{ gap: UI_CONFIG.SPACING[2], marginBottom: UI_CONFIG.SPACING[4] }}>
            <Text variant="body-regular">🎨 <Text variant="body-regular" style={{ fontWeight: '600' }}>Colors:</Text> Added 4 new accent colors from Figma (#dd8560, #f9a000, #ed0006, #ff5e00)</Text>
            <Text variant="body-regular">📝 <Text variant="body-regular" style={{ fontWeight: '600' }}>Typography:</Text> Primary font updated to Tenor Sans (from Agne)</Text>
            <Text variant="body-regular">📏 <Text variant="body-regular" style={{ fontWeight: '600' }}>Spacing:</Text> Added Figma-specific spacing values alongside 8px grid</Text>
            <Text variant="body-regular">🛒 <Text variant="body-regular" style={{ fontWeight: '600' }}>E-commerce Colors:</Text> Updated badge and accent colors to match Figma</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>🔧 Existing Components</Text>
          <View style={{ gap: UI_CONFIG.SPACING[2], marginBottom: UI_CONFIG.SPACING[4] }}>
            <Text variant="body-regular">✅ <Text variant="body-regular" style={{ fontWeight: '600' }}>Text Component:</Text> 27 typography variants implemented</Text>
            <Text variant="body-regular">✅ <Text variant="body-regular" style={{ fontWeight: '600' }}>Button Component:</Text> 4 variants × 3 sizes (12 combinations)</Text>
            <Text variant="body-regular">✅ <Text variant="body-regular" style={{ fontWeight: '600' }}>Card Component:</Text> Flexible with shadow support</Text>
            <Text variant="body-regular">✅ <Text variant="body-regular" style={{ fontWeight: '600' }}>Input Component:</Text> Validation, states, and icons</Text>
            <Text variant="body-regular">✅ <Text variant="body-regular" style={{ fontWeight: '600' }}>Badge Component:</Text> 6 e-commerce badge types</Text>
          </View>

          <Text variant="h6" style={{ marginBottom: UI_CONFIG.SPACING[2] }}>📋 Next Steps</Text>
          <View style={{ gap: UI_CONFIG.SPACING[2] }}>
            <Text variant="body-regular">⏳ Install Tenor Sans font in the project</Text>
            <Text variant="body-regular">⏳ Implement ProductCard component (AI recommended)</Text>
            <Text variant="body-regular">⏳ Create NavigationBar component (AI recommended)</Text>
            <Text variant="body-regular">⏳ Update existing screens to use new color tokens</Text>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};