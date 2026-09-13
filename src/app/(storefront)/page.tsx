import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Shield, Truck, Droplet, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { ProductCardClient } from '@/components/storefront/ProductCardClient';
import { prisma } from '@/lib/db/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اکسیرساز شمال - تولیدکننده برتر توری سایبان و کیسه راشل',
  description: 'محصولات پلیمری، کیسه راشل و توری‌های سایبان را با تضمین کیفیت و مستقیم از درب کارخانه اکسیرساز تهیه کنید. کاهش تبخیر و محافظت از گیاهان گلخانه.',
  openGraph: {
    title: 'اکسیرساز شمال - تولیدکننده برتر توری سایبان و کیسه راشل',
    description: 'محصولات پلیمری، کیسه راشل و توری‌های سایبان را با تضمین کیفیت و مستقیم از درب کارخانه اکسیرساز تهیه کنید. کاهش تبخیر و محافظت از گیاهان گلخانه.',
    images: ['https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg'],
  },
};

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { status: 'published' },
    take: 4,
    orderBy: { createdAt: 'desc' }
  });
    
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col bg-paper min-h-screen font-sans selection:bg-samara-blue selection:text-white">
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

      {/* Hero Section - Samara ADU Style (Edge-to-Edge) */}
      <section className="relative w-full h-[90vh] md:h-[95vh] flex flex-col justify-end pb-12 px-4 md:px-8 overflow-hidden rounded-b-[40px] md:rounded-b-[64px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-greenhouse.jpg"
            alt="نمای داخلی گلخانه با پوشش توری سایبان اکسیرساز"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={90}
          />
          {/* Subtle gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Floating Top Pill Nav (Mock for style) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center bg-white/90 backdrop-blur-md px-2 py-2 rounded-pills shadow-subtle gap-2">
          <span className="px-5 py-2.5 rounded-pills bg-obsidian text-white text-[14px] font-medium transition-colors">سایبان‌ها</span>
          <span className="px-5 py-2.5 rounded-pills text-graphite text-[14px] font-medium hover:bg-mist transition-colors cursor-pointer">کیسه راشل</span>
          <span className="px-5 py-2.5 rounded-pills text-graphite text-[14px] font-medium hover:bg-mist transition-colors cursor-pointer">ایمنی</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center text-center">
          <h1 className="text-[56px] md:text-[80px] lg:text-[110px] font-medium text-white leading-[1.05] tracking-tight mb-8">
            فضای سبز،<br />
            تضمین شده.
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/products">
              <Button className="h-[56px] rounded-buttons px-8 bg-samara-blue text-white font-medium text-[16px] hover:bg-blue-600 transition-colors shadow-subtle border-0">
                مشاهده محصولات
              </Button>
            </Link>
            <Button className="h-[56px] rounded-buttons px-8 bg-white/20 backdrop-blur-md text-white font-medium text-[16px] hover:bg-white/30 transition-colors border border-white/30 gap-2">
              <PlayCircle className="w-5 h-5" />
              تور مجازی کارخانه
            </Button>
          </div>
        </div>
      </section>

      {/* Showroom / Category Feature - Large Edge to Edge Cards */}
      <section className="container max-w-[1400px] mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-start">
          <div>
            <h2 className="text-[40px] md:text-[56px] font-medium text-obsidian leading-[1.1] tracking-tight">محصولات منتخب</h2>
            <p className="text-[18px] text-steel mt-4 max-w-xl leading-relaxed">
              تولید شده با بالاترین استانداردهای آنتی‌یووی (UV) برای محافظت از سرمایه شما در برابر آفتاب و آفات.
            </p>
          </div>
          <Link href="/categories" className="text-samara-blue font-medium text-[16px] flex items-center gap-2 hover:gap-3 transition-all">
            مرور همه محصولات <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature Card 1 */}
          <Link href="/products/greenhouse-shade-net" className="group block relative h-[500px] md:h-[650px] rounded-cards overflow-hidden bg-cloud">
            <Image 
              src="https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg"
              alt="توری سایبان"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-10 inset-x-10 flex items-end justify-between">
              <div>
                <h3 className="text-[32px] md:text-[40px] font-medium text-white leading-tight mb-2">شید گلخانه</h3>
                <p className="text-white/80 text-[16px]">پوشش‌های سایبان با تراکم ۳۰ تا ۹۰ درصد</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-samara-blue transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Feature Card 2 */}
          <Link href="/products/parking-shade" className="group block relative h-[500px] md:h-[650px] rounded-cards overflow-hidden bg-cloud">
            <Image 
              src="/images/parking-shade.jpg"
              alt="سایبان پارکینگ"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-10 inset-x-10 flex items-end justify-between">
              <div>
                <h3 className="text-[32px] md:text-[40px] font-medium text-white leading-tight mb-2">سایبان پارکینگ</h3>
                <p className="text-white/80 text-[16px]">حفاظت از خودرو در برابر اشعه مخرب آفتاب</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-samara-blue transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* The Process Grid - Samara Style */}
      <section className="bg-snow border-y border-cloud py-24 md:py-32">
        <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-10">
            <h2 className="text-[40px] md:text-[64px] font-medium text-obsidian leading-[1.1] tracking-tight max-w-2xl text-start">
              خرید بی‌واسطه، <br />
              کیفیت تضمین‌شده.
            </h2>
            <div className="flex items-center gap-3 bg-paper px-4 py-2 rounded-pills text-[14px] text-graphite font-medium border border-cloud">
              <span className="w-2 h-2 rounded-full bg-samara-blue"></span>
              ارسال به سراسر کشور
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 border-t border-cloud pt-12">
            {/* Step 1 */}
            <div className="flex flex-col text-start group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[14px] font-medium text-steel">۰۱</span>
                <Shield className="w-6 h-6 text-samara-blue" />
              </div>
              <h3 className="text-[24px] font-medium text-obsidian mb-4">کیفیت مواد اولیه</h3>
              <p className="text-[15px] text-steel leading-relaxed font-normal">
                استفاده از بهترین مواد پلیمری (HDPE) به همراه افزودنی‌های Anti-UV اروپایی برای مقاومت حداکثری در برابر نور خورشید.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col text-start group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[14px] font-medium text-steel">۰۲</span>
                <Droplet className="w-6 h-6 text-samara-blue" />
              </div>
              <h3 className="text-[24px] font-medium text-obsidian mb-4">کاهش تبخیر آب</h3>
              <p className="text-[15px] text-steel leading-relaxed font-normal">
                محصولات ما با ایجاد سایه استاندارد، مصرف آب در گلخانه‌ها و باغات را تا ۴۰ درصد کاهش می‌دهند.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col text-start group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[14px] font-medium text-steel">۰۳</span>
                <Sprout className="w-6 h-6 text-samara-blue" />
              </div>
              <h3 className="text-[24px] font-medium text-obsidian mb-4">تنوع بافت و تراکم</h3>
              <p className="text-[15px] text-steel leading-relaxed font-normal">
                تولید در تراکم‌های ۳۰، ۵۰، ۶۰ و ۸۰ درصد با رنگ‌بندی متنوع مناسب با نوع اقلیم و گیاه شما.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col text-start group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[14px] font-medium text-steel">۰۴</span>
                <Truck className="w-6 h-6 text-samara-blue" />
              </div>
              <h3 className="text-[24px] font-medium text-obsidian mb-4">ارسال مستقیم</h3>
              <p className="text-[15px] text-steel leading-relaxed font-normal">
                بدون واسطه و مستقیماً از درب کارخانه خرید کنید. ارسال سریع و مطمئن به تمام نقاط ایران.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (Carousel styling in Samara is usually edge-to-edge cards) */}
      <section className="container max-w-[1400px] mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 text-start">
          <h2 className="text-[32px] md:text-[48px] font-medium text-obsidian leading-[1.1] tracking-tight">محبوب‌ترین محصولات</h2>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {featuredProducts.map((rawProduct) => {
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
              <div key={product.id} className="min-w-[300px] w-[85vw] md:w-[350px] shrink-0 snap-center bg-snow rounded-cards p-5 border border-cloud">
                <ProductCardClient product={product as any} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Blog / Journal - Editorial Style */}
      {posts.length > 0 && (
        <section className="bg-snow border-t border-cloud py-24">
          <div className="container max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6 text-start">
              <h2 className="text-[32px] md:text-[48px] font-medium text-obsidian leading-[1.1] tracking-tight">
                مجله تخصصی
              </h2>
              <Link href="/blog" className="inline-flex items-center justify-center bg-paper text-graphite font-medium text-[15px] px-6 py-3 rounded-pills hover:bg-mist transition-colors">
                مشاهده همه مقالات
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group flex flex-col"
                >
                  <div className="relative aspect-[4/3] rounded-cards overflow-hidden bg-cloud mb-6">
                    {post.thumbnail && (
                      <Image 
                        src={post.thumbnail} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 text-start">
                    <div className="text-[12px] font-medium text-samara-blue mb-2">{post.category}</div>
                    <h3 className="text-[18px] font-medium text-obsidian mb-2 line-clamp-2 leading-[1.4]">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
