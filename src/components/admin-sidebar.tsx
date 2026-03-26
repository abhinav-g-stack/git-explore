import Link from 'next/link';
import { Home, Package, ShoppingCart, Users } from 'lucide-react';
import { Logo } from './logo';
import { Badge } from './ui/badge';
import { getProducts } from '@/lib/actions/product-actions';
import { getOrders } from '@/lib/actions/order-actions';

export async function AdminSidebar({ isMobile = false }) {
  const products = await getProducts();
  const orders = await getOrders();
  const productCount = products.length;
  const orderCount = orders.length;

  const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/dashboard/orders', icon: ShoppingCart, label: 'Orders', badge: orderCount.toString() },
    { href: '/admin/dashboard/products', icon: Package, label: 'Products', badge: productCount.toString() },
    { href: '/admin/dashboard/users', icon: Users, label: 'Users' },
  ];

  const content = (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.badge && (
            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
              {item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-auto py-2">
            {content}
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Logo />
      </div>
      <div className="flex-1">
        {content}
      </div>
    </div>
  );
}
