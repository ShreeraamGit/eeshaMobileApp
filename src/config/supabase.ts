import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from './constants';

// Create Supabase client with production-grade configuration
export const supabase = createClient(
  API_CONFIG.SUPABASE_URL,
  API_CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: {
        getItem: async (key: string) => {
          // Use secure storage for auth tokens
          const { getItemAsync } = await import('expo-secure-store');
          return await getItemAsync(key);
        },
        setItem: async (key: string, value: string) => {
          const { setItemAsync } = await import('expo-secure-store');
          await setItemAsync(key, value);
        },
        removeItem: async (key: string) => {
          const { deleteItemAsync } = await import('expo-secure-store');
          await deleteItemAsync(key);
        },
      },
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'eesha-silks-mobile@1.0.0',
      },
    },
  }
);

// Database type definitions for better TypeScript support
export type Database = {
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
          category: string;
          tags: string[] | null;
          vendor_id: string | null;
          status: string;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          base_price: number;
          compare_at_price?: number | null;
          images?: string[];
          category: string;
          tags?: string[] | null;
          vendor_id?: string | null;
          status?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          images?: string[];
          category?: string;
          tags?: string[] | null;
          vendor_id?: string | null;
          status?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
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
          reserved_quantity: number;
          image_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          size: string;
          color: string;
          color_hex?: string | null;
          price?: number | null;
          stock_quantity?: number;
          reserved_quantity?: number;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          size?: string;
          color?: string;
          color_hex?: string | null;
          price?: number | null;
          stock_quantity?: number;
          reserved_quantity?: number;
          image_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          email: string;
          phone: string | null;
          items: any;
          subtotal: number;
          vat_rate: number;
          vat_amount: number;
          shipping_amount: number;
          discount_amount: number;
          total: number;
          currency: string;
          status: string;
          payment_status: string;
          payment_method: string | null;
          stripe_payment_intent_id: string | null;
          tracking_number: string | null;
          tracking_carrier: string | null;
          shipping_address: any;
          billing_address: any | null;
          shipped_at: string | null;
          delivered_at: string | null;
          notes: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id: string;
          email: string;
          phone?: string | null;
          items: any;
          subtotal: number;
          vat_rate?: number;
          vat_amount: number;
          shipping_amount?: number;
          discount_amount?: number;
          total: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          stripe_payment_intent_id?: string | null;
          tracking_number?: string | null;
          tracking_carrier?: string | null;
          shipping_address: any;
          billing_address?: any | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string;
          email?: string;
          phone?: string | null;
          items?: any;
          subtotal?: number;
          vat_rate?: number;
          vat_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          total?: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          stripe_payment_intent_id?: string | null;
          tracking_number?: string | null;
          tracking_carrier?: string | null;
          shipping_address?: any;
          billing_address?: any | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          notes?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_tracking: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          description: string | null;
          location: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          description?: string | null;
          location?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          description?: string | null;
          location?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_products: {
        Args: {
          search_term: string;
          category_filter?: string;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
          price: number;
          relevance: number;
        }[];
      };
      check_stock_availability: {
        Args: {
          p_variant_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
};