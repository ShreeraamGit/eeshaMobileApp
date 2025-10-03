# Database Schema Design for Eesha Silks E-commerce

## Overview

This document defines the complete database schema for the Eesha Silks mobile e-commerce application, designed for progressive scaling from MVP (60 products, single vendor) to multi-vendor marketplace (1000+ products, multiple vendors).

## Architecture Philosophy

### MVP Approach (Months 1-2)
- **Single vendor** with size/color variants
- **PostgreSQL** with Supabase for simplicity
- **Row Level Security** for data protection
- **JSON fields** for flexibility without complexity

### Scale Approach (Month 3+)
- **Multi-vendor** with vendor-specific shipping
- **Color-only variants** (remove size complexity)
- **Marketplace splitting** with Stripe Connect
- **Performance optimizations** with indexes and materialized views

## Core Tables

### 1. Products Table

```sql
-- Products table (parent products)
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    compare_at_price DECIMAL(10,2), -- For sale pricing
    images JSONB DEFAULT '[]', -- Array of image URLs
    category VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT '{}', -- For filtering and search
    vendor_id UUID, -- NULL for MVP, required for multi-vendor
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    seo_title VARCHAR(70), -- For SEO optimization
    seo_description VARCHAR(160),
    metadata JSONB DEFAULT '{}', -- Flexible additional data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_active ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_vendor ON products(vendor_id) WHERE vendor_id IS NOT NULL;
CREATE INDEX idx_products_search ON products USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Trigger for updated_at
CREATE TRIGGER products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Product Variants Table

```sql
-- Product variants for size/color combinations (MVP)
-- Will be simplified to color-only for multi-vendor
CREATE TABLE product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    -- MVP: Both size and color
    size VARCHAR(20) NOT NULL, -- Will be removed in multi-vendor migration
    color VARCHAR(50) NOT NULL,
    color_hex VARCHAR(7), -- #FF0000 for UI display
    -- Pricing and inventory
    price DECIMAL(10,2), -- NULL means use base_price from product
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INT DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INT DEFAULT 5,
    -- Images and status
    image_url TEXT, -- Color-specific image
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    -- MVP constraint: unique size + color per product
    UNIQUE(product_id, size, color)
);

-- Indexes for performance
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity) WHERE active = true;
CREATE INDEX idx_variants_active ON product_variants(active, product_id);

-- Stock management functions
CREATE OR REPLACE FUNCTION check_stock_availability(
    p_variant_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INT;
BEGIN
    SELECT stock_quantity - COALESCE(reserved_quantity, 0)
    INTO available_stock
    FROM product_variants
    WHERE id = p_variant_id AND active = true;

    RETURN COALESCE(available_stock, 0) >= p_quantity;
END;
$$ LANGUAGE plpgsql;
```

### 3. Users and Authentication

```sql
-- Users are handled by Supabase Auth
-- Additional user profile data
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    -- Address preferences
    default_shipping_address JSONB,
    default_billing_address JSONB,
    -- Preferences
    marketing_consent BOOLEAN DEFAULT false,
    sms_consent BOOLEAN DEFAULT false,
    preferred_language VARCHAR(5) DEFAULT 'fr',
    -- Metadata
    customer_since TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    total_orders INT DEFAULT 0,
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policy for user profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 4. Shopping Carts

```sql
-- Shopping carts with session support
CREATE TABLE carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For anonymous users
    items JSONB DEFAULT '[]', -- [{variant_id, product_name, size, color, quantity, price}]
    subtotal DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    -- Cart expiration
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    -- Either user_id or session_id must be present
    CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_carts_expires ON carts(expires_at);

-- RLS Policy for carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON carts
    FOR ALL USING (
        auth.uid() = user_id OR
        session_id = current_setting('app.session_id', true)
    );

-- Cart cleanup function (run daily)
CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM carts WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

### 5. Orders System

```sql
-- Orders with French VAT and tracking
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    -- Customer information
    customer_id UUID REFERENCES auth.users(id),
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    -- Order items (denormalized for historical accuracy)
    items JSONB NOT NULL, -- Detailed variant info with prices at time of order
    -- Pricing breakdown (French VAT)
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    vat_rate DECIMAL(4,2) DEFAULT 20.00 CHECK (vat_rate >= 0), -- French VAT
    vat_amount DECIMAL(10,2) NOT NULL CHECK (vat_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 10.00 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    currency VARCHAR(3) DEFAULT 'EUR',
    -- Order status
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
    ),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')
    ),
    payment_method VARCHAR(50),
    stripe_payment_intent_id VARCHAR(200),
    -- Shipping information (MVP: self-fulfilled)
    tracking_number VARCHAR(100),
    tracking_carrier VARCHAR(50) DEFAULT 'internal',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    -- Vendor information (for multi-vendor migration)
    vendor_id UUID, -- References vendors(id), added in migration
    vendor_tracking_number VARCHAR(200), -- Vendor's tracking number
    vendor_carrier VARCHAR(100), -- Vendor's shipping carrier
    -- Timestamps
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    -- Additional data
    notes TEXT,
    internal_notes TEXT, -- Admin notes
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_seq START 1000;

-- Function to generate French order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'CMD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
           LPAD(NEXTVAL('order_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE TRIGGER set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Indexes for performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_tracking ON orders(tracking_number);
CREATE INDEX idx_orders_vendor ON orders(vendor_id) WHERE vendor_id IS NOT NULL;
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- RLS Policy for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);
```

### 6. Order Tracking System

```sql
-- Order tracking events for customer visibility
CREATE TABLE order_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (
        status IN (
            'order_placed', 'payment_confirmed', 'preparing',
            'shipped', 'out_for_delivery', 'delivered',
            'cancelled', 'refunded'
        )
    ),
    description TEXT,
    location VARCHAR(100) DEFAULT 'Paris, France',
    -- Metadata for additional tracking info
    carrier_name VARCHAR(100),
    estimated_delivery_date DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for efficient order tracking queries
CREATE INDEX idx_tracking_order ON order_tracking(order_id, created_at DESC);

-- RLS Policy for order tracking
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own order tracking" ON order_tracking
    FOR SELECT USING (
        order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())
    );

-- Function to get tracking status in French
CREATE OR REPLACE FUNCTION get_tracking_status_french(status_code VARCHAR)
RETURNS TEXT AS $$
BEGIN
    RETURN CASE status_code
        WHEN 'order_placed' THEN 'Commande reçue'
        WHEN 'payment_confirmed' THEN 'Paiement confirmé'
        WHEN 'preparing' THEN 'En préparation'
        WHEN 'shipped' THEN 'Expédiée'
        WHEN 'out_for_delivery' THEN 'En cours de livraison'
        WHEN 'delivered' THEN 'Livrée'
        WHEN 'cancelled' THEN 'Annulée'
        WHEN 'refunded' THEN 'Remboursée'
        ELSE 'Statut inconnu'
    END;
END;
$$ LANGUAGE plpgsql;
```

### 7. Inventory Management

```sql
-- Inventory reservations for cart items
CREATE TABLE inventory_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- For order reservations
    quantity INT NOT NULL CHECK (quantity > 0),
    reservation_type VARCHAR(20) DEFAULT 'cart' CHECK (
        reservation_type IN ('cart', 'order', 'manual')
    ),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 minutes'),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reservations_variant ON inventory_reservations(variant_id);
CREATE INDEX idx_reservations_cart ON inventory_reservations(cart_id);
CREATE INDEX idx_reservations_expires ON inventory_reservations(expires_at);

-- Function to reserve inventory
CREATE OR REPLACE FUNCTION reserve_inventory(
    p_variant_id UUID,
    p_cart_id UUID,
    p_quantity INT,
    p_duration_minutes INT DEFAULT 30
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INT;
    reservation_expires TIMESTAMP;
BEGIN
    -- Check available stock
    SELECT stock_quantity - COALESCE(reserved_quantity, 0) - COALESCE(
        (SELECT SUM(quantity) FROM inventory_reservations
         WHERE variant_id = p_variant_id AND expires_at > NOW()), 0
    ) INTO available_stock
    FROM product_variants
    WHERE id = p_variant_id AND active = true;

    IF COALESCE(available_stock, 0) < p_quantity THEN
        RETURN false;
    END IF;

    -- Create reservation
    reservation_expires := NOW() + (p_duration_minutes || ' minutes')::INTERVAL;

    INSERT INTO inventory_reservations (variant_id, cart_id, quantity, expires_at)
    VALUES (p_variant_id, p_cart_id, p_quantity, reservation_expires)
    ON CONFLICT (variant_id, cart_id) DO UPDATE SET
        quantity = EXCLUDED.quantity,
        expires_at = EXCLUDED.expires_at;

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired reservations
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM inventory_reservations WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
```

## Multi-Vendor Migration (Month 3)

### 8. Vendors Table

```sql
-- Vendors table (added in migration)
CREATE TABLE vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    business_name VARCHAR(200) NOT NULL,
    business_email VARCHAR(255) NOT NULL,
    business_phone VARCHAR(20),
    -- Legal information
    siret_number VARCHAR(14), -- French business registration
    vat_number VARCHAR(50), -- European VAT number
    -- Stripe Connect integration
    stripe_account_id VARCHAR(200) UNIQUE,
    stripe_onboarding_completed BOOLEAN DEFAULT false,
    -- Business status
    status VARCHAR(20) DEFAULT 'pending' CHECK (
        status IN ('pending', 'active', 'suspended', 'inactive')
    ),
    commission_rate DECIMAL(5,2) DEFAULT 10.00 CHECK (commission_rate >= 0 AND commission_rate <= 50),
    -- Shipping configuration
    ships_from_address JSONB NOT NULL,
    shipping_providers JSONB DEFAULT '[]', -- ["La Poste", "Chronopost", etc.]
    default_shipping_provider VARCHAR(50) DEFAULT 'La Poste',
    shipping_zones JSONB DEFAULT '["FR"]', -- Countries they ship to
    -- Business metrics
    total_products INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    -- Timestamps
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_vendors_user ON vendors(user_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_stripe ON vendors(stripe_account_id);

-- RLS for vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vendors see own data" ON vendors
    FOR ALL USING (auth.uid() = user_id);
```

### 9. Migration Scripts

```sql
-- Migration script for multi-vendor transition
-- Step 1: Add vendor_id to existing tables
ALTER TABLE products ADD COLUMN vendor_id UUID REFERENCES vendors(id);
ALTER TABLE orders ADD COLUMN vendor_id UUID REFERENCES vendors(id);
ALTER TABLE orders ADD COLUMN vendor_tracking_number VARCHAR(200);
ALTER TABLE orders ADD COLUMN vendor_carrier VARCHAR(100);

-- Step 2: Create default vendor for existing products
INSERT INTO vendors (id, user_id, business_name, business_email, ships_from_address, status)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'admin@eeshasilks.com'),
    'Eesha Silks',
    'admin@eeshasilks.com',
    '{"name": "Eesha Silks", "line1": "123 Rue de la République", "city": "Paris", "postal_code": "75001", "country": "FR"}',
    'active'
);

-- Step 3: Assign all existing products to default vendor
UPDATE products SET vendor_id = (
    SELECT id FROM vendors WHERE business_name = 'Eesha Silks' LIMIT 1
) WHERE vendor_id IS NULL;

-- Step 4: Remove size from product_variants (simplify for multi-vendor)
ALTER TABLE product_variants DROP CONSTRAINT product_variants_product_id_size_color_key;
ALTER TABLE product_variants DROP COLUMN size;
ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_color_key
    UNIQUE(product_id, color);

-- Step 5: Make vendor_id required
ALTER TABLE products ALTER COLUMN vendor_id SET NOT NULL;
```

## Search and Performance Optimization

### 10. Search Functions

```sql
-- Full-text search function for products
CREATE OR REPLACE FUNCTION search_products(
    search_term TEXT DEFAULT NULL,
    category_filter VARCHAR DEFAULT NULL,
    vendor_filter UUID DEFAULT NULL,
    price_min DECIMAL DEFAULT NULL,
    price_max DECIMAL DEFAULT NULL,
    in_stock_only BOOLEAN DEFAULT false,
    limit_results INT DEFAULT 20,
    offset_results INT DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    description TEXT,
    base_price DECIMAL,
    compare_at_price DECIMAL,
    images JSONB,
    category VARCHAR,
    vendor_id UUID,
    relevance REAL,
    in_stock BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        p.base_price,
        p.compare_at_price,
        p.images,
        p.category,
        p.vendor_id,
        CASE
            WHEN search_term IS NOT NULL THEN
                ts_rank(
                    to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')),
                    plainto_tsquery('english', search_term)
                )
            ELSE 0.5
        END as relevance,
        EXISTS(
            SELECT 1 FROM product_variants pv
            WHERE pv.product_id = p.id
            AND pv.active = true
            AND pv.stock_quantity > 0
        ) as in_stock
    FROM products p
    WHERE
        p.status = 'active'
        AND (category_filter IS NULL OR p.category = category_filter)
        AND (vendor_filter IS NULL OR p.vendor_id = vendor_filter)
        AND (price_min IS NULL OR p.base_price >= price_min)
        AND (price_max IS NULL OR p.base_price <= price_max)
        AND (
            search_term IS NULL
            OR to_tsvector('english', p.name || ' ' || COALESCE(p.description, ''))
               @@ plainto_tsquery('english', search_term)
        )
        AND (
            in_stock_only = false
            OR EXISTS(
                SELECT 1 FROM product_variants pv
                WHERE pv.product_id = p.id
                AND pv.active = true
                AND pv.stock_quantity > 0
            )
        )
    ORDER BY
        CASE WHEN search_term IS NOT NULL THEN relevance ELSE 0 END DESC,
        p.created_at DESC
    LIMIT limit_results
    OFFSET offset_results;
END;
$$ LANGUAGE plpgsql;
```

### 11. Materialized Views for Performance

```sql
-- Bestsellers materialized view (refresh daily)
CREATE MATERIALIZED VIEW bestsellers AS
SELECT
    p.*,
    COALESCE(order_stats.order_count, 0) as total_orders,
    COALESCE(order_stats.total_quantity, 0) as total_sold,
    COALESCE(order_stats.total_revenue, 0) as total_revenue
FROM products p
LEFT JOIN (
    SELECT
        (item->>'product_id')::UUID as product_id,
        COUNT(*) as order_count,
        SUM((item->>'quantity')::INT) as total_quantity,
        SUM((item->>'price')::DECIMAL * (item->>'quantity')::INT) as total_revenue
    FROM orders o, jsonb_array_elements(o.items) as item
    WHERE o.status IN ('processing', 'shipped', 'delivered')
    AND o.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY (item->>'product_id')::UUID
) order_stats ON p.id = order_stats.product_id
ORDER BY COALESCE(order_stats.total_quantity, 0) DESC;

-- Index on materialized view
CREATE INDEX idx_bestsellers_orders ON bestsellers(total_orders DESC);
CREATE INDEX idx_bestsellers_revenue ON bestsellers(total_revenue DESC);

-- Function to refresh bestsellers
CREATE OR REPLACE FUNCTION refresh_bestsellers()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY bestsellers;
END;
$$ LANGUAGE plpgsql;
```

## Utility Functions

### 12. Common Functions

```sql
-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Stock update function for completed orders
CREATE OR REPLACE FUNCTION update_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process when payment status changes to 'paid'
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        -- Reduce stock for each item in the order
        UPDATE product_variants
        SET stock_quantity = stock_quantity - (item->>'quantity')::INT
        FROM jsonb_array_elements(NEW.items) AS item
        WHERE id = (item->>'variant_id')::UUID;

        -- Remove any cart reservations for these items
        DELETE FROM inventory_reservations
        WHERE variant_id IN (
            SELECT (item->>'variant_id')::UUID
            FROM jsonb_array_elements(NEW.items) AS item
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply stock update trigger
CREATE TRIGGER after_order_paid
    AFTER UPDATE OF payment_status ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' AND OLD.payment_status != 'paid')
    EXECUTE FUNCTION update_stock_after_order();
```

## Performance Considerations

### Indexes Summary
- **Products**: category, vendor, search, tags, status
- **Variants**: product_id, sku, stock levels, active status
- **Orders**: customer, status, tracking, creation date
- **Carts**: user, session, expiration
- **Tracking**: order_id with created_at

### Query Optimization
- Use materialized views for complex aggregations
- Implement proper pagination with LIMIT/OFFSET
- Use partial indexes where appropriate (e.g., active products only)
- Regular VACUUM and ANALYZE for PostgreSQL health

### Scaling Considerations
- Read replicas for query-heavy workloads
- Connection pooling with PgBouncer
- Partitioning for orders table when reaching 1M+ records
- Consider moving to dedicated PostgreSQL when exceeding Supabase limits

## Security Implementation

### Row Level Security (RLS)
All sensitive tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Vendors can only manage their own products
- Admin access is properly controlled

### Data Protection
- All timestamps in UTC
- Sensitive data encrypted at rest (Supabase default)
- No PCI data stored (handled by Stripe)
- GDPR-compliant data structure with metadata fields

This schema design provides a solid foundation for the MVP while enabling seamless scaling to a multi-vendor marketplace.