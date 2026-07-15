import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';

// Mock data for initial UI rendering
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra',
    price: 68500000,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'لپ‌تاپ اپل مدل MacBook Pro M3 2023',
    price: 115000000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'ساعت هوشمند اپل واچ سری ۹',
    price: 21500000,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'هدفون بلوتوثی سونی مدل WH-1000XM5',
    price: 16800000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
  }
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-slate-900/90 z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80')] bg-cover bg-center" 
        />
        
        <div className="container mx-auto px-4 py-24 relative z-20 flex flex-col items-center text-center sm:items-start sm:text-start">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-sm mb-6 border border-indigo-500/30">
            جشنواره فروش ویژه تابستانه
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight max-w-3xl">
            تجربه خریدی <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">هوشمندانه</span> و بی‌نظیر با اکسیرساز
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            بروزترین گجت‌ها، لوازم الکترونیکی و محصولات دیجیتال را با بهترین قیمت و ضمانت اصالت کالا از ما بخواهید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto text-lg px-8">
              مشاهده محصولات
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:text-white px-8">
              پیگیری سفارش
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            محصولات پرفروش
          </h2>
          <Link href="/products" className="text-indigo-600 font-medium hover:underline flex items-center gap-1 text-sm">
            مشاهده همه <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product, idx) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-[400ms] ease-out-strong animate-stagger-item"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-out-strong"
                />
              </div>
              <div className="p-5 flex flex-col h-[180px]">
                <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-slate-700">{toPersianDigits(product.rating.toString())}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-lg font-bold text-indigo-600">
                    {formatToman(product.price)}
                  </div>
                  <Button size="sm" variant="secondary" className="rounded-full px-4">
                    خرید
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Banner Section */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-indigo-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between text-white gap-8">
            <div className="max-w-xl text-center md:text-start">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">آیا آماده یک تغییر بزرگ هستید؟</h2>
              <p className="text-indigo-100 text-lg mb-8">
                با عضویت در خبرنامه ما، از جدیدترین تخفیف‌ها و محصولات پیش از دیگران باخبر شوید و ۵۰,۰۰۰ تومان کد تخفیف اولین خرید دریافت کنید.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
                <input 
                  type="email" 
                  placeholder="شماره موبایل یا ایمیل خود را وارد کنید" 
                  className="flex-grow h-12 rounded-lg px-4 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
                <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                  ثبت نام
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative w-64 h-64">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <Star className="w-full h-full text-white/90 relative z-10 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
