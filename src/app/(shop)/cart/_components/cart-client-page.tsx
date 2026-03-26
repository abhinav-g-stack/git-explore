"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import type { Cart, CartItem } from "@/lib/types";
import { getCart, updateCartItemQuantity } from "@/lib/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2 } from "lucide-react";
import { getProductImageUrl } from "@/lib/placeholder";

export function CartClientPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getCart(user.id).then((cartData) => {
        setCart(cartData);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!user || !cart) return;

    const updatedItems = cart.items
      .map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
      .filter((item) => item.quantity > 0);

    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const newItemCount = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // Optimistic update
    setCart({ items: updatedItems, total: newTotal, itemCount: newItemCount });

    await updateCartItemQuantity(user.id, productId, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !cart || cart.items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground mb-4">
          Your cart is empty.
        </p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {cart.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-4 p-4"
                >
                  <Image
                    src={getProductImageUrl(item.imageUrl, item.name)}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.productId}`}
                      className="font-semibold hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.productId,
                          parseInt(e.target.value),
                        )
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.productId, 0)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="font-semibold w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <Separator />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
