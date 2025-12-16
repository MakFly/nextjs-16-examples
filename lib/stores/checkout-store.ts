import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for checkout steps
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutState {
  // Current step
  currentStep: CheckoutStep;

  // Cart items
  cartItems: CartItem[];

  // Form data
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;

  // Order status
  orderCompleted: boolean;
  orderId: string | null;

  // Actions
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Cart actions
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  // Form actions
  setShippingInfo: (info: ShippingInfo) => void;
  setPaymentInfo: (info: PaymentInfo) => void;

  // Complete order
  completeOrder: () => void;
  resetCheckout: () => void;

  // Computed values
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const STEPS_ORDER: CheckoutStep[] = ['cart', 'shipping', 'payment', 'confirmation'];

// Sample products for demo
export const sampleProducts: Omit<CartItem, 'quantity'>[] = [
  { id: '1', name: 'MacBook Pro 14"', price: 2499, image: '💻' },
  { id: '2', name: 'iPhone 15 Pro', price: 1199, image: '📱' },
  { id: '3', name: 'AirPods Pro', price: 249, image: '🎧' },
  { id: '4', name: 'Apple Watch Ultra', price: 799, image: '⌚' },
  { id: '5', name: 'iPad Pro 12.9"', price: 1099, image: '📲' },
];

export const useCheckoutStore = create<CheckoutState>()(
  devtools(
    persist(
      (set, get) => ({
        currentStep: 'cart',
        cartItems: [],
        shippingInfo: null,
        paymentInfo: null,
        orderCompleted: false,
        orderId: null,

        setStep: (step) => set({ currentStep: step }),

        nextStep: () => {
          const { currentStep } = get();
          const currentIndex = STEPS_ORDER.indexOf(currentStep);
          if (currentIndex < STEPS_ORDER.length - 1) {
            set({ currentStep: STEPS_ORDER[currentIndex + 1] });
          }
        },

        prevStep: () => {
          const { currentStep } = get();
          const currentIndex = STEPS_ORDER.indexOf(currentStep);
          if (currentIndex > 0) {
            set({ currentStep: STEPS_ORDER[currentIndex - 1] });
          }
        },

        addToCart: (item) => {
          const { cartItems } = get();
          const existingItem = cartItems.find((i) => i.id === item.id);

          if (existingItem) {
            set({
              cartItems: cartItems.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            });
          } else {
            set({
              cartItems: [...cartItems, { ...item, quantity: 1 }],
            });
          }
        },

        removeFromCart: (id) => {
          set({
            cartItems: get().cartItems.filter((item) => item.id !== id),
          });
        },

        updateQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(id);
            return;
          }
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          });
        },

        clearCart: () => set({ cartItems: [] }),

        setShippingInfo: (info) => set({ shippingInfo: info }),

        setPaymentInfo: (info) => set({ paymentInfo: info }),

        completeOrder: () => {
          const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
          set({
            orderCompleted: true,
            orderId,
            currentStep: 'confirmation',
          });
        },

        resetCheckout: () =>
          set({
            currentStep: 'cart',
            cartItems: [],
            shippingInfo: null,
            paymentInfo: null,
            orderCompleted: false,
            orderId: null,
          }),

        getCartTotal: () => {
          return get().cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
        },

        getCartItemCount: () => {
          return get().cartItems.reduce((count, item) => count + item.quantity, 0);
        },
      }),
      {
        name: 'checkout-storage',
        partialize: (state) => ({
          cartItems: state.cartItems,
          shippingInfo: state.shippingInfo,
          // Don't persist payment info for security
        }),
      }
    ),
    { name: 'checkout-store' }
  )
);
