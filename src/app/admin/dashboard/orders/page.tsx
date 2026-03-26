import { getOrders } from "@/lib/actions/order-actions";
import { OrdersClientPage } from "./_components/orders-client-page";

export default async function AdminOrdersPage() {
    const orders = await getOrders();
    return <OrdersClientPage orders={orders} />;
}
