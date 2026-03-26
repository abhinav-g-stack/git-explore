"use client";

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useAuth } from './auth-provider';
import { addToCart } from '@/lib/actions/cart-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export function AddToCartButton({ productId, productName }: { productId: string, productName: string }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
        router.push('/login');
        return;
    }
    setIsLoading(true);
    try {
        await addToCart(user.id, productId, 1);
        toast({
            title: "Added to cart!",
            description: `${productName} has been added to your cart.`,
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to add item to cart.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
      Add to Cart
    </Button>
  );
}
