import { supabase, Database } from '../supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

class ProductsService {
  /**
   * Get all products with optional filters and pagination
   */
  async getProducts(
    filters: ProductFilters = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<ProductsResponse> {
    try {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('active', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Order by newest first
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('GetProducts error:', error);
        throw error;
      }

      return {
        products: data || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('GetProducts error:', error);
      throw error;
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) {
        console.error('GetProductById error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('GetProductById error:', error);
      return null;
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('GetProductsByCategory error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('GetProductsByCategory error:', error);
      return [];
    }
  }

  /**
   * Search products
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('SearchProducts error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('SearchProducts error:', error);
      return [];
    }
  }

  /**
   * Get featured/new products
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('GetFeaturedProducts error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('GetFeaturedProducts error:', error);
      return [];
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('active', true)
        .not('category', 'is', null);

      if (error) {
        console.error('GetCategories error:', error);
        throw error;
      }

      // Get unique categories
      const categories = [...new Set(data?.map((p) => p.category).filter(Boolean))];
      return categories as string[];
    } catch (error) {
      console.error('GetCategories error:', error);
      return [];
    }
  }

  /**
   * Check product stock availability
   */
  async checkStock(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .eq('active', true)
        .single();

      if (error || !data) {
        return false;
      }

      return data.stock_quantity >= quantity;
    } catch (error) {
      console.error('CheckStock error:', error);
      return false;
    }
  }
}

export const productsService = new ProductsService();
