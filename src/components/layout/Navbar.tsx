import Link from 'next/link';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Right side (RTL Start) - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden text-slate-600 hover:text-slate-900">
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
            <Link href="/products" className="hover:text-indigo-600 transition-colors">فروشگاه</Link>
            <Link href="/categories" className="hover:text-indigo-600 transition-colors">دسته‌بندی‌ها</Link>
            <Link href="/about" className="hover:text-indigo-600 transition-colors">درباره ما</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition-colors">تماس با ما</Link>
          </nav>
        </div>

        {/* Left side (RTL End) - Search, User, Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center relative">
            <input 
              type="text" 
              placeholder="جستجوی محصولات..." 
              className="h-10 w-64 rounded-full bg-slate-100 border-transparent px-4 pe-10 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute end-3" />
          </div>

          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 rounded-full">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-0 end-0 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                0
              </span>
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full gap-2 font-medium">
              <User className="w-4 h-4" />
              ورود / ثبت‌نام
            </Button>
            <Button variant="ghost" size="sm" className="sm:hidden h-10 w-10 p-0 rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
