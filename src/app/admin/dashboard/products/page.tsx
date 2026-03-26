import { getProducts } from "@/lib/actions/product-actions";
import { ProductsClientPage } from "./_components/products-client-page";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsClientPage products={products} />;
}
