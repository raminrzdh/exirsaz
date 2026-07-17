'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '@/lib/store/CartContext';
import { toPersianDigits } from '@/lib/utils/currency';
import { LocationGateModal } from '../storefront/LocationGateModal';
import { useState } from 'react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export function Navbar({ categories = [] }: { categories?: CategoryItem[] }) {
  const { items, userLocation } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Right side (RTL Start) - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              اکسیرساز
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 ms-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">خانه</Link>
            <Link href="/products" className="hover:text-indigo-600 transition-colors">فروشگاه</Link>
            
            <div className="relative group">
              <Link href="/products" className="hover:text-indigo-600 transition-colors flex items-center gap-1 py-4">
                دسته‌بندی‌ها
              </Link>
              {categories.length > 0 && (
                <div className="absolute top-full right-0 w-48 bg-white border border-slate-100 shadow-xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                  <div className="py-2">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id} 
                        href={`/products?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-indigo-600 transition-colors">درباره ما</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">تماس با ما</Link>
          </nav>
        </div>

        {/* Left side (RTL End) - Search, User, Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Global Location Badge */}
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-xs font-medium transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="max-w-[120px] truncate hidden sm:inline">
              {userLocation ? `ارسال به: ${userLocation.city}` : 'انتخاب شهر'}
            </span>
            <span className="truncate sm:hidden max-w-[80px]">
              {userLocation ? userLocation.city : 'شهر'}
            </span>
          </button>

          <div className="hidden md:flex items-center relative">
            <input 
              type="text" 
              placeholder="جستجوی محصولات..." 
              className="h-10 w-64 rounded-full bg-slate-100 border-transparent px-4 pe-10 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute end-3" />
          </div>

          <Link href="/checkout" className="hidden md:block">
            <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 rounded-full">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 end-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {toPersianDigits(cartCount.toString())}
                </span>
              )}
            </Button>
          </Link>
          
          <Link href="/login" className="hidden sm:flex">
            <Button variant="outline" size="sm" className="rounded-full gap-2 font-medium">
              <User className="w-4 h-4" />
              ورود / ثبت‌نام
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex">
          <div className="w-3/4 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl text-slate-900">منوی سایت</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                بستن
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 text-slate-700 font-medium overflow-y-auto pb-6">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 py-3 border-b border-slate-100">خانه</Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 py-3 border-b border-slate-100">فروشگاه</Link>
              
              <div className="py-2 border-b border-slate-100">
                <span className="text-slate-400 text-sm mb-2 block">دسته‌بندی‌ها</span>
                <div className="flex flex-col gap-1 pr-4 border-r-2 border-slate-100">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-sm text-slate-600 hover:text-indigo-600"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-sm font-bold text-indigo-600">همه محصولات</Link>
                </div>
              </div>

              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 py-3 border-b border-slate-100">درباره ما</Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-indigo-600 py-3 border-b border-slate-100">تماس با ما</Link>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
      
      <LocationGateModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSet={() => setIsLocationModalOpen(false)}
      />
    </header>
  );
}
