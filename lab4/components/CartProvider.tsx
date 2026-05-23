'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'add'; payload: { id: string; title: string; price: number } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'clear' };

const CART_STORAGE_KEY = 'cart-items';

function loadCartState(): CartState {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [] };
    const parsed = JSON.parse(stored) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) {
      return { items: [] };
    }
    return parsed;
  } catch {
    return { items: [] };
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.payload.id,
            title: action.payload.title,
            price: action.payload.price,
            quantity: 1,
          },
        ],
      };
    }
    case 'remove':
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case 'clear':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addItem: (item: { id: string; title: string; price: number }) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartState);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      items: state.items,
      itemCount,
      addItem: (item) => dispatch({ type: 'add', payload: item }),
      removeItem: (id) => dispatch({ type: 'remove', payload: { id } }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
