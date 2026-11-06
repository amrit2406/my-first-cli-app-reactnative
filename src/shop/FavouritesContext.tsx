import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { Product } from './types';

type FavouritesValue = {
  favourites: Product[];
  isFavourite: (id: number) => boolean;
  toggle: (product: Product) => void;
};

const FavouritesContext = createContext<FavouritesValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  // Same shape as useState, but saved automatically.
  const [favourites, setFavourites] = usePersistentState<Product[]>(
    'favourites-v1',
    [],
  );

  const toggle = useCallback(
    (product: Product) => {
      // Functional update: setX(prev => next). Always uses the latest state.
      setFavourites(prev =>
        prev.some(p => p.id === product.id)
          ? prev.filter(p => p.id !== product.id)
          : [product, ...prev],
      );
    },
    [setFavourites],
  );

  const value = useMemo<FavouritesValue>(
    () => ({
      favourites,
      toggle,
      isFavourite: id => favourites.some(p => p.id === id),
    }),
    [favourites, toggle],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error('useFavourites must be used inside <FavouritesProvider>');
  }
  return ctx;
}
