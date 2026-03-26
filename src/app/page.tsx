import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/actions/product-actions";

export default async function Home() {
  const allProducts = await getProducts();

  const getProductsForCategory = (slug: string) => {
    // Normalize category name to match slug format (e.g., "Home Goods" -> "home-goods")
    return allProducts
      .filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === slug)
      .slice(0, 4);
  }

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image 
          src="https://placehold.co/1600x900.png" 
          alt="Hero background" 
          fill
          priority
          className="object-cover -z-10 brightness-50"
          data-ai-hint="vibrant online shopping"
        />
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold !text-white drop-shadow-lg">Welcome to EcomWave</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto !text-gray-200 drop-shadow-md">Your one-stop shop for the latest trends and technologies.</p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/shop">Shop Now <ArrowRight className="ml-2" /></Link>
          </Button>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category.slug} className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-headline font-bold">{category.name}</h2>
              <Button asChild variant="link" className="text-primary">
                <Link href={`/shop?category=${category.slug}`}>
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {getProductsForCategory(category.slug).map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
