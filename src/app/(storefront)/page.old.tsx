import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, BookOpen, Calendar, Eye, ShieldCheck, Truck, HeadphonesIcon, Factory, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'اکسیرساز شمال',
          image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
          '@id': 'https://exirsaz.com',
          url: 'https://exirsaz.com',
          telephone: '+981132025',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'شهرک صنعتی منصورکنده',
            addressLocality: 'بابل',
            addressRegion: 'مازندران',
            addressCountry: 'IR'
          },
          description: 'تولید کننده انواع توری سایبان (شید)، کیسه راشل و لفاف ساختمان با بهترین کیفیت.'
        }) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <Image 
          src="https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg" 
          alt="تولید توری سایبان و شید گلخانه اکسیرساز" 
          fill 
          priority 
          className="object-cover object-center mix-blend-overlay"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 z-10" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-20 flex flex-col items-center text-center sm:items-start sm:text-start">
          <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm mb-6 border border-emerald-500/30">
            تولید کننده برتر توری‌های پلیمری در ایران
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight max-w-3xl">
            تولید کننده انواع <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">توری سایبان</span> و کیسه راشل
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            شرکت اکسیرساز شمال، پیشرو در تولید شبکه توری سایبان (شید)، لفاف ساختمان و کیسه‌های توری با بهترین کیفیت و مواد اولیه درجه یک.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/products" className="w-full sm:w-auto" aria-label="مشاهده تمام محصولات">
              <Button size="lg" className="gap-2 w-full text-lg px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/50 cursor-pointer">
                مشاهده محصولات
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto" aria-label="تماس برای مشاوره و خرید">
              <Button variant="outline" size="lg" className="w-full text-white border-white/30 hover:bg-white/10 hover:text-white px-8 backdrop-blur-sm cursor-pointer">
                مشاوره و خرید
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 -mt-24 relative z-30">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-slate-100 divide-x-reverse">
            <div className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0 first:pt-0">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                <Factory className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">خرید بدون واسطه</h3>
              <p className="text-xs text-slate-500">مستقیم از درب کارخانه</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">تضمین کیفیت</h3>
              <p className="text-xs text-slate-500">مواد اولیه با استاندارد جهانی</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">ارسال به سراسر کشور</h3>
              <p className="text-xs text-slate-500">سریع و مطمئن به تمام نقاط</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 pt-6 md:pt-0">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                <HeadphonesIcon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base">مشاوره تخصصی</h3>
              <p className="text-xs text-slate-500">پشتیبانی و راهنمای پیش از خرید</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Category Showcase - New Structure */}
      <section className="container mx-auto px-4 mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-4">دسته‌بندی‌های اصلی</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">تنوع بی‌نظیر محصولات پلیمری و شبکه‌های توری مناسب برای مصارف کشاورزی، ساختمانی و خانگی.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { title: 'توری سایبان (شید گلخانه)', slug: 'greenhouse-shade-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-emerald-50 border-emerald-100' },
            { title: 'توری سایبان دامداری‌ها', slug: 'livestock-shade-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-emerald-50 border-emerald-100' },
            { title: 'توری سایبان پارکینگ', slug: 'parking-shade-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-emerald-50 border-emerald-100' },
            { title: 'جلوگیری از آفتاب سوختگی', slug: 'sunburn-protection-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-emerald-50 border-emerald-100' },
            { title: 'توری پوشش استخر', slug: 'pool-cover-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-emerald-50 border-emerald-100' },
            
            { title: 'کیسه محافظ خرما', slug: 'date-protection-bag', img: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg', color: 'bg-amber-50 border-amber-100' },
            { title: 'بسته‌بندی پرتقال', slug: 'orange-packaging-net', img: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg', color: 'bg-amber-50 border-amber-100' },
            { title: 'کیسه توری راشل', slug: 'raschel-mesh-bag', img: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg', color: 'bg-amber-50 border-amber-100' },
            { title: 'بسته‌بندی علوفه', slug: 'forage-packaging-net', img: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg', color: 'bg-amber-50 border-amber-100' },
            { title: 'بسته‌بندی کلم', slug: 'cabbage-packaging-net', img: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg', color: 'bg-amber-50 border-amber-100' },
            
            { title: 'توری حصاری', slug: 'fence-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-indigo-50 border-indigo-100' },
            { title: 'توری ضد پرنده', slug: 'anti-bird-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-indigo-50 border-indigo-100' },
            { title: 'توری جمع‌آوری محصول', slug: 'harvest-collection-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-indigo-50 border-indigo-100' },
            { title: 'توری ضد تگرگ', slug: 'anti-hail-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-indigo-50 border-indigo-100' },
            { title: 'توری ایمنی ساختمان', slug: 'safety-net', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-indigo-50 border-indigo-100' },
            
            { title: 'گیره نصب سایبان', slug: 'shade-net-clips', img: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg', color: 'bg-cyan-50 border-cyan-100' },
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={`/products/${item.slug}`}
              className="group flex flex-col gap-3 animate-stagger-item bg-white p-3 md:p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className={`w-full aspect-[4/3] rounded-2xl ${item.color} border overflow-hidden relative transition-all duration-300`}>
                <Image 
                  src={item.img} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out-strong mix-blend-multiply" 
                  unoptimized 
                />
              </div>
              <span className="text-base font-bold text-center text-slate-800 group-hover:text-indigo-600 transition-colors px-1 leading-relaxed mt-1">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-indigo-600" />
            محصولات پرفروش
          </h2>
          <Link href="/products" className="text-indigo-600 font-medium hover:underline flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-full transition-colors hover:bg-indigo-100 text-sm">
            مشاهده همه <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((rawProduct, idx) => {
            const product = {
              id: rawProduct.id,
              name: rawProduct.name,
              price: rawProduct.price || 0,
              salePrice: rawProduct.salePrice,
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

      {/* Why Us / Stats Section */}
      <section className="bg-slate-900 py-24 relative overflow-hidden text-white mt-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10" />
        <div className="absolute -top-64 -right-64 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-64 -left-64 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8 text-center lg:text-start">
              <span className="inline-block text-emerald-400 font-bold tracking-wider text-sm bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">چرا اکسیرساز شمال؟</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">بیش از دو دهه تجربه در قلب صنعت پلیمر ایران</h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ما با بهره‌گیری از ماشین‌آلات روز دنیا و متخصصین مجرب، توانسته‌ایم سهم بزرگی در تأمین نیازهای کشاورزی و صنعتی کشور ایفا کنیم. کیفیت برتر محصولات ما نتیجه‌ی نظارت دقیق و استفاده از مرغوب‌ترین مواد اولیه است.
              </p>
              <ul className="space-y-4 pt-4 text-start max-w-md mx-auto lg:mx-0">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><Check className="w-5 h-5" /></div>
                  <span className="text-lg">تولید بر اساس استانداردهای جهانی</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><Check className="w-5 h-5" /></div>
                  <span className="text-lg">محصولات آنتی‌یووی با طول عمر بالا</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><Check className="w-5 h-5" /></div>
                  <span className="text-lg">تنوع رنگ، ابعاد و تراکم برای مصارف خاص</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full max-w-xl lg:max-w-none mx-auto">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="text-5xl md:text-6xl font-black text-emerald-400 mb-3">{toPersianDigits('+20')}</div>
                  <div className="text-slate-300 font-medium text-lg">سال سابقه تولید</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="text-5xl md:text-6xl font-black text-cyan-400 mb-3">{toPersianDigits('+50')}</div>
                  <div className="text-slate-300 font-medium text-lg">نمایندگی در کشور</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="text-5xl md:text-6xl font-black text-indigo-400 mb-3">{toPersianDigits('+1000')}</div>
                  <div className="text-slate-300 font-medium text-lg">مشتری سازمانی</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                  <div className="text-5xl md:text-6xl font-black text-amber-400 mb-3">{toPersianDigits('%100')}</div>
                  <div className="text-slate-300 font-medium text-lg">تضمین کیفیت کالا</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="container mx-auto px-4 mt-8">
          <div className="bg-slate-50 py-16 px-6 md:px-12 rounded-[2.5rem] border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-indigo-600" />
                آخرین مقالات مجله
              </h2>
              <Link href="/blog" className="text-indigo-600 font-medium hover:underline flex items-center gap-1.5 bg-indigo-100/50 px-4 py-2 rounded-full transition-colors hover:bg-indigo-100 text-sm">
                مشاهده مجله <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              {posts.map((post, idx) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] snap-center bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-900/5 hover:border-indigo-100 transition-all duration-[400ms] ease-out-strong flex flex-col"
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
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 leading-relaxed text-lg group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-500 pt-5 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                        <Eye className="w-4 h-4" />
                        <span>{toPersianDigits(post.views.toString())} بازدید</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Banner Section */}
      <section className="container mx-auto px-4 mt-4">
        <div className="rounded-[2.5rem] bg-emerald-600 overflow-hidden relative shadow-xl shadow-emerald-900/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 flex flex-col md:flex-row items-center justify-between text-white gap-12">
            <div className="max-w-xl text-center md:text-start">
              <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">نیاز به مشاوره برای پوشش گلخانه دارید؟</h2>
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                با عضویت در خبرنامه ما، از جدیدترین محصولات کشاورزی و ساختمانی باخبر شوید و از تخفیف‌های ویژه برای خرید عمده مطلع گردید.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                <input 
                  id="newsletter-input"
                  aria-label="شماره موبایل یا ایمیل برای مشاوره"
                  type="email" 
                  placeholder="شماره موبایل یا ایمیل خود را وارد کنید" 
                  className="flex-grow h-14 rounded-xl px-5 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-300 text-sm placeholder:text-slate-400 cursor-text"
                />
                <Button aria-label="دریافت مشاوره و عضویت در خبرنامه" className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white shrink-0 rounded-xl text-base font-bold shadow-lg shadow-slate-900/20 cursor-pointer">
                  دریافت مشاوره
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block relative w-72 h-72">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse" />
              <div className="w-full h-full border-[6px] border-white/20 rounded-full flex items-center justify-center relative z-10 drop-shadow-2xl">
                <div className="w-56 h-56 border-4 border-white/40 rounded-full flex items-center justify-center bg-emerald-500/20 backdrop-blur-sm">
                  <div className="text-5xl font-black text-white text-center leading-tight">
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
