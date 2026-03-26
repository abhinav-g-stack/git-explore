// This page requires a client component to get the user ID
import { CartClientPage } from './_components/cart-client-page';

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
            <CartClientPage />
        </div>
    );
}

// Create a new folder _components inside cart folder
// and add the client component there. This is a pattern to keep
// server pages clean and delegate client logic.
