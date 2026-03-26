import type { Category } from './types';

// This data is now dynamically generated in `order-actions.ts`
// and `product-actions.ts`. This file is kept for a single source
// of truth for category definitions if needed, but it is recommended
// to derive them from the products data.

export const categories: Category[] = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest and greatest in tech.' },
  { name: 'Apparel', slug: 'apparel', description: 'Stylish clothing for all occasions.' },
  { name: 'Home Goods', slug: 'home-goods', description: 'Everything for your modern home.' },
];
