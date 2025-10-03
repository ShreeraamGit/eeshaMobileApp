import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

export interface PaymentIntentData {
  amount: number; // in euros
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentSheetParams {
  paymentIntentClientSecret: string;
  merchantDisplayName?: string;
  customerId?: string;
  customerEphemeralKeySecret?: string;
}

class StripeService {
  /**
   * Initialize payment sheet
   */
  async initializePaymentSheet(params: PaymentSheetParams): Promise<{ error?: string }> {
    try {
      const { error } = await initPaymentSheet({
        merchantDisplayName: params.merchantDisplayName || 'Eesha Silks',
        paymentIntentClientSecret: params.paymentIntentClientSecret,
        customerId: params.customerId,
        customerEphemeralKeySecret: params.customerEphemeralKeySecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          address: {
            country: 'FR',
          },
        },
      });

      if (error) {
        console.error('InitializePaymentSheet error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('InitializePaymentSheet error:', error);
      return { error: 'Failed to initialize payment sheet' };
    }
  }

  /**
   * Present payment sheet to user
   */
  async presentPaymentSheet(): Promise<{ error?: string }> {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('PresentPaymentSheet error:', error);
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('PresentPaymentSheet error:', error);
      return { error: 'Payment failed' };
    }
  }

  /**
   * Create payment intent on your backend
   * This should call your API endpoint that creates a Stripe PaymentIntent
   */
  async createPaymentIntent(
    data: PaymentIntentData,
    apiUrl: string
  ): Promise<{ clientSecret?: string; error?: string }> {
    try {
      const response = await fetch(`${apiUrl}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(data.amount * 100), // Convert to cents
          currency: data.currency || 'eur',
          description: data.description,
          metadata: data.metadata,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { error: result.error || 'Failed to create payment intent' };
      }

      return { clientSecret: result.clientSecret };
    } catch (error) {
      console.error('CreatePaymentIntent error:', error);
      return { error: 'Network error' };
    }
  }

  /**
   * Complete payment flow
   */
  async processPayment(
    amount: number,
    description: string,
    apiUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: Create payment intent
      const { clientSecret, error: intentError } = await this.createPaymentIntent(
        { amount, description, metadata },
        apiUrl
      );

      if (intentError || !clientSecret) {
        return { success: false, error: intentError };
      }

      // Step 2: Initialize payment sheet
      const { error: initError } = await this.initializePaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });

      if (initError) {
        return { success: false, error: initError };
      }

      // Step 3: Present payment sheet
      const { error: presentError } = await this.presentPaymentSheet();

      if (presentError) {
        return { success: false, error: presentError };
      }

      return { success: true };
    } catch (error) {
      console.error('ProcessPayment error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }
}

export const stripeService = new StripeService();
