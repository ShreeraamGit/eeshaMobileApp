# Figma Design Implementation Guide

## Design Overview

**Design File:** Fashion App - UI/UX Design (Community)
**File Key:** x11gEftwJ1fbZLm6XxmC09
**Last Updated:** October 2, 2025
**Total Screens:** 35

This is a comprehensive fashion e-commerce mobile application with a minimalist, editorial design aesthetic. The design emphasizes clean lines, strong typography, high-quality imagery, and an elegant user experience.

---

## Design Principles

### Visual Style
- **Aesthetic:** Minimalist, clean, elegant fashion e-commerce
- **Brand Personality:** Sophisticated, modern, accessible luxury
- **Key Characteristics:**
  - Sharp, clean lines with zero border radius (all elements use sharp corners)
  - Strong black and white contrast as primary palette
  - Warm accent colors (browns, creams) for highlights and CTAs
  - Editorial-style typography with Agne display font
  - High-quality product photography with 3:4 aspect ratio
  - Generous white space for breathing room
  - Clear visual hierarchy throughout

---

## Design System

### Color Palette

#### Primary Colors
```json
{
  "black-100": "#000000",  // Primary brand, text, buttons
  "black-90": "#111111",
  "black-80": "#1a1a1a",
  "black-70": "#2b2b2b",
  "black-60": "#333333"
}
```

#### Neutrals
```json
{
  "gray-100": "#555555",  // Secondary text
  "gray-80": "#727272",
  "gray-70": "#888888",
  "gray-60": "#909090",
  "gray-40": "#aaaaaa",   // Disabled states
  "gray-30": "#b3b3b3",
  "gray-20": "#c4c4c4",
  "gray-15": "#d4d4d4",   // Borders
  "gray-10": "#dadada",
  "gray-5": "#dedede"
}
```

#### Backgrounds
```json
{
  "white": "#ffffff",
  "off-white-100": "#fcfcfc",  // Page backgrounds
  "off-white-95": "#f9f9f9",
  "off-white-90": "#f8f8f8",
  "off-white-85": "#f5f5f5",
  "cream-light": "#f8f0e7",    // Warm backgrounds
  "cream-medium": "#e0cfba"
}
```

#### Accent Colors
```json
{
  "warm-primary": "#dd8560",   // Primary accent
  "warm-dark": "#a8715a",
  "warm-light": "#e0cfba",
  "red": "#ed0006",            // Sale badges
  "orange": "#ff5e00",
  "amber": "#f9a000",          // New badges
  "purple": "#6d6dbb"
}
```

#### Semantic Colors
```json
{
  "text-primary": "#000000",
  "text-secondary": "#555555",
  "text-tertiary": "#888888",
  "text-disabled": "#aaaaaa",
  "text-inverse": "#ffffff",
  "border-light": "#e7eaef",
  "border-medium": "#d4d4d4",
  "border-dark": "#888888",
  "success": "#212806",
  "error": "#ed0006",
  "warning": "#f9a000",
  "info": "#6d6dbb"
}
```

### Typography

#### Font Families
- **Primary:** Tenor Sans (body text, UI elements)
- **Display:** Agne (hero headers, large displays)
- **Secondary:** Poppins (long-form content)
- **Product Info:** Montserrat (brand names, product titles)
- **System:** SF Pro Display (iOS native)

#### Typography Scale

**Display (Agne)**
- `display-xlarge`: 162.7px / 400 / 244.05 LH - Hero headers
- `display-large`: 41.86px / 400 / 62.79 LH - Section headers
- `display-medium`: 38.65px / 400 / 43.48 LH - Page titles
- `display-small`: 36px / 400 / 43.48 LH - Collection headers

**Headings (Tenor Sans)**
- `h1`: 18px / 400 / 40 LH - Main headings
- `h2`: 16px / 400 / 24 LH - Section headings
- `h3`: 15px / 400 / 24 LH - Subsection headings
- `h4`: 14px / 400 / 20 LH - Card headings

**Body (Tenor Sans & Poppins)**
- `body-large`: 16px Poppins / 400 / 26 LH - Descriptions
- `body-medium`: 14px Tenor Sans / 400 / 20 LH - Standard text
- `body-small`: 13px Tenor Sans / 400 / 20 LH - Captions
- `body-xsmall`: 12px Tenor Sans / 400 / 16 LH - Fine print

**UI Elements (Tenor Sans)**
- `ui-button`: 14px / 400 / 20 LH - Buttons, CTAs
- `ui-label`: 12px / 400 / 16 LH - Form labels, tags
- `ui-caption`: 10px / 400 / 12 LH - Helper text

**Product (Montserrat)**
- `product-brand`: 12px / 700 / 13.96 LH - Brand names
- `product-title`: 12px / 400 / 15.71 LH - Product titles
- `product-price`: 14px / 400 / 22 LH - Prices

### Spacing System

**Base Scale (8px base unit)**
```
0: 0px
1: 2px
2: 4px
3: 8px
4: 12px
5: 16px
6: 20px
7: 24px
8: 32px
9: 40px
10: 48px
11: 64px
12: 80px
```

**Component Spacing**
- `xs`: 4px - Tight spacing
- `sm`: 8px - Small gaps
- `md`: 16px - Standard gaps
- `lg`: 24px - Large gaps
- `xl`: 32px - Section spacing
- `xxl`: 48px - Major sections

**Layout Spacing**
- `container`: 16px - Container padding
- `section`: 24px - Section spacing
- `page`: 32px - Page margins

### Border Radius
- `none`: 0px - Default for all elements (sharp corners)
- `sm`: 4px - Optional for small elements
- `md`: 8px - Optional for medium elements
- `lg`: 12px - Optional for large elements
- `xl`: 16px - Optional for very large elements
- `full`: 9999px - Pills and circles

**Note:** The design uses zero border radius throughout for a sharp, editorial look.

### Shadows

```json
{
  "sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
  "md": "0 4px 6px -1px rgba(0,0,0,0.1)",
  "lg": "0 10px 15px -3px rgba(0,0,0,0.1)",
  "xl": "0 20px 25px -5px rgba(0,0,0,0.1)"
}
```

### Breakpoints & Grid

**Responsive Breakpoints**
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

**Grid System**
- Columns: 12
- Gutter: 16px
- Margin: 16px

---

## Component Library

### Core Components

#### 1. Header
**Variants:** default, search-active, transparent
**Elements:** logo, search icon, cart icon, menu icon
**Behavior:** Sticky on scroll, collapses search on mobile

**Specs:**
- Height: 56px
- Background: #ffffff
- Border bottom: 1px solid #e7eaef
- Logo: Centered or left-aligned
- Icons: 24x24px, #000000

#### 2. ProductCard
**Variants:** grid, list, featured
**Elements:** image, brand, title, price, wishlist, color swatches

**Specs:**
- Image aspect ratio: 3:4
- Border radius: 0px
- Shadow: sm
- Padding: 0px (image), 12px (content)
- Wishlist icon: Top-right, 32x32px tap target
- Brand: Montserrat 12px / 700
- Title: Montserrat 12px / 400
- Price: Montserrat 14px / 400

#### 3. Button
**Variants:** primary, secondary, ghost

**Primary:**
- Background: #000000
- Text: #ffffff
- Height: 48px
- Padding: 12px 24px
- Border radius: 0px
- Font: Tenor Sans 14px / 400

**Secondary:**
- Background: transparent
- Text: #000000
- Border: 1px solid #000000
- Height: 48px
- Padding: 12px 24px
- Border radius: 0px

**Ghost:**
- Background: transparent
- Text: #000000
- Border: none
- Height: 48px
- Padding: 12px 24px

#### 4. Input Field
**Specs:**
- Height: 48px
- Padding: 12px 16px
- Border: 1px solid #e7eaef
- Focus border: 1px solid #000000
- Border radius: 0px
- Font: Tenor Sans 14px / 400
- Placeholder: #aaaaaa

#### 5. Navigation Menu
**Variants:** menu, menu-expanded, bottom-nav
**Elements:** categories, links, social icons
**Behavior:** Slide-in animation (300ms ease-out), category expansion

**Specs:**
- Width: 80% viewport (mobile)
- Background: #ffffff
- Animation: slide-in from left
- Category items: 48px height, 16px padding
- Font: Tenor Sans 16px / 400

#### 6. SearchBar
**Variants:** default, focused, with-results
**Elements:** input, search icon, clear button, suggestions
**Behavior:** Expand on focus, show recent searches, live suggestions

### E-commerce Components

#### 7. ProductDetail
**Sections:** images, info, size-selector, add-to-cart, details, recommendations

**Image Gallery:**
- Full-width carousel
- Indicator dots: 8px, #000000/#e7eaef
- Swipe gesture enabled
- Pinch to zoom

**Size Selector:**
- Button grid: 48x48px per size
- Selected: #000000 background, #ffffff text
- Unselected: transparent background, #000000 border

**Add to Cart:**
- Full-width primary button
- Fixed at bottom on mobile
- Text: "ADD TO BASKET"

#### 8. CartItem
**Elements:** thumbnail, details, quantity stepper, price, remove
**Behavior:** Swipe to remove, quantity stepper

**Specs:**
- Height: 120px
- Thumbnail: 80x106px (3:4 ratio)
- Quantity stepper: -/+ buttons, 32x32px
- Remove icon: Top-right, red on hover

#### 9. CartSummary
**Elements:** subtotal, shipping, discount, total, checkout CTA
**Behavior:** Live updates on quantity change

**Specs:**
- Background: #f9f9f9
- Padding: 16px
- Total font: Tenor Sans 18px / 700
- CTA: Full-width primary button

#### 10. CollectionCard
**Variants:** large, medium, small
**Elements:** full-bleed image, title overlay, subtitle, CTA

**Specs:**
- Aspect ratio: 4:5 or 16:9
- Text overlay: bottom 1/3
- Gradient overlay: linear-gradient(transparent, rgba(0,0,0,0.6))
- Title: Agne 36px / 400, #ffffff
- CTA: Ghost button, #ffffff

#### 11. FilterPanel
**Sections:** categories, price, size, color, brand
**Elements:** checkboxes, sliders, chips
**Behavior:** Slide-up modal, multi-select

**Specs:**
- Modal height: 70% viewport
- Border radius: 16px top corners
- Checkbox: 20x20px, #000000 when selected
- Apply button: Fixed bottom, primary style

### Content Components

#### 12. BlogCard
**Variants:** grid, list, featured
**Elements:** image, title, excerpt, date, author

**Specs:**
- Image aspect ratio: 16:9
- Padding: 0px (image), 16px (content)
- Title: Tenor Sans 16px / 400
- Excerpt: Tenor Sans 13px / 400, #555555
- Date: Tenor Sans 12px / 400, #888888

#### 13. HeroSection
**Variants:** full-screen, split, carousel
**Elements:** image, headline, subheading, CTA

**Specs:**
- Height: 80vh (full-screen)
- Headline: Agne 42px / 400, centered
- Subheading: Tenor Sans 14px / 400
- CTA: Secondary or ghost button

#### 14. BrandStrip
**Elements:** logo grid, horizontal scroll
**Behavior:** Auto-scroll or manual swipe

**Specs:**
- Logo size: 80x40px
- Spacing: 32px between logos
- Background: #f9f9f9 or transparent

### Feedback Components

#### 15. Toast Notification
**Variants:** success, error, info
**Elements:** icon, message, action
**Behavior:** Auto-dismiss after 3s, swipe to dismiss

**Specs:**
- Position: Top or bottom
- Background: #000000 (success), #ed0006 (error)
- Text: #ffffff
- Height: 56px
- Padding: 12px 16px

#### 16. EmptyState
**Variants:** cart, wishlist, search, 404
**Elements:** icon, heading, description, CTA

**Specs:**
- Icon: 80x80px, #aaaaaa
- Heading: Tenor Sans 18px / 400
- Description: Tenor Sans 14px / 400, #555555
- CTA: Primary or secondary button

#### 17. LoadingState
**Variants:** skeleton, spinner, shimmer
**Behavior:** Show while content loads

**Skeleton:**
- Background: #f5f5f5
- Shimmer: linear-gradient animation
- Animation: 1.5s ease-in-out infinite

---

## Screen Catalog

### 35 Total Screens Organized by Category

#### Navigation & Core (7 screens)
1. **home-page** - Main landing page with hero, collections, new arrivals
2. **menu** - Main navigation menu
3. **menu-expand** - Expanded menu with categories
4. **search** - Search interface
5. **search-recent** - Recent searches view
6. **search-view** - Search results
7. **full-screen** - Full screen image/content view

#### Product Discovery (5 screens)
8. **category-grid-view** - Product grid (2 columns)
9. **category-grid-view-full** - Full product grid
10. **category-listview** - Product list view
11. **product-detail** - Product detail page (layout 1)
12. **product-detail-layout2** - Product detail page (layout 2)

#### Shopping & Checkout (8 screens)
13. **cart** - Shopping cart with items
14. **cart-empty** - Empty cart state
15. **checkout** - Checkout flow
16. **add-new-address** - Address input form
17. **add-new-card** - Payment card form
18. **add-new-card-enter-name-state** - Card form with name input
19. **payment-success** - Order confirmation

#### Content & Brand (9 screens)
20. **collection** - Collections overview
21. **collection-detail** - Single collection detail
22. **blog-grid-view** - Blog grid layout
23. **blog-list-view** - Blog list layout
24. **blog-post** - Individual blog post
25. **our-story** - About/brand story page
26. **contact-us** - Contact form and info
27. **instagram-post-1** - Instagram post layout 1
28. **instagram-post-2** - Instagram post layout 2
29. **instagram-post-3** - Instagram post layout 3
30. **instagram-story-1** - Instagram story layout

#### Design System & Utility (5 screens)
31. **typography** - Typography reference
32. **color-guide** - Color palette reference
33. **icon** - Icon library
34. **404** - 404 error page
35. **cover** - Cover/splash screen

---

## User Flows

### 1. Product Discovery Flow
**Path:** home-page → category-grid-view → product-detail

**Key Interactions:**
1. Browse featured collections on home
2. Navigate to category via menu or collection card
3. Apply filters (price, size, color, brand)
4. Toggle between grid and list view
5. Sort products (newest, price, popularity)
6. Tap product card to view details
7. Add to wishlist (heart icon)

### 2. Purchase Flow
**Path:** product-detail → cart → checkout → payment-success

**Key Interactions:**
1. Select size from size selector
2. Choose color variant
3. Tap "ADD TO BASKET" button
4. View cart summary
5. Update quantities with +/- stepper
6. Remove items (swipe or icon)
7. Proceed to checkout
8. Enter/select shipping address
9. Enter/select payment method
10. Review order summary
11. Place order
12. View confirmation screen

### 3. Content Exploration Flow
**Path:** home-page → collection → blog-grid-view → blog-post

**Key Interactions:**
1. Scroll through collections on home
2. Tap collection card
3. View collection details with products
4. Browse to blog section
5. Toggle between grid/list view
6. Read blog post
7. Share or save content

### 4. Search Flow
**Path:** search → search-recent → search-view → product-detail

**Key Interactions:**
1. Tap search icon in header
2. View recent searches
3. Type search query
4. See live suggestions
5. View search results
6. Apply filters to results
7. Tap product to view details

---

## Interaction Patterns

### Gestures
- **Tap:** Select items, navigate, toggle states
- **Swipe horizontal:** Image galleries, product carousels
- **Swipe vertical:** Scroll content, remove cart items
- **Pull to refresh:** Reload product lists
- **Pinch to zoom:** Product images
- **Long press:** Quick actions (share, save)

### Animations

**Navigation (300ms ease-out)**
```css
.menu-slide-in {
  transform: translateX(-100%) → translateX(0);
  transition: 300ms ease-out;
}
```

**Product Cards (staggered 100ms)**
```css
.product-card-fade {
  opacity: 0 → 1;
  transform: translateY(20px) → translateY(0);
  transition: 300ms ease-out;
  transition-delay: calc(index * 100ms);
}
```

**Add to Cart (200ms bounce)**
```css
.add-to-cart-bounce {
  transform: scale(1) → scale(0.95) → scale(1);
  transition: 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

**Modal (250ms ease-in-out)**
```css
.modal-slide-up {
  transform: translateY(100%) → translateY(0);
  transition: 250ms ease-in-out;
}
```

### Feedback Patterns

**Visual Feedback:**
- Button press states (opacity 0.8)
- Loading indicators (skeleton, spinner)
- Disabled states (opacity 0.5)
- Focus states (border color change)

**Haptic Feedback:**
- Add to cart: Medium impact
- Remove item: Light impact
- Purchase success: Success notification
- Error: Error notification

**Toast Messages:**
- Success: Green background, 3s duration
- Error: Red background, 3s duration
- Info: Black background, 3s duration
- Swipe to dismiss

---

## Responsive Strategy

### Mobile (375px)
- Single column layout
- 2-column product grid
- Hamburger menu
- Bottom nav for key actions
- Stack all content vertically
- Full-width buttons
- Collapsible sections

### Tablet (768px)
- 2-3 column grid
- Sidebar navigation option
- Persistent header
- Larger typography
- Side-by-side cart summary

### Desktop (1024px+)
- Multi-column grid (3-4 products)
- Max-width container (1440px)
- Horizontal mega-menu
- Hover effects on products
- Desktop-optimized typography
- Sticky filters sidebar

---

## Accessibility Guidelines

### Color Contrast
- Maintain 4.5:1 ratio for normal text
- Maintain 3:1 ratio for large text (18px+)
- Use semantic colors for states

### Focus States
- Visible focus indicators (2px outline)
- Logical tab order
- Skip to content link
- Keyboard navigation support

### Screen Readers
- Semantic HTML structure
- ARIA labels for icons
- Alt text for all images
- Descriptive link text
- Form label associations

### Touch Targets
- Minimum 48x48px for all taps
- Adequate spacing between targets
- Accessible form controls
- Large enough CTAs

### Dynamic Type
- Support text scaling
- Use relative units (rem, em)
- Test at 200% zoom
- Flexible layouts

---

## Implementation Notes

### Technology Stack
- **Framework:** React Native with Expo SDK 50
- **State Management:** React Query (server) + Zustand (client)
- **Navigation:** React Navigation 6
- **UI Components:** Custom components following design system
- **Image Optimization:** Expo Image with caching
- **Forms:** React Hook Form with validation
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Stripe React Native SDK

### Font Loading
```typescript
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  'TenorSans-Regular': require('./assets/fonts/TenorSans-Regular.ttf'),
  'Agne-Regular': require('./assets/fonts/Agne-Regular.ttf'),
  'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
  'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
});
```

### Performance Optimization
- **FlatList:** Use for product grids with `initialNumToRender={10}`, `windowSize={5}`
- **Memoization:** Memo product cards, callbacks with useCallback
- **Image Loading:** Progressive loading, placeholder images
- **Code Splitting:** Lazy load screens, dynamic imports
- **Caching:** React Query 5-minute stale time, persistent cart

### State Management Patterns
```typescript
// Product data (React Query)
const { data: products } = useQuery({
  queryKey: ['products', category],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// Cart state (Zustand)
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
}));
```

### Offline Support
- Cache product images locally
- Persist cart to AsyncStorage
- Show offline indicators
- Queue actions when offline
- Sync when back online

---

## File Structure Reference

```
figma-ai-output/
├── design-system.json          # Complete design tokens
├── ai-insights.json           # Component patterns, flows, data structures
├── AI-IMPLEMENTATION-PROMPT.md # This file
├── figma-design-data.json     # Raw Figma data export
└── pages/                     # Individual screen JSONs
    ├── home-page.json
    ├── product-detail.json
    ├── cart.json
    ├── checkout.json
    ├── category-grid-view.json
    ├── search.json
    ├── menu.json
    ├── collection.json
    └── ... (35 total screens)
```

---

## Quick Start Implementation Checklist

### Phase 1: Setup & Foundation
- [ ] Set up React Native/Expo project
- [ ] Install and configure fonts (Tenor Sans, Agne, Montserrat, Poppins)
- [ ] Create design system constants file from design-system.json
- [ ] Set up navigation structure (stack + bottom tabs)
- [ ] Configure Supabase client
- [ ] Set up React Query and Zustand

### Phase 2: Core Components
- [ ] Build Text component with variants
- [ ] Build Button component (primary, secondary, ghost)
- [ ] Build Input component with validation
- [ ] Build ProductCard component (grid & list variants)
- [ ] Build Header component (sticky navigation)
- [ ] Build Navigation menu (slide-in drawer)

### Phase 3: Key Screens
- [ ] Implement HomeScreen with hero and collections
- [ ] Implement CategoryScreen with grid/list toggle
- [ ] Implement ProductDetailScreen with image gallery
- [ ] Implement CartScreen with quantity management
- [ ] Implement CheckoutScreen with forms
- [ ] Implement SearchScreen with suggestions

### Phase 4: E-commerce Features
- [ ] Implement add to cart functionality
- [ ] Build cart state management
- [ ] Implement wishlist feature
- [ ] Create filter and sort functionality
- [ ] Build size/color selector
- [ ] Integrate Stripe payments

### Phase 5: Content & Polish
- [ ] Implement collections feature
- [ ] Build blog screens
- [ ] Add animations (slide, fade, bounce)
- [ ] Implement loading states (skeleton, shimmer)
- [ ] Add empty states for cart/wishlist
- [ ] Implement error handling and toasts

### Phase 6: Optimization
- [ ] Optimize images (WebP, lazy loading)
- [ ] Add FlatList performance optimizations
- [ ] Implement offline support
- [ ] Add accessibility features
- [ ] Test on multiple devices
- [ ] Performance profiling and optimization

---

## Design System Import Example

```typescript
// @/config/design-system.ts
import designSystem from '../figma-ai-output/design-system.json';

export const colors = designSystem.colors;
export const typography = designSystem.typography;
export const spacing = designSystem.spacing;
export const shadows = designSystem.shadows;
export const components = designSystem.components;

// Usage in component
import { colors, typography, spacing } from '@/config/design-system';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgrounds.white,
    padding: spacing.layout.container,
  },
  title: {
    fontFamily: typography.fontFamilies.display,
    fontSize: typography.scale.heading.h1.size,
    lineHeight: typography.scale.heading.h1.lineHeight,
    color: colors.semantic.text.primary,
  },
  button: {
    height: components.button.variants.primary.height,
    backgroundColor: components.button.variants.primary.background,
    borderRadius: components.button.variants.primary.borderRadius,
  }
});
```

---

## Support & Resources

### Design Files
- **Figma URL:** https://www.figma.com/design/x11gEftwJ1fbZLm6XxmC09/Fashion-App---UI-UX-Design--Community-
- **Node ID:** 0-1
- **File Key:** x11gEftwJ1fbZLm6XxmC09

### JSON References
- `design-system.json` - All design tokens and component specs
- `ai-insights.json` - Component patterns, user flows, data structures
- `pages/*.json` - Detailed structure for each of 35 screens

### Implementation Resources
- React Native Documentation
- Expo Documentation
- React Navigation Documentation
- Figma Dev Mode for precise measurements
- Design system constants for programmatic access

---

**Last Updated:** October 2, 2025
**Version:** 2.0
**Total Screens Documented:** 35
**Design System Version:** 2.0
