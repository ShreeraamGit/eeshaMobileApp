import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Secure storage adapter for auth tokens
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting item from SecureStore:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error setting item in SecureStore:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item from SecureStore:', error);
    }
  },
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (will be auto-generated later)
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          base_price: number;
          compare_at_price: number | null;
          images: string[];
          category: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          size: string;
          color: string;
          color_hex: string | null;
          price: number | null;
          stock_quantity: number;
          low_stock_threshold: number;
          image_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          email: string;
          phone: string | null;
          items: any[];
          subtotal: number;
          vat_rate: number;
          vat_amount: number;
          shipping_amount: number;
          total: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          stripe_payment_intent_id: string | null;
          tracking_number: string | null;
          shipping_address: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_tracking: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          description: string;
          location: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_tracking']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_tracking']['Insert']>;
      };
    };
  };
}
