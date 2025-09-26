# Migration Guide: Single-Vendor to Multi-Vendor Marketplace

## Overview

This guide outlines the complete migration process from the MVP single-vendor e-commerce app to a full multi-vendor marketplace, ensuring zero downtime and consistent user experience.

## Migration Timeline

### Phase 1: MVP Foundation (Weeks 1-4)
- Single vendor with size/color variants
- Internal fulfillment and tracking
- French market focus (VAT, EUR, shipping)

### Phase 2: Preparation (Month 2)
- Performance optimization
- Feature flag system
- Admin tools for vendor management
- Enhanced analytics

### Phase 3: Multi-Vendor Migration (Month 3)
- Database schema changes
- API endpoint updates
- Vendor onboarding system
- Stripe Connect integration

## Database Migration Plan

### Step 1: Add Vendor Support (Non-Breaking)

```sql
-- Add vendor tables without affecting existing functionality
CREATE TABLE vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    business_name VARCHAR(200) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    business_phone VARCHAR(20),
    -- Legal information for French compliance
    siret_number VARCHAR(14), -- French business registration
    vat_number VARCHAR(50), -- European VAT number
    -- Stripe Connect
    stripe_account_id VARCHAR(200) UNIQUE,
    stripe_onboarding_completed BOOLEAN DEFAULT false,
    -- Business status
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'active', 'suspended', 'inactive')
    ),
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    -- Shipping configuration
    ships_from_address JSONB NOT NULL,
    shipping_providers JSONB DEFAULT '["La Poste"]',
    shipping_zones JSONB DEFAULT '["FR"]',
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add vendor fields to existing tables (nullable for backward compatibility)
ALTER TABLE products ADD COLUMN vendor_id UUID REFERENCES vendors(id);
ALTER TABLE orders ADD COLUMN vendor_id UUID REFERENCES vendors(id);
ALTER TABLE orders ADD COLUMN vendor_tracking_number VARCHAR(200);
ALTER TABLE orders ADD COLUMN vendor_carrier VARCHAR(100);

-- Create default vendor for existing data
INSERT INTO vendors (
    id,
    user_id,
    business_name,
    business_email,
    ships_from_address,
    status
) VALUES (
    'eesha-default-vendor-id',
    (SELECT id FROM auth.users WHERE email = 'admin@eeshasilks.com'),
    'Eesha Silks',
    'admin@eeshasilks.com',
    '{"name": "Eesha Silks", "line1": "123 Rue de la République", "city": "Paris", "postal_code": "75001", "country": "FR"}',
    'active'
);

-- Migrate existing products to default vendor
UPDATE products
SET vendor_id = 'eesha-default-vendor-id'
WHERE vendor_id IS NULL;

-- Update existing orders
UPDATE orders
SET vendor_id = 'eesha-default-vendor-id'
WHERE vendor_id IS NULL;

-- Make vendor_id required after migration
ALTER TABLE products ALTER COLUMN vendor_id SET NOT NULL;
```

### Step 2: Simplify Product Variants (Breaking Change)

```sql
-- Create backup of current variants
CREATE TABLE product_variants_backup AS
SELECT * FROM product_variants;

-- Remove size constraint (multi-vendor uses color-only variants)
ALTER TABLE product_variants DROP CONSTRAINT product_variants_product_id_size_color_key;

-- For existing products, consolidate size variants by color
-- This script preserves highest stock quantities per color
WITH color_consolidated AS (
  SELECT
    product_id,
    color,
    color_hex,
    MAX(price) as price, -- Use highest price
    SUM(stock_quantity) as total_stock, -- Sum all sizes
    SUM(reserved_quantity) as total_reserved,
    string_agg(DISTINCT size, ',') as available_sizes, -- Track available sizes
    MAX(image_url) as image_url,
    bool_or(active) as active,
    MIN(created_at) as created_at
  FROM product_variants
  GROUP BY product_id, color, color_hex
)
UPDATE product_variants pv
SET
  stock_quantity = cc.total_stock,
  reserved_quantity = cc.total_reserved,
  price = cc.price,
  -- Store size info in metadata for reference
  sku = REPLACE(pv.sku, '-' || pv.size || '-', '-'),
  size = NULL -- Will be dropped
FROM color_consolidated cc
WHERE pv.product_id = cc.product_id
AND pv.color = cc.color
AND pv.id = (
  SELECT id FROM product_variants pv2
  WHERE pv2.product_id = cc.product_id
  AND pv2.color = cc.color
  ORDER BY stock_quantity DESC
  LIMIT 1
);

-- Remove duplicate size variants, keeping only consolidated ones
DELETE FROM product_variants
WHERE id NOT IN (
  SELECT DISTINCT ON (product_id, color) id
  FROM product_variants
  ORDER BY product_id, color, stock_quantity DESC
);

-- Drop size column and add new constraint
ALTER TABLE product_variants DROP COLUMN size;
ALTER TABLE product_variants
ADD CONSTRAINT product_variants_product_id_color_key
UNIQUE(product_id, color);

-- Add migration metadata
ALTER TABLE product_variants ADD COLUMN migration_metadata JSONB DEFAULT '{}';
UPDATE product_variants
SET migration_metadata = jsonb_build_object(
  'migrated_at', NOW(),
  'original_variants_count', (
    SELECT COUNT(*)
    FROM product_variants_backup
    WHERE product_id = product_variants.product_id
  )
);
```

### Step 3: Update API Contracts

```typescript
// Feature flag system for gradual rollout
interface FeatureFlags {
  multiVendor: boolean;
  vendorOnboarding: boolean;
  vendorDashboard: boolean;
  splitPayments: boolean;
}

// API versioning middleware
const apiVersionMiddleware = (version: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientVersion = req.headers['x-api-version'] || '1.0';

    if (version === '2.0' && !featureFlags.multiVendor) {
      return res.status(404).json({
        error: 'API version not available',
        message: 'Multi-vendor features not yet enabled'
      });
    }

    req.apiVersion = clientVersion;
    next();
  };
};

// Backward compatibility wrapper
const productResponseTransformer = (product: any, apiVersion: string) => {
  if (apiVersion === '1.0') {
    // Return size variants for v1.0 clients
    return {
      ...product,
      variants: product.variants.map(v => ({
        ...v,
        size: v.migration_metadata?.available_sizes?.split(',')[0] || 'M',
        // Distribute stock across common sizes
        stock_quantity: Math.floor(v.stock_quantity / 3)
      }))
    };
  }

  return product; // v2.0 format
};
```

### Step 4: Stripe Connect Integration

```typescript
// Stripe Connect setup
const setupStripeConnect = async () => {
  // Create Express accounts for vendors
  const createVendorAccount = async (vendorData: VendorData) => {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: vendorData.business_email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      business_profile: {
        name: vendorData.business_name,
        support_email: vendorData.business_email,
        url: `https://eeshasilks.com/vendor/${vendorData.id}`
      }
    });

    // Update vendor record
    await supabase
      .from('vendors')
      .update({ stripe_account_id: account.id })
      .eq('id', vendorData.id);

    return account;
  };

  // Payment splitting logic
  const createMarketplacePayment = async (order: Order) => {
    const platformFee = order.total * 0.05; // 5% platform fee
    const vendorAmount = order.total - platformFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: 'eur',
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: {
        destination: order.vendor.stripe_account_id
      },
      metadata: {
        order_id: order.id,
        vendor_id: order.vendor_id
      }
    });

    return paymentIntent;
  };
};
```

## API Migration Strategy

### Endpoint Evolution

#### Products API Migration
```typescript
// v1.0 Response (MVP)
{
  "variants": [
    {
      "id": "var-001",
      "size": "S",
      "color": "Rouge",
      "stock_quantity": 10
    },
    {
      "id": "var-002",
      "size": "M",
      "color": "Rouge",
      "stock_quantity": 15
    }
  ]
}

// v2.0 Response (Multi-vendor)
{
  "variants": [
    {
      "id": "var-consolidated-001",
      "color": "Rouge",
      "stock_quantity": 25,
      "available_sizes": ["S", "M", "L"],
      "size_stock_distribution": {
        "S": 8,
        "M": 12,
        "L": 5
      }
    }
  ],
  "vendor": {
    "id": "vendor-uuid",
    "business_name": "Boutique Soie",
    "shipping_zones": ["FR", "BE"],
    "avg_processing_time": "2-3 jours"
  }
}
```

#### Orders API Migration
```typescript
// v1.0: Single vendor orders
POST /orders
{
  "items": [...],
  "shipping_address": {...}
}

// v2.0: Multi-vendor orders (automatic splitting)
POST /orders
{
  "items": [...], // Can be from multiple vendors
  "shipping_address": {...}
}

// Response: Multiple orders created (one per vendor)
{
  "orders": [
    {
      "id": "order-vendor-1",
      "vendor_id": "vendor-1",
      "items": [...],
      "total": 150.00
    },
    {
      "id": "order-vendor-2",
      "vendor_id": "vendor-2",
      "items": [...],
      "total": 200.00
    }
  ],
  "total_amount": 350.00,
  "payment_intent": "pi_combined_payment"
}
```

### Cart Migration Strategy

```typescript
// Cart service handles vendor splitting automatically
class CartService {
  async addToCart(variantId: string, quantity: number) {
    const variant = await this.getVariant(variantId);
    const vendor = await this.getVendorForProduct(variant.product_id);

    // Group items by vendor in cart
    const cart = await this.getOrCreateCart();
    const vendorGroup = cart.vendor_groups[vendor.id] || {
      vendor_id: vendor.id,
      vendor_name: vendor.business_name,
      items: [],
      shipping_cost: this.calculateVendorShipping(vendor)
    };

    vendorGroup.items.push({
      variant_id: variantId,
      quantity,
      price: variant.price
    });

    cart.vendor_groups[vendor.id] = vendorGroup;
    await this.saveCart(cart);
  }

  async checkout(cart: Cart) {
    // Create separate orders for each vendor
    const orders = await Promise.all(
      Object.values(cart.vendor_groups).map(group =>
        this.createVendorOrder(group)
      )
    );

    // Create combined payment intent
    const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
    const paymentIntent = await this.createCombinedPayment(orders, totalAmount);

    return {
      orders,
      payment_intent: paymentIntent,
      total_amount: totalAmount
    };
  }
}
```

## Data Consistency Strategies

### During Migration

```sql
-- 1. Create migration status table
CREATE TABLE migration_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    migration_step VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    rollback_data JSONB
);

-- 2. Implement rollback procedures
CREATE OR REPLACE FUNCTION rollback_vendor_migration()
RETURNS BOOLEAN AS $$
BEGIN
    -- Restore product_variants from backup
    IF EXISTS (SELECT 1 FROM migration_status WHERE table_name = 'product_variants' AND status = 'completed') THEN
        DROP TABLE product_variants;
        ALTER TABLE product_variants_backup RENAME TO product_variants;

        -- Remove vendor columns
        ALTER TABLE products DROP COLUMN vendor_id;
        ALTER TABLE orders DROP COLUMN vendor_id;

        UPDATE migration_status
        SET status = 'rolled_back', completed_at = NOW()
        WHERE table_name = 'product_variants';

        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- 3. Data validation functions
CREATE OR REPLACE FUNCTION validate_migration_data()
RETURNS TABLE(validation_result TEXT, issue_count INTEGER) AS $$
BEGIN
    -- Check for products without vendors
    RETURN QUERY
    SELECT
        'Products without vendor' as validation_result,
        COUNT(*)::INTEGER as issue_count
    FROM products
    WHERE vendor_id IS NULL;

    -- Check for orphaned variants
    RETURN QUERY
    SELECT
        'Orphaned variants' as validation_result,
        COUNT(*)::INTEGER as issue_count
    FROM product_variants pv
    LEFT JOIN products p ON p.id = pv.product_id
    WHERE p.id IS NULL;

    -- Check stock consistency
    RETURN QUERY
    SELECT
        'Negative stock quantities' as validation_result,
        COUNT(*)::INTEGER as issue_count
    FROM product_variants
    WHERE stock_quantity < 0;
END;
$$ LANGUAGE plpgsql;
```

### Live Migration Process

```typescript
// Migration orchestrator
class MigrationOrchestrator {
  async executeMigration() {
    const steps = [
      'create_vendor_tables',
      'migrate_default_vendor',
      'consolidate_variants',
      'update_api_endpoints',
      'setup_stripe_connect',
      'validate_data'
    ];

    for (const step of steps) {
      try {
        await this.executeStep(step);
        await this.updateMigrationStatus(step, 'completed');
      } catch (error) {
        await this.updateMigrationStatus(step, 'failed', error.message);
        await this.rollbackMigration(step);
        throw error;
      }
    }
  }

  async validateMigrationReadiness() {
    const checks = [
      this.checkDiskSpace(),
      this.checkDatabaseConnections(),
      this.checkStripeConfiguration(),
      this.checkFeatureFlagStatus()
    ];

    const results = await Promise.all(checks);
    const failures = results.filter(r => !r.success);

    if (failures.length > 0) {
      throw new Error(`Migration readiness checks failed: ${failures.map(f => f.message).join(', ')}`);
    }

    return true;
  }
}
```

## User Experience During Migration

### Feature Flag Management

```typescript
// Gradual rollout system
const featureFlagConfig = {
  multiVendor: {
    enabled: false,
    rolloutPercentage: 0, // Start at 0%
    targetAudience: ['admin', 'beta_testers'],
    rolloutSchedule: {
      week1: 10, // 10% of beta users
      week2: 25, // 25% of beta users
      week3: 50, // 50% of all users
      week4: 100 // Full rollout
    }
  }
};

// Feature flag middleware
const checkFeatureFlag = (flagName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const flag = featureFlagConfig[flagName];

    if (!flag.enabled) {
      return next(); // Feature disabled, use v1.0 behavior
    }

    const userInTarget = flag.targetAudience.includes(user.role);
    const randomRollout = Math.random() * 100 < flag.rolloutPercentage;

    if (userInTarget || randomRollout) {
      req.features = req.features || {};
      req.features[flagName] = true;
    }

    next();
  };
};
```

### Backward Compatibility

```typescript
// API response adapter for different client versions
class ResponseAdapter {
  adaptProductResponse(product: Product, clientVersion: string) {
    switch (clientVersion) {
      case '1.0':
        return this.adaptToV1(product);
      case '2.0':
        return this.adaptToV2(product);
      default:
        return product;
    }
  }

  private adaptToV1(product: Product) {
    // Convert color-only variants back to size variants for v1.0 clients
    const expandedVariants = [];
    const commonSizes = ['S', 'M', 'L', 'XL'];

    product.variants.forEach(variant => {
      commonSizes.forEach(size => {
        expandedVariants.push({
          ...variant,
          id: `${variant.id}-${size}`,
          size: size,
          stock_quantity: Math.floor(variant.stock_quantity / commonSizes.length)
        });
      });
    });

    return {
      ...product,
      variants: expandedVariants,
      vendor_info: undefined // Hide vendor info from v1.0 clients
    };
  }

  private adaptToV2(product: Product) {
    // Full multi-vendor response
    return product;
  }
}
```

## Testing Strategy

### Migration Testing

```typescript
// Automated migration tests
describe('Migration Tests', () => {
  beforeEach(async () => {
    await setupTestDatabase();
    await seedMVPData();
  });

  test('should migrate products to multi-vendor without data loss', async () => {
    const originalProducts = await getProducts();
    await runMigration();
    const migratedProducts = await getProducts();

    expect(migratedProducts.length).toBe(originalProducts.length);
    expect(migratedProducts.every(p => p.vendor_id)).toBe(true);
  });

  test('should consolidate variants correctly', async () => {
    const originalVariant = await createTestVariant({
      size: 'S',
      color: 'Rouge',
      stock: 10
    });

    await createTestVariant({
      size: 'M',
      color: 'Rouge',
      stock: 15,
      product_id: originalVariant.product_id
    });

    await runMigration();

    const consolidatedVariants = await getVariantsByProduct(originalVariant.product_id);
    expect(consolidatedVariants.length).toBe(1);
    expect(consolidatedVariants[0].stock_quantity).toBe(25);
    expect(consolidatedVariants[0].color).toBe('Rouge');
  });

  test('should maintain API compatibility', async () => {
    await runMigration();

    // Test v1.0 API still works
    const v1Response = await request(app)
      .get('/products')
      .set('X-API-Version', '1.0')
      .expect(200);

    expect(v1Response.body.data[0].variants[0]).toHaveProperty('size');

    // Test v2.0 API works
    const v2Response = await request(app)
      .get('/products')
      .set('X-API-Version', '2.0')
      .expect(200);

    expect(v2Response.body.data[0]).toHaveProperty('vendor');
  });
});
```

### Load Testing During Migration

```javascript
// K6 load test for migration
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 100 }, // Ramp up
    { duration: '10m', target: 200 }, // Stay at 200 users
    { duration: '5m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% errors
  },
};

export default function () {
  // Test both API versions during migration
  const v1Response = http.get('https://api.eeshasilks.com/products', {
    headers: { 'X-API-Version': '1.0' }
  });

  const v2Response = http.get('https://api.eeshasilks.com/products', {
    headers: { 'X-API-Version': '2.0' }
  });

  check(v1Response, {
    'v1.0 API status is 200': (r) => r.status === 200,
    'v1.0 has size variants': (r) => r.json().data[0].variants[0].size !== undefined,
  });

  check(v2Response, {
    'v2.0 API status is 200': (r) => r.status === 200,
    'v2.0 has vendor info': (r) => r.json().data[0].vendor !== undefined,
  });
}
```

## Monitoring and Rollback

### Migration Monitoring Dashboard

```typescript
// Real-time migration monitoring
class MigrationMonitor {
  async getStatus() {
    return {
      migration_progress: await this.getMigrationProgress(),
      api_health: {
        v1_success_rate: await this.getAPISuccessRate('1.0'),
        v2_success_rate: await this.getAPISuccessRate('2.0'),
        response_times: await this.getResponseTimes()
      },
      database_metrics: {
        connection_count: await this.getDBConnections(),
        query_performance: await this.getSlowQueries(),
        storage_usage: await this.getStorageMetrics()
      },
      business_metrics: {
        orders_created: await this.getOrdersInLastHour(),
        cart_abandonment: await this.getCartAbandonmentRate(),
        error_rate: await this.getErrorRate()
      }
    };
  }

  async triggerRollback(reason: string) {
    console.log(`Triggering rollback: ${reason}`);

    // Stop new migrations
    await this.pauseMigration();

    // Restore from backup
    await this.executeSqlScript('rollback_migration.sql');

    // Update feature flags
    await this.disableFeatureFlag('multiVendor');

    // Notify team
    await this.sendAlert(`Migration rolled back: ${reason}`);

    return { success: true, message: 'Rollback completed' };
  }
}
```

This comprehensive migration guide ensures a smooth transition from single-vendor MVP to multi-vendor marketplace while maintaining data consistency, API compatibility, and user experience throughout the process.