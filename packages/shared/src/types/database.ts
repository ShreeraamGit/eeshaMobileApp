/**
 * Database Types - Shared across mobile and admin
 * Single source of truth for Supabase schema types
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string | null;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  color_hex: string | null;
  price: number | null; // Override base_price if set
  stock_quantity: number;
  image_url: string | null; // Color-specific image
  created_at: string;
  updated_at: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  available_sizes: string[];
  available_colors: Array<{ color: string; color_hex: string | null }>;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  vat_amount: number;
  shipping_cost: number;
  total: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id: string | null;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  variant_id: string;
  product_id: string;
  name: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface ShippingAddress {
  full_name: string;
  street_address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface OrderTracking {
  id: string;
  order_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number: string | null;
  carrier: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryReservation {
  id: string;
  variant_id: string;
  quantity: number;
  session_id: string;
  expires_at: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin' | 'vendor';
  created_at: string;
  updated_at: string;
}

/**
 * Supabase Database Type Definition
 * Used for type-safe database queries
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
      order_tracking: {
        Row: OrderTracking;
        Insert: Omit<OrderTracking, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<OrderTracking, 'id' | 'created_at' | 'updated_at'>>;
      };
      inventory_reservations: {
        Row: InventoryReservation;
        Insert: Omit<InventoryReservation, 'id' | 'created_at'>;
        Update: Partial<Omit<InventoryReservation, 'id' | 'created_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
