'use server'

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import type { Product, Category } from '@/lib/types';

const productsFilePath = path.join(process.cwd(), 'src/data/products.json');

async function getProductsFromFile(): Promise<Product[]> {
    try {
        const jsonData = await fs.readFile(productsFilePath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error reading products file:', error);
        return [];
    }
}

async function writeProducts(products: Product[]) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing products file:', error);
    throw new Error('Could not save products data.');
  }
}

export async function getProducts(): Promise<Product[]> {
  return await getProductsFromFile();
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getProductsFromFile();
  return products.find(p => p.id === id);
}

export async function getCategories(): Promise<Category[]> {
    const products = await getProductsFromFile();
    const categoryNames = [...new Set(products.map(p => p.category))];
    return categoryNames.map(name => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: `Browse our ${name} collection.` // Generic description
    }));
}

export async function createProduct(newProductData: Omit<Product, 'id'>) {
    const products = await getProductsFromFile();
    const newProduct: Product = {
        ...newProductData,
        id: `prod_${String(Date.now())}_${Math.random().toString(36).substr(2, 5)}`,
    };
    products.unshift(newProduct);
    await writeProducts(products);

    revalidatePath('/admin/dashboard/products');
    revalidatePath('/admin/dashboard');
    revalidatePath('/shop');
    revalidatePath('/');
    return newProduct;
}

export async function updateProduct(updatedProduct: Product) {
  let products = await getProductsFromFile();
  const productIndex = products.findIndex(p => p.id === updatedProduct.id);

  if (productIndex === -1) {
    throw new Error('Product not found');
  }
  
  products[productIndex] = updatedProduct;
  await writeProducts(products);
  
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/admin/dashboard');
  revalidatePath(`/products/${updatedProduct.id}`);
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function deleteProduct(id: string) {
  let products = await getProductsFromFile();
  products = products.filter(p => p.id !== id);
  await writeProducts(products);
  
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/admin/dashboard');
  revalidatePath('/shop');
  revalidatePath('/');
}
