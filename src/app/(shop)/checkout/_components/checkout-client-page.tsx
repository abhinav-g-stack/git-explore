'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import type { Cart, User } from '@/lib/types';
import { getCart } from '@/lib/actions/cart-actions';
import { createOrder } from '@/lib/actions/order-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function CheckoutSummary({ cart }: { cart: Cart }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4 mb-4">
                    {cart.items.map(item => (
                        <li key={item.productId} className="flex items-center gap-4">
                             <Image 
                                src={item.imageUrl.startsWith('http') || item.imageUrl.startsWith('data:image') ? item.imageUrl : `https://placehold.co/64x64.png`} 
                                alt={item.name} 
                                width={64} 
                                height={64} 
                                className="rounded-md" 
                                data-ai-hint={`${item.category.toLowerCase().split(' ')[0]} ${item.name.toLowerCase().split(' ')[0]}`}
                             />
                             <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                             </div>
                             <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
                <Separator />
                <div className="space-y-2 mt-4">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${cart.total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function CheckoutClientPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        if (user) {
            getCart(user.id).then(cartData => {
                if (cartData.items.length === 0) {
                    router.replace('/cart');
                } else {
                    setCart(cartData);
                }
                setIsLoading(false);
            });
        } else {
            router.replace('/login');
        }
    }, [user, router]);
    
    const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !cart) return;

        setIsPlacingOrder(true);
        try {
            const newOrder = await createOrder(user.id, user.name, user.email, cart.items);
            toast({
                title: "Order Placed!",
                description: "Thank you for your purchase."
            });
            // Redirect to a dedicated order confirmation page could be an improvement
            router.push(`/orders`);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Order Failed",
                description: "Could not place your order. Please try again."
            });
            setIsPlacingOrder(false);
        }
    };

    if (isLoading || !cart) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user?.name} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={user?.email} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Main St" required />
                        </div>
                         <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Anytown" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input id="zip" placeholder="12345" required />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">This is a demo. No real payment will be processed.</p>
                        <div className="space-y-2">
                           <Label htmlFor="card-number">Card Number</Label>
                           <Input id="card-number" placeholder="**** **** **** 1234" defaultValue="4242 4242 4242 4242" required/>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="space-y-2 col-span-2">
                               <Label htmlFor="expiry">Expiry</Label>
                               <Input id="expiry" placeholder="MM / YY" defaultValue="12 / 28" required />
                           </div>
                           <div className="space-y-2">
                               <Label htmlFor="cvc">CVC</Label>
                               <Input id="cvc" placeholder="123" defaultValue="123" required/>
                           </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <CheckoutSummary cart={cart} />
                <Button type="submit" className="w-full" size="lg" disabled={isPlacingOrder}>
                    {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Order
                </Button>
            </div>
        </form>
    );
}
