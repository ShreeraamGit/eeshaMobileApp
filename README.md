# Eesha Silks Mobile App

A production-grade mobile e-commerce application built with React Native and Expo, featuring product variants (size/color), order tracking, and seamless payment processing.

## 🚀 Tech Stack

- **Frontend**: React Native with Expo SDK 50
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe with React Native integration
- **State Management**: React Query + Zustand
- **Navigation**: React Navigation 6
- **UI Framework**: React Native Elements
- **Type Safety**: TypeScript with strict configuration

## 📱 Features

### MVP (Phase 1)
- [x] Product catalog with variants (size/color)
- [x] Shopping cart with local persistence
- [x] Stripe payment integration
- [x] Order tracking system
- [x] User authentication
- [x] French VAT calculation (20%)
- [x] Self-fulfilled shipping (€10 flat rate)

### Future (Phase 2-3)
- [ ] Multi-vendor marketplace
- [ ] Advanced search & filtering
- [ ] Push notifications
- [ ] Vendor dashboard
- [ ] Analytics & reporting

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # API services & business logic
├── navigation/         # Navigation configuration
├── store/             # State management
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── config/            # App configuration
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eesha-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Environment Variables

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# App Configuration
EXPO_PUBLIC_APP_ENV=development
```

## 🗄️ Database Schema

The app uses Supabase PostgreSQL with the following key tables:

- `products` - Product information
- `product_variants` - Size/color combinations with stock
- `orders` - Order details with French VAT
- `order_tracking` - Tracking events for orders
- `carts` - Shopping cart persistence

See `/docs/database-schema.sql` for complete schema.

## 💳 Payment Flow

1. User adds products to cart (with variant selection)
2. Checkout calculates subtotal + 20% VAT + €10 shipping
3. Stripe Checkout processes payment
4. Order created with tracking number
5. Order fulfillment updates tracking status

## 📦 Deployment

### Preview Build
```bash
npm run build:preview
```

### Production Build
```bash
npm run build:android  # Android APK/AAB
npm run build:ios      # iOS IPA
```

### App Store Submission
```bash
npm run submit:android  # Google Play Store
npm run submit:ios      # Apple App Store
```

## 🧪 Testing

```bash
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run lint          # Run ESLint
npm run typecheck     # Run TypeScript check
```

## 📊 Performance Targets

| Metric | Target |
|--------|--------|
| Cold Start | <4s |
| API Response (P50) | <200ms |
| API Response (P99) | <800ms |
| Crash-free Rate | >98% |

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Storage**: Secure token storage with Expo SecureStore
- **API**: Row Level Security (RLS) policies
- **Payments**: PCI DSS compliant via Stripe
- **HTTPS**: Enforced via Cloudflare

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: API level 21+ (Android 5.0)
- **Web**: Modern browsers (development only)

## 🚀 Getting Started (Next Steps)

1. **Setup Supabase Project**
   - Create new project at supabase.com
   - Run database migrations
   - Configure RLS policies

2. **Setup Stripe Account**
   - Create Stripe account
   - Get publishable/secret keys
   - Configure webhooks

3. **Run Initial Data Migration**
   ```bash
   npm run migrate:products  # Import initial product catalog
   ```

4. **Start Development**
   ```bash
   npm start
   ```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guidelines](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@eeshasilks.com
- Documentation: [docs.eeshasilks.com](https://docs.eeshasilks.com)