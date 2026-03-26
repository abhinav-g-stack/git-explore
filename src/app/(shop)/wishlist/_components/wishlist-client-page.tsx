"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import type { WishlistItem } from "@/lib/types";
import {
  getWishlist,
  removeFromWishlist,
} from "@/lib/actions/wishlist-actions";
import { addToCart } from "@/lib/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ShoppingCart, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WishlistClientPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getWishlist(user.id).then((data) => {
        setItems(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleRemove = async (productId: string, name: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    await removeFromWishlist(user.id, productId);
    toast({ title: "Removed", description: `${name} removed from wishlist.` });
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    if (!user) return;
    setMovingToCart(item.productId);
    try {
      await addToCart(user.id, item.productId, 1);
      await removeFromWishlist(user.id, item.productId);
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      toast({
        title: "Moved to cart!",
        description: `${item.name} has been added to your cart.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move item to cart.",
      });
    } finally {
      setMovingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground mb-4">
          Please log in to view your wishlist.
        </p>
        <Button asChild>
          <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground mb-4">
          Your wishlist is empty.
        </p>
        <Button asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <Image
                src={
                  item.imageUrl.startsWith("http") ||
                  item.imageUrl.startsWith("data:image")
                    ? item.imageUrl
                    : `https://placehold.co/100x100.png`
                }
                alt={item.name}
                width={100}
                height={100}
                className="rounded-md"
                data-ai-hint={`${item.category.toLowerCase().split(" ")[0]} ${item.name.toLowerCase().split(" ")[0]}`}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoveToCart(item)}
                  disabled={movingToCart === item.productId}
                >
                  {movingToCart === item.productId ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-4 w-4" />
                  )}
                  Move to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(item.productId, item.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
