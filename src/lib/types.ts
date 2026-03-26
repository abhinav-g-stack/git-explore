export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

export interface User {
  id:string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export type Admin = User & {
  role: 'admin';
};

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
  category: string;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  total: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number; // Price at time of purchase
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  date: string; // ISO 8601 string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}
