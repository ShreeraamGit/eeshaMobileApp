import { supabase, Database } from '../supabase';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderTracking = Database['public']['Tables']['order_tracking']['Row'];

export interface CreateOrderData {
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
  email: string;
  phone?: string;
  shipping_address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  stripe_payment_intent_id?: string;
}

export interface OrderWithTracking extends Order {
  tracking_events?: OrderTracking[];
}

class OrdersService {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderData): Promise<Order | null> {
    try {
      const { items, email, phone, shipping_address, stripe_payment_intent_id } = orderData;

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const vatRate = 20; // French VAT 20%
      const vatAmount = (subtotal * vatRate) / 100;
      const shippingAmount = 10; // Flat rate shipping for France
      const total = subtotal + vatAmount + shippingAmount;

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          email,
          phone: phone || null,
          items,
          subtotal,
          vat_rate: vatRate,
          vat_amount: vatAmount,
          shipping_amount: shippingAmount,
          total,
          status: 'pending',
          payment_status: stripe_payment_intent_id ? 'paid' : 'pending',
          stripe_payment_intent_id: stripe_payment_intent_id || null,
          shipping_address,
        })
        .select()
        .single();

      if (error) {
        console.error('CreateOrder error:', error);
        throw error;
      }

      // Create initial tracking event
      if (data) {
        await this.addTrackingEvent(data.id, 'order_placed', 'Commande reçue');
      }

      return data;
    } catch (error) {
      console.error('CreateOrder error:', error);
      return null;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('GetUserOrders error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('GetUserOrders error:', error);
      return [];
    }
  }

  /**
   * Get current user's orders
   */
  async getMyOrders(): Promise<Order[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      return this.getUserOrders(user.id);
    } catch (error) {
      console.error('GetMyOrders error:', error);
      return [];
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('GetOrderById error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('GetOrderById error:', error);
      return null;
    }
  }

  /**
   * Get order with tracking events
   */
  async getOrderWithTracking(orderId: string): Promise<OrderWithTracking | null> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        console.error('GetOrderWithTracking error:', orderError);
        return null;
      }

      const { data: tracking, error: trackingError } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (trackingError) {
        console.error('GetTracking error:', trackingError);
      }

      return {
        ...order,
        tracking_events: tracking || [],
      };
    } catch (error) {
      console.error('GetOrderWithTracking error:', error);
      return null;
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    trackingDescription?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('UpdateOrderStatus error:', error);
        return false;
      }

      // Add tracking event
      if (trackingDescription) {
        await this.addTrackingEvent(orderId, status, trackingDescription);
      }

      return true;
    } catch (error) {
      console.error('UpdateOrderStatus error:', error);
      return false;
    }
  }

  /**
   * Add tracking event
   */
  async addTrackingEvent(
    orderId: string,
    status: string,
    description: string,
    location: string = 'Paris, France'
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('order_tracking').insert({
        order_id: orderId,
        status,
        description,
        location,
      });

      if (error) {
        console.error('AddTrackingEvent error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('AddTrackingEvent error:', error);
      return false;
    }
  }

  /**
   * Get tracking events for an order
   */
  async getTrackingEvents(orderId: string): Promise<OrderTracking[]> {
    try {
      const { data, error } = await supabase
        .from('order_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('GetTrackingEvents error:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('GetTrackingEvents error:', error);
      return [];
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      return await this.updateOrderStatus(orderId, 'cancelled', 'Commande annulée');
    } catch (error) {
      console.error('CancelOrder error:', error);
      return false;
    }
  }
}

export const ordersService = new OrdersService();
