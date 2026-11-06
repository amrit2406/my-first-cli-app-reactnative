import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartReducer } from './cartReducer';
import { CartItem, Product } from './types';

// LESSON: GLOBAL STATE = Context + useReducer
// Cart data is needed by several screens (list, detail, cart, tab badge).
// Passing it as props through every screen would be painful, so we put it
// in a Context that any component can read. The reducer itself lives in
// cartReducer.ts so it can be unit tested.

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  add: (p: Product) => void;
  decrease: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [loaded, setLoaded] = React.useState(false);

  // LESSON: useEffect
  // Runs code AFTER render. The [] means "only once, when first shown".
  // Here: read the saved cart from phone storage on app start.
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          dispatch({ type: 'LOAD', items: JSON.parse(saved) });
        }
      } catch {
        // corrupt/missing data: just start with an empty cart
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Runs every time `items` changes: save the cart.
  // We wait for `loaded` so we don't overwrite saved data with [] at startup.
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
    }
  }, [items, loaded]);

  // useMemo: only recompute when `items` changes.
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount: items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: items.reduce((sum, i) => sum + i.qty * i.product.price, 0),
      add: product => dispatch({ type: 'ADD', product }),
      decrease: id => dispatch({ type: 'DECREASE', id }),
      remove: id => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// A custom hook: any component can call useCart() to get the cart.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}
