import { Product, User } from './types';

const BASE_URL = 'https://dummyjson.com';
export const PAGE_SIZE = 20;

// LESSON: one place for all network code.
// Screens never call fetch() directly. If the API changes, you fix it here.

// Shared helper: fetch + check status + parse JSON + readable errors.
async function request<T>(
  path: string,
  init?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init);

  // fetch only throws on network failure. A 400/500 still "succeeds",
  // so we must check response.ok ourselves.
  if (!response.ok) {
    let message = `Server error (${response.status})`;
    try {
      const body = await response.json();
      if (body?.message) {
        message = body.message; // e.g. "Invalid credentials"
      }
    } catch {
      // body wasn't JSON, keep the generic message
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export type ProductPage = { products: Product[]; total: number };

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'rating';

const SORT_PARAMS: Record<SortKey, string> = {
  default: '',
  'price-asc': '&sortBy=price&order=asc',
  'price-desc': '&sortBy=price&order=desc',
  rating: '&sortBy=rating&order=desc',
};

type FeedParams = {
  search: string;
  category: string | null;
  sort?: SortKey;
  skip: number; // PAGINATION: how many items to skip (0 = first page)
};

export function fetchProducts(
  { search, category, sort = 'default', skip }: FeedParams,
  signal?: AbortSignal,
): Promise<ProductPage> {
  const paging = `limit=${PAGE_SIZE}&skip=${skip}${SORT_PARAMS[sort]}`;
  let path = `/products?${paging}`;
  if (search) {
    path = `/products/search?q=${encodeURIComponent(search)}&${paging}`;
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}?${paging}`;
  }
  return request<ProductPage>(path, { signal });
}

export function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  return request<string[]>('/products/category-list', { signal });
}

export async function login(
  username: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const data = await request<User & { accessToken: string }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });

  return {
    token: data.accessToken,
    user: {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    },
  };
}
