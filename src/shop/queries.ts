import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { fetchCategories, fetchProducts, SortKey } from './api';

// LESSON: TANSTACK QUERY (a.k.a. React Query)
// In the last version we wrote loading/error/abort/pagination code by hand
// (useProductFeed.ts). Query does all of that, plus:
//   - CACHING: go back to a category you already visited -> instant.
//   - RETRIES: failed requests are retried automatically.
//   - DEDUPING: two components asking for the same data = one request.
//   - REFETCHING: stale data is refreshed in the background.
//
// The `queryKey` identifies the data. When the key changes (say the user
// picks another category), Query fetches that new data (or uses the cache).

export function useProductsInfinite(
  search: string,
  category: string | null,
  sort: SortKey,
) {
  return useInfiniteQuery({
    queryKey: ['products', { search, category, sort }],

    // `pageParam` = the `skip` for the page being fetched.
    // `signal` lets Query cancel the request if it's no longer needed.
    queryFn: ({ pageParam, signal }) =>
      fetchProducts({ search, category, sort, skip: pageParam }, signal),

    initialPageParam: 0,

    // Return the next pageParam, or undefined when there are no more pages.
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + p.products.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },

    // Keep showing the old list while a new search/category loads,
    // instead of flashing an empty screen.
    placeholderData: keepPreviousData,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: Infinity, // the category list basically never changes
  });
}
