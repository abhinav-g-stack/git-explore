"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { getCart } from '@/lib/actions/cart-actions';
import type { Cart } from '@/lib/types';

export function CartButton() {
  const { user } = useAuth();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    async function fetchCart() {
      if (user) {
        try {
          // This relies on revalidation to stay up to date.
          // For a more real-time experience, a library like SWR or React Query
          // with optimistic updates would be beneficial.
          const cart: Cart = await getCart(user.id);
          setItemCount(cart.itemCount);
        } catch (error) {
          console.error("Failed to fetch cart", error);
          setItemCount(0);
        }
      } else {
        setItemCount(0);
      }
    }
    fetchCart();
  }, [user]);

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Cart</span>
      </Link>
    </Button>
  );
}
