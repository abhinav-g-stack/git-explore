import { redirect } from 'next/navigation';
import { CheckoutClientPage } from './_components/checkout-client-page';

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
                <CheckoutClientPage />
            </div>
        </div>
    );
}
