export interface OrderItem {
  id: number;
  name: string;
  qty: number;
  size: string;
  notes: string;
  addons: string[];
  price: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export interface Addon {
  name: string;
  price: number;
}
