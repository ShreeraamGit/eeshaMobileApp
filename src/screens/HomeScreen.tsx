import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text, Heading1, Heading2, BodyText, ProductTitle } from '@/components/common/Text';
import { Button, PrimaryButton, SecondaryButton } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { UI_CONFIG, ECOMMERCE_CONFIG, TEXT_STYLES } from '@/config/constants';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text variant="body-regular" color="text.primary">Menu</Text>
          </TouchableOpacity>
          <Heading2 color="primary">EESHA SILKS</Heading2>
          <TouchableOpacity>
            <Text variant="body-regular" color="text.primary">Cart</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Text variant="display-medium" color="primary" style={styles.heroTitle}>
              Making a luxurious lifestyle accessible for a generous group of women is our daily drive.
            </Text>
          </View>

          {/* Benefits Cards */}
          <View style={styles.benefitsContainer}>
            <Card style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text variant="h4" color="accent">🚚</Text>
              </View>
              <BodyText color="text.primary" style={styles.benefitText}>
                Fast shipping. Free on orders over €25.
              </BodyText>
            </Card>

            <Card style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text variant="h4" color="accent">♻️</Text>
              </View>
              <BodyText color="text.primary" style={styles.benefitText}>
                Sustainable process from start to finish.
              </BodyText>
            </Card>

            <Card style={styles.benefitCard}>
              <View style={styles.benefitIcon}>
                <Text variant="h4" color="accent">✨</Text>
              </View>
              <BodyText color="text.primary" style={styles.benefitText}>
                Unique designs and high-quality materials.
              </BodyText>
            </Card>
          </View>
        </View>

        {/* Product Showcase Section */}
        <View style={styles.productSection}>
          <Heading2 color="text.primary" style={styles.sectionTitle}>
            Featured Products
          </Heading2>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productCarousel}
          >
            {/* Product Card 1 */}
            <Card style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Badge
                  text="NEW"
                  variant="new"
                  style={styles.productBadge}
                />
                <View style={styles.productImagePlaceholder}>
                  <Text variant="caption" color="text.secondary">Product Image</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <ProductTitle color="text.primary">
                  Harris Tweed Three Button Jacket
                </ProductTitle>
                <Text variant="price-regular" style={{ color: UI_CONFIG.COLORS.coral }}>
                  €299.00
                </Text>
              </View>
            </Card>

            {/* Product Card 2 */}
            <Card style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Badge
                  text="SALE"
                  variant="sale"
                  style={styles.productBadge}
                />
                <View style={styles.productImagePlaceholder}>
                  <Text variant="caption" color="text.secondary">Product Image</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <ProductTitle color="text.primary">
                  Cashmere Blend Cropped Jacket SW1WJ285-AM
                </ProductTitle>
                <View style={styles.priceContainer}>
                  <Text variant="price-sale" color="text.secondary">
                    €199.00
                  </Text>
                  <Text variant="price-regular" style={{ color: UI_CONFIG.COLORS.ecommerce.sale }}>
                    €149.00
                  </Text>
                </View>
              </View>
            </Card>

            {/* Product Card 3 */}
            <Card style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <View style={styles.productImagePlaceholder}>
                  <Text variant="caption" color="text.secondary">Product Image</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <ProductTitle color="text.primary">
                  1WN Reversible Angora Cardigan
                </ProductTitle>
                <Text variant="price-regular" style={{ color: UI_CONFIG.COLORS.coral }}>
                  €179.00
                </Text>
              </View>
            </Card>
          </ScrollView>

          {/* Carousel Indicators */}
          <View style={styles.carouselIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
        </View>

        {/* Collections Section */}
        <View style={styles.collectionsSection}>
          <Heading2 color="text.primary" style={styles.sectionTitle}>
            Just for You
          </Heading2>

          <View style={styles.collectionsGrid}>
            <Card style={styles.collectionCard}>
              <View style={styles.collectionImagePlaceholder}>
                <Text variant="caption" color="text.secondary">Collection Image</Text>
              </View>
              <Text variant="category-title" color="text.primary" style={styles.collectionTitle}>
                October Collection
              </Text>
            </Card>

            <Card style={styles.collectionCard}>
              <View style={styles.collectionImagePlaceholder}>
                <Text variant="caption" color="text.secondary">Collection Image</Text>
              </View>
              <Text variant="category-title" color="text.primary" style={styles.collectionTitle}>
                Autumn Collection
              </Text>
            </Card>
          </View>
        </View>

        {/* Brand Showcase */}
        <View style={styles.brandSection}>
          <Heading2 color="text.primary" style={styles.sectionTitle}>
            Our Partners
          </Heading2>
          <View style={styles.brandLogos}>
            <View style={styles.brandLogo}>
              <Text variant="h4" color="text.secondary">BRAND 1</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text variant="h4" color="text.secondary">BRAND 2</Text>
            </View>
            <View style={styles.brandLogo}>
              <Text variant="h4" color="text.secondary">BRAND 3</Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <Heading2 color="text.primary" style={styles.ctaTitle}>
            Discover Our Collection
          </Heading2>
          <BodyText color="text.secondary" style={styles.ctaSubtitle}>
            Explore our latest sarees and ethnic wear
          </BodyText>
          <View style={styles.ctaButtons}>
            <PrimaryButton
              title="Shop Now"
              size="large"
              style={styles.ctaButton}
            />
            <SecondaryButton
              title="View Catalog"
              size="large"
              style={styles.ctaButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.background.default,
  },
  scrollContent: {
    paddingBottom: UI_CONFIG.SPACING[6], // 48px
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    paddingVertical: UI_CONFIG.SPACING[2], // 16px
    backgroundColor: UI_CONFIG.COLORS.background.default,
    borderBottomWidth: 1,
    borderBottomColor: UI_CONFIG.COLORS.border.light,
  },

  // Hero Section Styles
  heroSection: {
    backgroundColor: '#fcfcfc', // Matches Figma background
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    paddingVertical: UI_CONFIG.SPACING[6], // 48px
  },
  heroContent: {
    marginBottom: UI_CONFIG.SPACING[6], // 48px
  },
  heroTitle: {
    textAlign: 'center',
    fontSize: 36, // Matches Figma display size
    lineHeight: 44,
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  },

  // Benefits Section Styles
  benefitsContainer: {
    gap: UI_CONFIG.SPACING[3], // 24px
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: UI_CONFIG.SPACING[3], // 24px
    backgroundColor: UI_CONFIG.COLORS.background.default,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UI_CONFIG.SPACING[2], // 16px
  },
  benefitText: {
    flex: 1,
    fontSize: 14, // Matches Figma typography
  },

  // Product Section Styles
  productSection: {
    paddingVertical: UI_CONFIG.SPACING[6], // 48px
    backgroundColor: UI_CONFIG.COLORS.background.default,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING[4], // 32px
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
  },
  productCarousel: {
    paddingLeft: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    gap: UI_CONFIG.SPACING[3], // 24px
  },
  productCard: {
    width: 240,
    ...ECOMMERCE_CONFIG.product.card,
  },
  productImageContainer: {
    position: 'relative',
    aspectRatio: 3/4, // 3:4 ratio from Figma
    marginBottom: UI_CONFIG.SPACING[2], // 16px
  },
  productImagePlaceholder: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.background.secondary,
    borderRadius: ECOMMERCE_CONFIG.product.image.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productBadge: {
    position: 'absolute',
    top: ECOMMERCE_CONFIG.product.badge.position.top,
    right: ECOMMERCE_CONFIG.product.badge.position.right,
    zIndex: 1,
  },
  productInfo: {
    gap: UI_CONFIG.SPACING[1], // 8px
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_CONFIG.SPACING[1], // 8px
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: UI_CONFIG.SPACING[4], // 32px
    gap: UI_CONFIG.SPACING[1], // 8px
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_CONFIG.COLORS.border.light,
  },
  activeIndicator: {
    backgroundColor: UI_CONFIG.COLORS.coral,
  },

  // Collections Section Styles
  collectionsSection: {
    paddingVertical: UI_CONFIG.SPACING[6], // 48px
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    backgroundColor: '#fcfcfc',
  },
  collectionsGrid: {
    gap: UI_CONFIG.SPACING[3], // 24px
  },
  collectionCard: {
    padding: 0,
  },
  collectionImagePlaceholder: {
    height: 160,
    backgroundColor: UI_CONFIG.COLORS.background.secondary,
    borderTopLeftRadius: UI_CONFIG.COMPONENT_RADIUS.card,
    borderTopRightRadius: UI_CONFIG.COMPONENT_RADIUS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionTitle: {
    padding: UI_CONFIG.SPACING[3], // 24px
    textAlign: 'center',
  },

  // Brand Section Styles
  brandSection: {
    paddingVertical: UI_CONFIG.SPACING[6], // 48px
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    backgroundColor: UI_CONFIG.COLORS.background.default,
  },
  brandLogos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: UI_CONFIG.SPACING[3], // 24px
  },
  brandLogo: {
    flex: 1,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: UI_CONFIG.COLORS.background.secondary,
    borderRadius: UI_CONFIG.COMPONENT_RADIUS.card,
  },

  // CTA Section Styles
  ctaSection: {
    paddingVertical: UI_CONFIG.SPACING[8], // 64px
    paddingHorizontal: UI_CONFIG.LAYOUT_SPACING.page.mobile,
    backgroundColor: '#fcfcfc',
    alignItems: 'center',
  },
  ctaTitle: {
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING[2], // 16px
  },
  ctaSubtitle: {
    textAlign: 'center',
    marginBottom: UI_CONFIG.SPACING[4], // 32px
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: UI_CONFIG.SPACING[2], // 16px
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaButton: {
    minWidth: 140,
  },
});

export default HomeScreen;