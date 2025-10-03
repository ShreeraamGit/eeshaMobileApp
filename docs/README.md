# 📚 Eesha Mobile App - Documentation

## 🚀 **Quick Start (Start Here!)**

**New to this project?** Follow these steps:

1. **[Setup Guide](./setup/01-quick-start.md)** ⭐ **START HERE** (30 minutes)
   - Database setup
   - API keys configuration
   - First product creation

2. **[Variants Guide](./guides/variants-implementation.md)** 📦
   - Understanding size/color variants
   - Stock management
   - Cart integration

3. **[Admin Dashboard](./setup/02-admin-dashboard.md)** 🖥️
   - Next.js setup
   - Product management
   - Order fulfillment

4. **[Project Plan](./planning/4-week-roadmap.md)** 📅
   - 4-week timeline
   - Daily tasks
   - Success metrics

---

## 📁 **Documentation Structure**

```
docs/
├── README.md                    # This file - start here
│
├── setup/                       # Setup & Configuration
│   ├── 01-quick-start.md       # 30-min setup guide
│   ├── 02-admin-dashboard.md   # Next.js admin setup
│   └── database-schema.sql     # Production schema with variants
│
├── guides/                      # Implementation Guides
│   ├── variants-implementation.md  # Product variants guide
│   ├── authentication.md           # Auth implementation
│   ├── payments.md                 # Stripe integration
│   └── deployment.md               # Deployment guide
│
├── planning/                    # Project Planning
│   ├── 4-week-roadmap.md       # Detailed timeline
│   └── gantt-chart.md          # Visual timeline
│
└── archive/                     # Old/Reference Files
    └── [old documentation]
```

---

## 🎯 **What You Have**

### **✅ Backend Services (Pre-built)**
- `src/services/supabase.ts` - Supabase client
- `src/services/auth/authService.ts` - Authentication
- `src/services/api/productsService.ts` - Products CRUD
- `src/services/api/variantsService.ts` - Variants management
- `src/services/api/ordersService.ts` - Orders & tracking
- `src/services/payment/stripeService.ts` - Stripe payments

### **✅ State Management**
- `src/store/authStore.ts` - Auth state (Zustand)
- `src/store/cartStore.ts` - Cart with variants (Zustand + MMKV)

### **✅ Database Schema**
- Products with variants (size/color)
- Individual stock tracking
- Auto stock reduction
- Order tracking system
- French VAT (20%) support

---

## 🔑 **Key Features**

### **Product Variants**
```
Product (Parent)
├── name, description, base_price
└── Variants (Size × Color)
    ├── SKU: "SAREE-M-RED"
    ├── Stock: 15 units
    ├── Price: optional override
    └── Image: color-specific
```

### **Cart System**
- Variant-based (not product-based)
- Includes size, color, SKU
- Stock validation per variant
- MMKV persistence + cloud sync

### **Stock Management**
- Individual tracking per variant
- Auto reduction on payment
- Low stock alerts
- Reservation system (30 min hold)

---

## 📋 **Quick Reference**

### **Environment Variables**
```bash
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### **Key Commands**
```bash
# Mobile App
npm start              # Start Expo dev server
npm run ios            # Run on iOS
npm test               # Run tests

# Admin Dashboard (create on Day 4)
npx create-next-app@latest eesha-admin
cd eesha-admin && npm run dev
```

### **Common Queries**
```typescript
// Get product with variants
const product = await variantsService.getProductWithVariants(id);

// Get specific variant
const variant = await variantsService.getVariant(productId, 'M', 'Rouge');

// Check stock
const hasStock = await variantsService.checkStock(variantId, quantity);

// Add to cart
addItem({
  variant_id: variant.id,
  size: 'M',
  color: 'Rouge',
  sku: 'SAR-M-RED',
  ...
});
```

---

## 📅 **4-Week Timeline**

| Week | Focus | Goal |
|------|-------|------|
| **Week 1** | Foundation | Backend + Auth + Products + Variants |
| **Week 2** | Payments | Checkout + Stripe + Orders |
| **Week 3** | Polish | Tracking + French + Optimization |
| **Week 4** | Launch | Deployment + App Store |

**Current Status:** Week 1, Day 1 - Database Setup ✓

---

## ✅ **Today's Checklist**

- [ ] Read [Quick Start Guide](./setup/01-quick-start.md)
- [ ] Run database schema
- [ ] Add 1 test product with variants
- [ ] Configure API keys
- [ ] Test app connection

---

## 🚨 **Common Issues**

**SQL Error?**
→ Use `setup/database-schema.sql` (production version)

**Variant Not Working?**
→ Check product exists before adding variants

**Can't Connect?**
→ Verify API keys in `.env` file

**Stock Issues?**
→ Read `guides/variants-implementation.md`

---

## 📞 **Support Resources**

- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs
- **React Native**: https://reactnative.dev
- **Next.js**: https://nextjs.org/docs

---

## 🎯 **Success Criteria**

**By End of Week 1:**
- ✅ Database configured with variants
- ✅ Auth working (login/register)
- ✅ Products displaying with variants
- ✅ Cart functional with size/color
- ✅ Admin dashboard started

**By End of Week 4:**
- ✅ App submitted to App Store
- ✅ Payment processing working
- ✅ Order tracking functional
- ✅ 10+ beta users testing

---

## 📚 **Additional Resources**

### **Architecture Docs**
- API Design (archived)
- Migration Guide (for multi-vendor later)
- Database Schema Documentation

### **Learning Path**
1. Supabase fundamentals
2. React Query patterns
3. Stripe integration
4. EAS deployment

---

**Next Step:** Open [Quick Start Guide](./setup/01-quick-start.md) and begin! 🚀
