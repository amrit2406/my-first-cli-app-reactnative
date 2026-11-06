import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { CartItem, Order, OrderShipping } from './types';

type OrdersValue = {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    total: number,
    shipping?: OrderShipping,
  ) => void;
};

const OrdersContext = createContext<OrdersValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = usePersistentState<Order[]>('orders-v1', []);

  const placeOrder = useCallback(
    (items: CartItem[], total: number, shipping?: OrderShipping) => {
      const order: Order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items,
        total,
        shipping,
      };
      setOrders(prev => [order, ...prev]); // newest first
    },
    [setOrders],
  );

  const value = useMemo(() => ({ orders, placeOrder }), [orders, placeOrder]);

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used inside <OrdersProvider>');
  }
  return ctx;
}
