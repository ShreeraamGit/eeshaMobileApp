import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const CART_STORAGE_KEY = 'cart_items';

export interface CartItem {
  variant_id: string; // Product variant ID
  product_id: string; // Parent product ID
  name: string; // Product name
  size: string; // Selected size
  color: string; // Selected color
  sku: string; // SKU for tracking
  price: number; // Variant price
  quantity: number;
  image_url?: string;
  stock_quantity?: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;

  // Computed values
  itemCount: number;
  subtotal: number;
  vatAmount: number;
  shippingAmount: number;
  total: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loadCart: () => void;
  getItemQuantity: (productId: string) => number;
}

// VAT and shipping constants
const VAT_RATE = 0.20; // 20% French VAT
const SHIPPING_FLAT_RATE = 10.0; // €10 flat rate for France

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  itemCount: 0,
  subtotal: 0,
  vatAmount: 0,
  shippingAmount: SHIPPING_FLAT_RATE,
  total: 0,

  addItem: (item) => {
    const state = get();
    // Check if same variant already in cart
    const existingItem = state.items.find((i) => i.variant_id === item.variant_id);

    let newItems: CartItem[];

    if (existingItem) {
      // Update quantity if same variant already exists
      newItems = state.items.map((i) =>
        i.variant_id === item.variant_id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      // Add new item (different variant)
      newItems = [...state.items, item];
    }

    // Calculate totals
    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount + SHIPPING_FLAT_RATE;
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

    // Save to storage
    storage.set(CART_STORAGE_KEY, JSON.stringify(newItems));

    set({
      items: newItems,
      subtotal,
      vatAmount,
      total,
      itemCount,
    });
  },

  removeItem: (variantId) => {
    const state = get();
    const newItems = state.items.filter((i) => i.variant_id !== variantId);

    // Calculate totals
    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount + SHIPPING_FLAT_RATE;
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

    // Save to storage
    storage.set(CART_STORAGE_KEY, JSON.stringify(newItems));

    set({
      items: newItems,
      subtotal,
      vatAmount,
      total,
      itemCount,
    });
  },

  updateQuantity: (variantId, quantity) => {
    const state = get();

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      get().removeItem(variantId);
      return;
    }

    const newItems = state.items.map((i) =>
      i.variant_id === variantId ? { ...i, quantity } : i
    );

    // Calculate totals
    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount + SHIPPING_FLAT_RATE;
    const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

    // Save to storage
    storage.set(CART_STORAGE_KEY, JSON.stringify(newItems));

    set({
      items: newItems,
      subtotal,
      vatAmount,
      total,
      itemCount,
    });
  },

  clearCart: () => {
    storage.delete(CART_STORAGE_KEY);
    set({
      items: [],
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      itemCount: 0,
    });
  },

  loadCart: () => {
    try {
      const cartData = storage.getString(CART_STORAGE_KEY);
      if (cartData) {
        const items: CartItem[] = JSON.parse(cartData);

        // Calculate totals
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const vatAmount = subtotal * VAT_RATE;
        const total = subtotal + vatAmount + SHIPPING_FLAT_RATE;
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

        set({
          items,
          subtotal,
          vatAmount,
          total,
          itemCount,
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },

  getItemQuantity: (variantId) => {
    const state = get();
    const item = state.items.find((i) => i.variant_id === variantId);
    return item?.quantity || 0;
  },
}));
