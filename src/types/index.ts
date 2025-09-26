// Core types for the e-commerce application

export interface Product {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  compare_at_price?: number;
  images: string[];
  category: string;
  tags?: string[];
  vendor_id?: string;
  status: 'active' | 'inactive' | 'draft';
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  color_hex?: string;
  price?: number; // Override base price if needed
  stock_quantity: number;
  reserved_quantity: number;
  image_url?: string;
  active: boolean;
  created_at: string;
}

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: number;
  vat_amount: number;
  shipping_amount: number;
  total: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  email: string;
  phone?: string;
  items: CartItem[];
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  stripe_payment_intent_id?: string;
  tracking_number?: string;
  tracking_carrier?: string;
  shipping_address: Address;
  billing_address?: Address;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface OrderTracking {
  id: string;
  order_id: string;
  status: TrackingStatus;
  description: string;
  location: string;
  created_at: string;
}

export type TrackingStatus =
  | 'order_placed'
  | 'payment_confirmed'
  | 'preparing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface User {
  id: string;
  email: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  default_shipping_address?: Address;
  default_billing_address?: Address;
  created_at: string;
  updated_at: string;
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  stripe_account_id?: string;
  status: 'pending' | 'active' | 'suspended';
  commission_rate: number;
  ships_from_address?: Address;
  shipping_provider?: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };
  OrderTracking: { orderId: string };
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Cart: undefined;
  Profile: undefined;
};

// Store types
export interface AppState {
  user: User | null;
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
}