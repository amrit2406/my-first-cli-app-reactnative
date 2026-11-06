import { cartReducer } from '../src/shop/cartReducer';
import { CartItem, Product } from '../src/shop/types';

// LESSON: UNIT TESTS
// Pattern: Arrange (set up input) -> Act (call the function) -> Assert
// (check the result). Run with `npm test`.

const product = (id: number, price = 10): Product => ({
  id,
  title: `Product ${id}`,
  description: '',
  price,
  rating: 4,
  category: 'test',
  thumbnail: '',
});

describe('cartReducer', () => {
  test('ADD puts a new product in the cart with qty 1', () => {
    const state = cartReducer([], { type: 'ADD', product: product(1) });
    expect(state).toHaveLength(1);
    expect(state[0].qty).toBe(1);
  });

  test('ADD on an existing product increases its qty instead of duplicating', () => {
    let state: CartItem[] = [];
    state = cartReducer(state, { type: 'ADD', product: product(1) });
    state = cartReducer(state, { type: 'ADD', product: product(1) });
    expect(state).toHaveLength(1);
    expect(state[0].qty).toBe(2);
  });

  test('DECREASE lowers qty, and removes the item at zero', () => {
    let state: CartItem[] = [{ product: product(1), qty: 2 }];
    state = cartReducer(state, { type: 'DECREASE', id: 1 });
    expect(state[0].qty).toBe(1);
    state = cartReducer(state, { type: 'DECREASE', id: 1 });
    expect(state).toHaveLength(0);
  });

  test('REMOVE deletes only the chosen product', () => {
    const state: CartItem[] = [
      { product: product(1), qty: 1 },
      { product: product(2), qty: 1 },
    ];
    const next = cartReducer(state, { type: 'REMOVE', id: 1 });
    expect(next.map(i => i.product.id)).toEqual([2]);
  });

  test('never mutates the previous state', () => {
    const state: CartItem[] = [{ product: product(1), qty: 1 }];
    cartReducer(state, { type: 'ADD', product: product(1) });
    expect(state[0].qty).toBe(1); // unchanged
  });

  test('CLEAR empties the cart', () => {
    const state: CartItem[] = [{ product: product(1), qty: 3 }];
    expect(cartReducer(state, { type: 'CLEAR' })).toEqual([]);
  });
});
