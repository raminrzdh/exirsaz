'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Store, ShoppingCart, User, LayoutGrid } from 'lucide-react';
import { useCart } from '@/lib/store/CartContext';
import { toPersianDigits } from '@/lib/utils/currency';

export function BottomNav() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'خانه', icon: Home, href: '/' },
    { label: 'دسته‌بندی', icon: LayoutGrid, href: '/categories' },
    { label: 'فروشگاه', icon: Store, href: '/products' },
    { label: 'سبد خرید', icon: ShoppingCart, href: '/checkout', isCart: true },
    { label: 'پروفایل', icon: User, href: '/login' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-indigo-100' : ''}`} />
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {toPersianDigits(cartCount.toString())}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
