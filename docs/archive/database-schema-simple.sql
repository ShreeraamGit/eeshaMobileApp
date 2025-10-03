-- ============================================
-- EESHA MOBILE APP - SUPABASE DATABASE SCHEMA
-- ============================================
-- SIMPLIFIED VERSION (100% Compatible with Supabase)
-- Last updated: 2025-10-03
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= 0),
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    vat_rate DECIMAL(5,2) DEFAULT 20.00,
    vat_amount DECIMAL(10,2) NOT NULL CHECK (vat_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 10.00,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id VARCHAR(255),
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
-- INDEXES
-- ============================================

-- Products indexes
CREATE INDEX idx_products_active ON products(active) WHERE active = true;
CREATE INDEX idx_products_category ON products(category) WHERE category IS NOT NULL;
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Order tracking indexes
CREATE INDEX idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX idx_order_tracking_created_at ON order_tracking(created_at);

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
    -- Get count of orders today
    SELECT COUNT(*) INTO counter
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE;

    -- Format: ORD-YYYYMMDD-XXXX
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

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
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

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking ENABLE ROW LEVEL SECURITY;

-- Products are public (read-only for users)
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
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

-- Service role has full access (for admin dashboard)
CREATE POLICY "Service role has full access to orders"
    ON orders FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role has full access to order_tracking"
    ON order_tracking FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- SEED DATA (OPTIONAL - FOR TESTING)
-- ============================================

-- Uncomment to insert sample products
/*
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Saree Soie Rouge', 'Saree traditionnel en soie pure avec broderie dorée', 299.99, 'https://picsum.photos/400/533?random=1', 'Sarees', 10),
('Saree Coton Bleu', 'Saree en coton confortable pour usage quotidien', 89.99, 'https://picsum.photos/400/533?random=2', 'Sarees', 15),
('Lehenga Mariage Or', 'Lehenga luxueux pour occasions spéciales', 599.99, 'https://picsum.photos/400/533?random=3', 'Lehengas', 5),
('Kurta Set Vert', 'Ensemble kurta moderne avec pantalon assorti', 149.99, 'https://picsum.photos/400/533?random=4', 'Kurtas', 20),
('Dupatta Brodé', 'Dupatta élégant avec broderie perlée', 79.99, 'https://picsum.photos/400/533?random=5', 'Accessoires', 25);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these after setup to verify everything works:

-- 1. Check tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 2. Test order number generation
-- SELECT generate_order_number();

-- 3. Check RLS policies
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ============================================
-- SUCCESS!
-- ============================================
-- Your database is ready!
-- Next steps:
-- 1. Go to Table Editor to see your tables
-- 2. Add sample products manually OR uncomment seed data above
-- 3. Get your API keys from Project Settings > API
-- 4. Update your .env file with the keys
