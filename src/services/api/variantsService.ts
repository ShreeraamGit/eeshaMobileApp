import { supabase, Database } from '../supabase';

export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert'];

export interface ProductWithVariants {
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
  variants: ProductVariant[];

  // Computed fields
  available_sizes?: string[];
  available_colors?: Array<{ color: string; color_hex: string | null }>;
  min_price?: number;
  max_price?: number;
  total_stock?: number;
}

class VariantsService {
  /**
   * Get product with all its variants
   */
  async getProductWithVariants(productId: string): Promise<ProductWithVariants | null> {
    try {
      // Get product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('active', true)
        .single();

      if (productError || !product) {
        console.error('Get product error:', productError);
        return null;
      }

      // Get variants
      const { data: variants, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .eq('active', true)
        .order('size', { ascending: true });

      if (variantsError) {
        console.error('Get variants error:', variantsError);
        return null;
      }

      // Calculate computed fields
      const availableSizes = [...new Set(variants?.map(v => v.size) || [])];
      const availableColors = [...new Map(
        variants?.map(v => [v.color, { color: v.color, color_hex: v.color_hex }]) || []
      ).values()];

      const prices = variants?.map(v => v.price || product.base_price) || [product.base_price];
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const totalStock = variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;

      return {
        ...product,
        variants: variants || [],
        available_sizes: availableSizes,
        available_colors: availableColors,
        min_price: minPrice,
        max_price: maxPrice,
        total_stock: totalStock,
      };
    } catch (error) {
      console.error('Get product with variants error:', error);
      return null;
    }
  }

  /**
   * Get specific variant by size and color
   */
  async getVariant(
    productId: string,
    size: string,
    color: string
  ): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .eq('size', size)
        .eq('color', color)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Get variant error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get variant error:', error);
      return null;
    }
  }

  /**
   * Get variant by ID
   */
  async getVariantById(variantId: string): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('id', variantId)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Get variant by ID error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get variant by ID error:', error);
      return null;
    }
  }

  /**
   * Get all available sizes for a product
   */
  async getAvailableSizes(productId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('size')
        .eq('product_id', productId)
        .eq('active', true)
        .gt('stock_quantity', 0);

      if (error) {
        console.error('Get available sizes error:', error);
        return [];
      }

      return [...new Set(data?.map(v => v.size) || [])];
    } catch (error) {
      console.error('Get available sizes error:', error);
      return [];
    }
  }

  /**
   * Get all available colors for a product
   */
  async getAvailableColors(
    productId: string,
    size?: string
  ): Promise<Array<{ color: string; color_hex: string | null }>> {
    try {
      let query = supabase
        .from('product_variants')
        .select('color, color_hex')
        .eq('product_id', productId)
        .eq('active', true)
        .gt('stock_quantity', 0);

      if (size) {
        query = query.eq('size', size);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Get available colors error:', error);
        return [];
      }

      // Remove duplicates based on color name
      return [...new Map(
        data?.map(v => [v.color, { color: v.color, color_hex: v.color_hex }]) || []
      ).values()];
    } catch (error) {
      console.error('Get available colors error:', error);
      return [];
    }
  }

  /**
   * Check stock availability for a variant
   */
  async checkStock(variantId: string, quantity: number = 1): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', variantId)
        .eq('active', true)
        .single();

      if (error || !data) {
        return false;
      }

      return data.stock_quantity >= quantity;
    } catch (error) {
      console.error('Check stock error:', error);
      return false;
    }
  }

  /**
   * Get low stock variants
   */
  async getLowStockVariants(): Promise<Array<ProductVariant & { product_name: string }>> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          *,
          products!inner(name)
        `)
        .eq('active', true)
        .lte('stock_quantity', supabase.raw('low_stock_threshold'));

      if (error) {
        console.error('Get low stock variants error:', error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        product_name: (item.products as any).name,
      }));
    } catch (error) {
      console.error('Get low stock variants error:', error);
      return [];
    }
  }

  /**
   * Get variants by SKU
   */
  async getVariantBySku(sku: string): Promise<ProductVariant | null> {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('sku', sku)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Get variant by SKU error:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Get variant by SKU error:', error);
      return null;
    }
  }
}

export const variantsService = new VariantsService();
