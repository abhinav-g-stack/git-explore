"use client";

import Link from 'next/link';
import { Logo } from './logo';
import { Github, Twitter, Youtube } from 'lucide-react';
import { categories } from '@/lib/data';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your one-stop shop for the latest trends and technologies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold tracking-wide">Shop by Category</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/shop?category=${category.slug}`} className="text-muted-foreground hover:text-foreground">
                    {category.name}
                  </Link>
                </li>
              ))}
               <li>
                  <Link href="/shop" className="text-muted-foreground hover:text-foreground">
                    Shop All
                  </Link>
                </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-wide">Customer Service</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold tracking-wide">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Github /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Youtube /></Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EcomWave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
