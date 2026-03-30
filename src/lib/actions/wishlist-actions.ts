"use server";

import fs from "fs/promises";
import path from "path";
import type { WishlistItem } from "@/lib/types";
import { getProduct } from "./product-actions";
import { revalidatePath } from "next/cache";

const wishlistsFilePath = path.join(process.cwd(), "data/wishlists.json");

async function readWishlists(): Promise<Record<string, WishlistItem[]>> {
  try {
    const data = await fs.readFile(wishlistsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    console.error("Error reading wishlists file:", error);
    return {};
  }
}

async function writeWishlists(wishlists: Record<string, WishlistItem[]>) {
  await fs.writeFile(wishlistsFilePath, JSON.stringify(wishlists, null, 2));
}

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const wishlists = await readWishlists();
  return wishlists[userId] || [];
}

export async function isInWishlist(
  userId: string,
  productId: string,
): Promise<boolean> {
  const wishlists = await readWishlists();
  const userWishlist = wishlists[userId] || [];
  return userWishlist.some((item) => item.productId === productId);
}

export async function addToWishlist(userId: string, productId: string) {
  if (!userId) throw new Error("User not logged in");

  const wishlists = await readWishlists();
  const product = await getProduct(productId);
  if (!product) throw new Error("Product not found");

  const userWishlist = wishlists[userId] || [];
  if (userWishlist.some((item) => item.productId === productId)) {
    return; // Already in wishlist
  }

  userWishlist.push({
    productId,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    addedAt: new Date().toISOString(),
  });

  wishlists[userId] = userWishlist;
  await writeWishlists(wishlists);
  revalidatePath("/wishlist");
}

export async function removeFromWishlist(userId: string, productId: string) {
  if (!userId) throw new Error("User not logged in");

  const wishlists = await readWishlists();
  const userWishlist = wishlists[userId] || [];
  wishlists[userId] = userWishlist.filter(
    (item) => item.productId !== productId,
  );
  await writeWishlists(wishlists);
  revalidatePath("/wishlist");
}

export async function clearWishlist(userId: string) {
  if (!userId) throw new Error("User not logged in");
  const wishlists = await readWishlists();
  wishlists[userId] = [];
  await writeWishlists(wishlists);
  revalidatePath("/wishlist");
}
