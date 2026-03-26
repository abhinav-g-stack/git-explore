import { OrdersClientPage } from './_components/orders-client-page';

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
            <OrdersClientPage />
        </div>
    );
}
