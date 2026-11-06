import { CartItem, Product } from './types';

// LESSON: SEPARATE PURE LOGIC FROM UI
// This file has no React and no native modules: it is just a function
// (oldState, action) -> newState. That makes it trivial to unit test
// (see __tests__/cartReducer.test.ts).

export type CartAction =
  | { type: 'LOAD'; items: CartItem[] }
  | { type: 'ADD'; product: Product }
  | { type: 'DECREASE'; id: number }
  | { type: 'REMOVE'; id: number }
  | { type: 'CLEAR' };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'LOAD':
      return action.items;

    case 'ADD': {
      const existing = state.find(i => i.product.id === action.product.id);
      if (existing) {
        return state.map(i =>
          i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...state, { product: action.product, qty: 1 }];
    }

    case 'DECREASE':
      return state
        .map(i => (i.product.id === action.id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0); // drop items that reach 0

    case 'REMOVE':
      return state.filter(i => i.product.id !== action.id);

    case 'CLEAR':
      return [];

    default:
      return state;
  }
}
