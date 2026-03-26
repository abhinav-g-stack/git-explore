'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import type { Order } from '@/lib/types';
import { getOrdersByUser } from '@/lib/actions/order-actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function OrdersClientPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getOrdersByUser(user.id).then(userOrders => {
                setOrders(userOrders);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        return <p className="text-center text-muted-foreground">Please <Link href="/login" className="text-primary underline">login</Link> to see your orders.</p>
    }

    if (orders.length === 0) {
        return <p className="text-center text-muted-foreground">You haven't placed any orders yet.</p>;
    }

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <Card key={order.id}>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Order #{order.id.split('_')[1]}</CardTitle>
                            <CardDescription>Date: {new Date(order.date).toLocaleDateString()}</CardDescription>
                        </div>
                        <div className="text-right">
                             <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                             <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="items">
                                <AccordionTrigger>View Details ({order.items.length} items)</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="divide-y">
                                        {order.items.map(item => (
                                            <li key={item.productId} className="py-2 flex justify-between">
                                                <span>{item.quantity} x (Product ID: {item.productId.substring(0,8)}...)</span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
