import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts } from './api';
import { Product } from './types';

// LESSON: PAGINATION / INFINITE SCROLL
// Don't download 1000 products at once. Load a page, and when the user
// scrolls near the bottom, load the next page and APPEND it.
//
// This custom hook hides all of that so the screen stays simple.
export function useProductFeed(search: string, category: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // first page
  const [loadingMore, setLoadingMore] = useState(false); // next pages
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // useRef = a value that survives re-renders but does NOT cause one.
  // `requestId` lets us ignore "load more" results that belong to an
  // older search (e.g. user changed category while page 2 was loading).
  const requestId = useRef(0);
  const busyMore = useRef(false);

  // FIRST PAGE: runs whenever the search, category or reloadKey changes.
  useEffect(() => {
    const id = ++requestId.current;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProducts({ search, category, skip: 0 }, controller.signal)
      .then(page => {
        setProducts(page.products);
        setTotal(page.total);
      })
      .catch(e => {
        if (e.name !== 'AbortError') {
          setError(e.message || 'Something went wrong');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted && id === requestId.current) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, category, reloadKey]);

  // NEXT PAGE: called by FlatList's onEndReached.
  const loadMore = useCallback(async () => {
    if (loading || busyMore.current || products.length >= total) {
      return;
    }
    const id = requestId.current;
    busyMore.current = true;
    setLoadingMore(true);
    try {
      const page = await fetchProducts({
        search,
        category,
        skip: products.length,
      });
      if (id === requestId.current) {
        setProducts(prev => [...prev, ...page.products]);
      }
    } catch {
      // a failed "load more" is not fatal; the user can scroll again
    } finally {
      busyMore.current = false;
      setLoadingMore(false);
    }
  }, [loading, products.length, total, search, category]);

  const reload = useCallback(() => setReloadKey(k => k + 1), []);

  return { products, loading, loadingMore, error, loadMore, reload };
}
