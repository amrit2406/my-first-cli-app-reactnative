// Shape of a product coming from https://dummyjson.com/products
export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
  images?: string[]; // optional: favourites saved by older versions lack it
};

export type CartItem = {
  product: Product;
  qty: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

export type Order = {
  id: string;
  date: string; // ISO string, e.g. "2026-11-06T10:00:00.000Z"
  items: CartItem[];
  total: number;
  shipping?: OrderShipping; // optional: older saved orders don't have it
};

export type OrderShipping = {
  name: string;
  address: string;
  payment: string;
};

// LESSON: typed navigation.
// Lists every screen in the root stack and the params each one needs.
export type RootStackParamList = {
  Login: undefined; // shown only when signed out
  Tabs: undefined; // no params
  Detail: { product: Product }; // must be given a product
  Checkout: undefined;
};

export type TabParamList = {
  Shop: undefined;
  Favourites: undefined;
  Cart: undefined;
  Profile: undefined;
};
