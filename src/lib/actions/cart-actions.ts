'use server';

import fs from 'fs/promises';
import path from 'path';
import type { Cart, CartItem } from '@/lib/types';
import { getProduct, getProducts } from './product-actions';
import { revalidatePath } from 'next/cache';

const cartsFilePath = path.join(process.cwd(), 'src/data/carts.json');

async function readCarts(): Promise<Record<string, CartItem[]>> {
  try {
    const data = await fs.readFile(cartsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {};
    }
    console.error('Error reading carts file:', error);
    return {};
  }
}

async function writeCarts(carts: Record<string, CartItem[]>) {
  await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
}

export async function getCart(userId: string): Promise<Cart> {
    const carts = await readCarts();
    const userCartItems = carts[userId] || [];
  
    let total = 0;
    let itemCount = 0;
  
    for (const item of userCartItems) {
      total += item.price * item.quantity;
      itemCount += item.quantity;
    }
  
    return {
      items: userCartItems,
      itemCount,
      total,
    };
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  if (!userId) throw new Error('User not logged in');
  
  const carts = await readCarts();
  const product = await getProduct(productId);
  if (!product) throw new Error('Product not found');

  const userCart = carts[userId] || [];
  const existingItem = userCart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.push({
      productId,
      quantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
    });
  }

  carts[userId] = userCart;
  await writeCarts(carts);
  revalidatePath('/cart');
  revalidatePath('/'); // For header cart count
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number) {
  if (!userId) throw new Error('User not logged in');

  const carts = await readCarts();
  const userCart = carts[userId] || [];

  if (quantity <= 0) {
    // If quantity is 0 or less, remove the item
    carts[userId] = userCart.filter(item => item.productId !== productId);
  } else {
    const itemToUpdate = userCart.find(item => item.productId === productId);
    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      carts[userId] = userCart;
    }
  }
  
  await writeCarts(carts);
  revalidatePath('/cart');
}

export async function removeFromCart(userId: string, productId: string) {
    if (!userId) throw new Error('User not logged in');
    await updateCartItemQuantity(userId, productId, 0);
}

export async function clearCart(userId: string) {
    if (!userId) throw new Error('User not logged in');
    const carts = await readCarts();
    carts[userId] = [];
    await writeCarts(carts);
    revalidatePath('/cart');
}
