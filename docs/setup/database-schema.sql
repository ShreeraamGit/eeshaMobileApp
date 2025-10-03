-- ============================================
-- EESHA MOBILE APP - SUPABASE DATABASE SCHEMA
-- ============================================
-- WITH PRODUCT VARIANTS (Size & Color)
-- Last updated: 2025-10-03
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE (Parent Products)
-- ============================================
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= 0),
    images TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCT VARIANTS TABLE (Size + Color Combinations)
-- ============================================
CREATE TABLE product_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

    -- SKU for inventory tracking
    sku VARCHAR(100) UNIQUE NOT NULL,

    -- Variant attributes
    size VARCHAR(50) NOT NULL,
    color VARCHAR(100) NOT NULL,
    color_hex VARCHAR(7), -- #FF0000 for UI display

    -- Pricing (optional override)
    price DECIMAL(10,2), -- NULL means use base_price from products table

    -- Stock management
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT DEFAULT 5,

    -- Variant image (optional, color-specific)
    image_url TEXT,

    -- Status
    active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure unique size+color combination per product
    UNIQUE(product_id, size, color)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),

    -- Order items with variant details stored as JSONB
    -- Format: [{ variant_id, product_name, size, color, price, quantity, image_url }]
    items JSONB NOT NULL DEFAULT '[]',

    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    vat_rate DECIMAL(5,2) DEFAULT 20.00,
    vat_amount DECIMAL(10,2) NOT NULL CHECK (vat_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 10.00,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),

    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),

    -- Payment info
    stripe_payment_intent_id VARCHAR(255),

    -- Shipping info
    tracking_number VARCHAR(100),
    shipping_address JSONB NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDER TRACKING TABLE
-- ============================================
CREATE TABLE order_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) DEFAULT 'Paris, France',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INVENTORY RESERVATIONS (Optional - for cart management)
-- ============================================
CREATE TABLE inventory_reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 minutes'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Products indexes
CREATE INDEX idx_products_active ON products(active) WHERE active = true;
CREATE INDEX idx_products_category ON products(category) WHERE category IS NOT NULL;
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Product variants indexes
CREATE INDEX idx_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_active ON product_variants(active) WHERE active = true;
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity);
CREATE INDEX idx_variants_size ON product_variants(size);
CREATE INDEX idx_variants_color ON product_variants(color);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order tracking indexes
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_created_at ON order_tracking(created_at);

-- Inventory reservations indexes
CREATE INDEX idx_reservations_variant_id ON inventory_reservations(variant_id);
CREATE INDEX idx_reservations_expires_at ON inventory_reservations(expires_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
    counter INT;
BEGIN
    SELECT COUNT(*) INTO counter
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE;

    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((counter + 1)::TEXT, 4, '0');

    RETURN new_number;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Function to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Function to check variant stock availability
CREATE OR REPLACE FUNCTION check_variant_stock(
    p_variant_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    available_stock INT;
    reserved_stock INT;
BEGIN
    -- Get current stock
    SELECT stock_quantity INTO available_stock
    FROM product_variants
    WHERE id = p_variant_id AND active = true;

    IF available_stock IS NULL THEN
        RETURN false;
    END IF;

    -- Get reserved stock
    SELECT COALESCE(SUM(quantity), 0) INTO reserved_stock
    FROM inventory_reservations
    WHERE variant_id = p_variant_id
    AND expires_at > NOW();

    -- Check if enough stock available
    RETURN (available_stock - reserved_stock) >= p_quantity;
END;
$$;

-- Function to update stock after order payment
CREATE OR REPLACE FUNCTION update_stock_after_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    item JSONB;
BEGIN
    -- Only run when payment status changes to 'paid'
    IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
        -- Loop through order items and reduce stock
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            UPDATE product_variants
            SET stock_quantity = stock_quantity - (item->>'quantity')::INT
            WHERE id = (item->>'variant_id')::UUID;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$;

-- Function to clean expired reservations
CREATE OR REPLACE FUNCTION clean_expired_reservations()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM inventory_reservations
    WHERE expires_at < NOW();
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_variants updated_at
CREATE TRIGGER update_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate order number
CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Trigger to update stock when order is paid
CREATE TRIGGER update_stock_on_payment
    AFTER UPDATE OF payment_status ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_stock_after_payment();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- Products are public (read-only)
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (active = true);

-- Product variants are public (read-only)
CREATE POLICY "Variants are viewable by everyone"
    ON product_variants FOR SELECT
    USING (active = true);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

-- Users can view tracking for their own orders
CREATE POLICY "Users can view own order tracking"
    ON order_tracking FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid()
        )
    );

-- Service role has full access (for admin)
CREATE POLICY "Service role full access to products"
    ON products FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to variants"
    ON product_variants FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to orders"
    ON orders FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to tracking"
    ON order_tracking FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- SEED DATA (Example)
-- ============================================

-- Example: Product with multiple size/color variants
/*
-- 1. Insert parent product
INSERT INTO products (name, description, base_price, category, images) VALUES
('Saree Soie Premium', 'Saree traditionnel en soie pure avec broderie', 299.99, 'Sarees',
 ARRAY['https://picsum.photos/400/533?random=1']);

-- 2. Get the product ID (or use the UUID returned)
-- Let's say product_id = '123e4567-e89b-12d3-a456-426614174000'

-- 3. Insert variants for different size/color combinations
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock_quantity, image_url) VALUES
-- Small sizes
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-S-RED', 'S', 'Rouge', '#FF0000', 10, 'https://picsum.photos/400/533?random=1'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-S-BLUE', 'S', 'Bleu', '#0000FF', 8, 'https://picsum.photos/400/533?random=2'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-S-GREEN', 'S', 'Vert', '#00FF00', 5, 'https://picsum.photos/400/533?random=3'),

-- Medium sizes
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-M-RED', 'M', 'Rouge', '#FF0000', 15, 'https://picsum.photos/400/533?random=1'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-M-BLUE', 'M', 'Bleu', '#0000FF', 12, 'https://picsum.photos/400/533?random=2'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-M-GREEN', 'M', 'Vert', '#00FF00', 10, 'https://picsum.photos/400/533?random=3'),

-- Large sizes
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-L-RED', 'L', 'Rouge', '#FF0000', 20, 'https://picsum.photos/400/533?random=1'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-L-BLUE', 'L', 'Bleu', '#0000FF', 18, 'https://picsum.photos/400/533?random=2'),
('123e4567-e89b-12d3-a456-426614174000', 'SAREE-SOIE-L-BLUE', 'L', 'Vert', '#00FF00', 15, 'https://picsum.photos/400/533?random=3');
*/

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- Get product with all variants
/*
SELECT
    p.*,
    json_agg(
        json_build_object(
            'id', pv.id,
            'sku', pv.sku,
            'size', pv.size,
            'color', pv.color,
            'color_hex', pv.color_hex,
            'price', COALESCE(pv.price, p.base_price),
            'stock_quantity', pv.stock_quantity,
            'image_url', pv.image_url,
            'active', pv.active
        )
    ) as variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'your-product-id'
GROUP BY p.id;
*/

-- Get available sizes for a product
/*
SELECT DISTINCT size
FROM product_variants
WHERE product_id = 'your-product-id'
AND active = true
AND stock_quantity > 0
ORDER BY size;
*/

-- Get available colors for a product
/*
SELECT DISTINCT color, color_hex
FROM product_variants
WHERE product_id = 'your-product-id'
AND active = true
AND stock_quantity > 0
ORDER BY color;
*/

-- Check stock for specific variant
/*
SELECT stock_quantity, low_stock_threshold
FROM product_variants
WHERE product_id = 'your-product-id'
AND size = 'M'
AND color = 'Rouge'
AND active = true;
*/

-- Get low stock variants
/*
SELECT
    p.name,
    pv.sku,
    pv.size,
    pv.color,
    pv.stock_quantity,
    pv.low_stock_threshold
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
WHERE pv.stock_quantity <= pv.low_stock_threshold
AND pv.active = true;
*/

-- ============================================
-- VERIFICATION
-- ============================================

-- After running this schema:
-- 1. Check tables: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- 2. Check variants table: SELECT * FROM product_variants LIMIT 5;
-- 3. Test stock function: SELECT check_variant_stock('variant-id', 2);
-- 4. Clean reservations: SELECT clean_expired_reservations();

-- ============================================
-- SUCCESS!
-- ============================================
-- Your database is ready with variant support!
--
-- Next steps:
-- 1. Add products via admin dashboard
-- 2. Add variants for each product (size/color combinations)
-- 3. Update mobile app to handle variants
-- 4. Test cart with variant selection
