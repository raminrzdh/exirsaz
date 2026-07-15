import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Mock data for the product
  const product = {
    id: resolvedParams.id,
    name: 'گوشی موبایل سامسونگ مدل Galaxy S24 Ultra دو سیم کارت ظرفیت 256 گیگابایت و رم 12 گیگابایت',
    price: 68500000,
    originalPrice: 72000000,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1610945444265-243e8d7bb680?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviews: 124,
    description: 'گلکسی S24 اولترا جدیدترین پرچمدار سامسونگ با دوربین 200 مگاپیکسلی و پردازنده اسنپدراگون 8 نسل 3...',
    features: [
      { name: 'حافظه داخلی', value: '۲۵۶ گیگابایت' },
      { name: 'مقدار رم', value: '۱۲ گیگابایت' },
      { name: 'فناوری صفحه‌نمایش', value: 'Dynamic AMOLED 2X' },
      { name: 'شبکه‌های ارتباطی', value: '5G، 4G، 3G' },
    ]
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">خانه</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-indigo-600">موبایل</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 line-clamp-1 inline-block align-bottom max-w-[200px] sm:max-w-md">{product.name}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          
          {/* Product Gallery (RTL Right side normally, but in grid it's first) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-contain p-8"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <div key={idx} className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 cursor-pointer ${idx === 0 ? 'border-indigo-600' : 'border-slate-200 opacity-70 hover:opacity-100'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex gap-2 shrink-0">
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm mb-8">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium text-slate-700">{toPersianDigits(product.rating.toString())}</span>
                <span className="text-slate-400">({toPersianDigits(product.reviews.toString())} دیدگاه)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Features List */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">ویژگی‌های کلیدی</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-indigo-200 shrink-0" />
                      <span className="text-slate-500">{feature.name}:</span>
                      <span className="font-medium text-slate-900">{feature.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Purchase Box */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    گارانتی ۱۸ ماهه شرکتی
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Truck className="w-5 h-5 text-indigo-600" />
                    ارسال رایگان (خرید بالای ۵ میلیون)
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                    هفت روز ضمانت بازگشت کالا
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 mb-6">
                  {discount > 0 && (
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="line-through text-slate-400 text-sm">{formatToman(product.originalPrice)}</span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {toPersianDigits(discount.toString())}٪
                      </span>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-slate-900 text-end">
                    {formatToman(product.price)}
                  </div>
                </div>

                <Button size="lg" className="w-full gap-2 text-lg">
                  <ShoppingCart className="w-5 h-5" />
                  افزودن به سبد خرید
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
