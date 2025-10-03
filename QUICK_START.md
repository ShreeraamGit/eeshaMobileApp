# 🚀 QUICK START - Eesha Mobile App

## ⚡ **Get Started in 30 Minutes**

This guide will get you running with product variants and stock management.

---

## 📋 **Prerequisites**

- ✅ Node.js 18+ installed
- ✅ Expo CLI installed (`npm install -g expo-cli`)
- ✅ Stripe account (with test keys)
- ⚠️ Supabase account (create now if you don't have)

---

## 🚀 **4-Step Setup**

### **Step 1: Database Setup (10 min)**

```bash
1. Go to https://supabase.com/dashboard
2. Create new project: "eesha-mobile-app"
3. Region: Europe (Paris) - for France
4. Save your password!

5. Go to SQL Editor → New Query
6. Copy content from: docs/setup/database-schema.sql
7. Paste and click "Run"
8. Verify in Table Editor: 5 tables created ✓
```

### **Step 2: Add Test Product (5 min)**

```sql
-- In Supabase SQL Editor, run this:

-- STEP 1: Add product (run this first)
INSERT INTO products (name, description, base_price, category, images)
VALUES (
  'Saree Soie Premium',
  'Saree traditionnel en soie pure',
  299.99,
  'Sarees',
  ARRAY['https://picsum.photos/400/533?random=1']
)
RETURNING id;

-- ⚠️ COPY THE UUID FROM THE RESULT ABOVE (looks like: a1b2c3d4-e5f6-7890-abcd-ef1234567890)

-- STEP 2: Add variants (paste your product UUID below, replacing 'PASTE-YOUR-UUID-HERE')
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock_quantity)
VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'SAR-S-RED', 'S', 'Rouge', '#FF0000', 10),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'SAR-M-RED', 'M', 'Rouge', '#FF0000', 15),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'SAR-L-RED', 'L', 'Rouge', '#FF0000', 20);
```

### **Step 3: Configure Environment (10 min)**

```bash
# 1. Get API keys from Supabase
#    Project Settings → API → Copy these:
#    - Project URL
#    - anon/public key
#    - service_role key (for admin later)

# 2. Update .env file
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # (you have this)

# 3. Install missing packages (use --legacy-peer-deps for React 19 compatibility)
npm install react-native-url-polyfill react-native-mmkv --legacy-peer-deps
```

### **Step 4: Run the App (5 min)**

```bash
# Start Expo
npm start

# Press 'i' for iOS (or scan QR with Expo Go)
```

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] 5 tables in Supabase (products, product_variants, orders, order_tracking, inventory_reservations)
- [ ] 1 product with 3 variants
- [ ] API keys in `.env` file
- [ ] App starts without errors
- [ ] Can see products in app (when integrated)

---

## 📚 **Next Steps**

### **Need More Details?**

👉 **[Full Setup Guide](./docs/getting-started/quick-start.md)** - Comprehensive step-by-step guide with troubleshooting

### **Understanding the System:**

- **[Variants Guide](./docs/development/variants-guide.md)** - Product variants, stock management, cart integration
- **[4-Week Roadmap](./docs/infrastructure/4-week-roadmap.md)** - Complete development timeline
- **[Admin Dashboard](./docs/infrastructure/admin-dashboard.md)** - Next.js admin setup
- **[Monorepo Guide](./docs/getting-started/monorepo-setup.md)** - Monorepo architecture

### **Documentation Hub:**

- **[Documentation Index](./docs/README.md)** - All documentation organized

---

## 🚨 **Common Issues & Quick Fixes**

### **Issue: SQL Error**

```bash
✓ Solution: Use docs/setup/database-schema.sql (production version)
✓ Ensure: You copied the ENTIRE file
```

### **Issue: Variant Not Found**

```bash
✓ Solution: Product must exist before adding variants
✓ Check: Product ID in INSERT statement is correct
```

### **Issue: Can't Connect to Supabase**

```bash
✓ Solution: Verify API keys in .env file
✓ Check: EXPO_PUBLIC_SUPABASE_URL is correct
✓ Install: npm install react-native-url-polyfill --legacy-peer-deps
```

### **Issue: npm Install Errors**

```bash
✓ Solution: Use --legacy-peer-deps flag for React 19 compatibility
✓ Run: npm install <package> --legacy-peer-deps
```

---

## 💡 **Pro Tips**

1. **Start small** - 1 product, 3 variants, then scale
2. **Test in Supabase** - Use SQL Editor to test queries
3. **Use placeholders** - picsum.photos for images
4. **Check RLS** - Database → Policies if data not showing
5. **Read errors** - They tell you exactly what's wrong

---

**Need help?** Check the [Full Setup Guide](./docs/setup/01-quick-start.md) or [Documentation Hub](./docs/README.md) 🚀
