"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./auth-provider";
import { useToast } from "@/hooks/use-toast";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/lib/actions/wishlist-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  variant?: "icon" | "full";
}

export function WishlistButton({
  productId,
  productName,
  variant = "icon",
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      isInWishlist(user.id, productId).then(setWishlisted);
    }
  }, [user, productId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(user.id, productId);
        setWishlisted(false);
        toast({
          title: "Removed from wishlist",
          description: `${productName} removed from your wishlist.`,
        });
      } else {
        await addToWishlist(user.id, productId);
        setWishlisted(true);
        toast({
          title: "Added to wishlist!",
          description: `${productName} has been added to your wishlist.`,
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={handleToggle}
        disabled={isLoading}
      >
        <Heart
          className={cn(
            "mr-2 h-5 w-5",
            wishlisted && "fill-red-500 text-red-500",
          )}
        />
        {wishlisted ? "In Wishlist" : "Add to Wishlist"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      className="h-8 w-8"
    >
      <Heart
        className={cn("h-4 w-4", wishlisted && "fill-red-500 text-red-500")}
      />
      <span className="sr-only">
        {wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      </span>
    </Button>
  );
}
