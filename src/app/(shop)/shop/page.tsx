import { getProducts } from '@/lib/actions/product-actions';
import { categories } from '@/lib/data';
import { ShopFilters } from '@/components/shop-filters';

export default async function ShopPage() {
  const products = await getProducts();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Shop Our Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find what you're looking for.</p>
      </div>
      <ShopFilters products={products} categories={categories} />
    </div>
  );
}
