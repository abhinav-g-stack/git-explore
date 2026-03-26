import { WishlistClientPage } from "./_components/wishlist-client-page";

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">My Wishlist</h1>
      <WishlistClientPage />
    </div>
  );
}
