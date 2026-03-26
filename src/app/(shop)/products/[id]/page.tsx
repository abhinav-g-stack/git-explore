import { notFound } from "next/navigation";
import Image from "next/image";
import { getProduct } from "@/lib/actions/product-actions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { getProductImageUrl } from "@/lib/placeholder";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={getProductImageUrl(product.imageUrl, product.name)}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">
              {product.name}
            </h1>
            <p className="text-3xl text-primary font-semibold mt-4">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <AddToCartButton
              productId={product.id}
              productName={product.name}
            />
            <WishlistButton
              productId={product.id}
              productName={product.name}
              variant="full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
