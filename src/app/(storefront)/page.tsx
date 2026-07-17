import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, BookOpen, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { ProductCardClient } from '@/components/storefront/ProductCardClient';
import { prisma } from '@/lib/db/prisma';

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });
    
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg')] bg-cover bg-center mix-blend-overlay" 
        />
        
        <div className="container mx-auto px-4 py-24 relative z-20 flex flex-col items-center text-center sm:items-start sm:text-start">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 font-medium text-sm mb-6 border border-emerald-500/30">
            تولید کننده برتر توری‌های پلیمری در ایران
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight max-w-3xl">
            تولید کننده انواع <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">توری سایبان</span> و کیسه راشل
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            شرکت اکسیرساز شمال، پیشرو در تولید شبکه توری سایبان (شید)، لفاف ساختمان و کیسه‌های توری با بهترین کیفیت و مواد اولیه درجه یک.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="gap-2 w-full sm:w-auto text-lg px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              مشاهده محصولات
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:text-white px-8">
              مشاوره و خرید
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
          {featuredProducts.map((rawProduct, idx) => {
            const product = {
              id: rawProduct.id,
              name: rawProduct.name,
              price: rawProduct.price || 0,
              slug: rawProduct.slug,
              image: (typeof rawProduct.images === 'string' ? JSON.parse(rawProduct.images) : rawProduct.images)?.[0] || 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
              rating: 5,
            };
            return (
              <div key={product.id} className="animate-stagger-item" style={{ animationDelay: `${idx * 50}ms` }}>
                <ProductCardClient product={product as any} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="container mx-auto px-4 bg-slate-50 py-16 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              آخرین مقالات مجله
            </h2>
            <Link href="/blog" className="text-indigo-600 font-medium hover:underline flex items-center gap-1 text-sm">
              مشاهده مجله <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {posts.map((post, idx) => (
              <Link 
                key={post.id}
                href={`/blog/${post.id}`}
                className="group shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] snap-center bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-[400ms] ease-out-strong flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {post.thumbnail ? (
                    <Image 
                      src={post.thumbnail} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-out-strong"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 leading-relaxed group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{toPersianDigits(post.views.toString())} بازدید</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {/* Banner Section */}
      <section className="container mx-auto px-4">
        <div className="rounded-3xl bg-emerald-600 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between text-white gap-8">
            <div className="max-w-xl text-center md:text-start">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">نیاز به مشاوره برای پوشش گلخانه دارید؟</h2>
              <p className="text-emerald-100 text-lg mb-8">
                با عضویت در خبرنامه ما، از جدیدترین محصولات کشاورزی و ساختمانی باخبر شوید و از تخفیف‌های ویژه برای خرید عمده مطلع گردید.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto md:mx-0">
                <input 
                  type="email" 
                  placeholder="شماره موبایل یا ایمیل خود را وارد کنید" 
                  className="flex-grow h-12 rounded-lg px-4 text-slate-900 outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
                />
                <Button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                  ثبت نام
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative w-64 h-64">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <div className="w-full h-full border-4 border-white/40 rounded-full flex items-center justify-center relative z-10 drop-shadow-2xl">
                <div className="w-48 h-48 border-4 border-white/60 rounded-full flex items-center justify-center">
                  <div className="text-4xl font-black text-white text-center leading-tight">
                    تضمین<br/>کیفیت
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
