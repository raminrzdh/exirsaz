import Image from 'next/image';
import Link from 'next/link';
import { Filter, Star } from 'lucide-react';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';

// Mock data
const PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  name: `گوشی موبایل هوشمند مدل ${i + 1}`,
  price: 15000000 + (i * 2000000),
  image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=800',
  rating: 4.5,
  category: 'موبایل',
}));

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-indigo-600">خانه</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">فروشگاه</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-indigo-600" />
              فیلترها
            </h3>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-slate-700">دسته‌بندی</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                    موبایل
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                    لپ‌تاپ
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
                    <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                    ساعت هوشمند
                  </label>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-slate-700">محدوده قیمت</h4>
              <input type="range" className="w-full accent-indigo-600" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>۰ تومان</span>
                <span>۱۰۰ میلیون تومان</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              نمایش ۱ تا ۱۲ از ۱۲۰ محصول
            </span>
            <select className="border-none bg-slate-50 rounded-lg text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200">
              <option>جدیدترین</option>
              <option>پرفروش‌ترین</option>
              <option>ارزان‌ترین</option>
              <option>گران‌ترین</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product, idx) => (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id} 
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-[400ms] ease-out-strong animate-stagger-item"
                style={{ animationDelay: `${idx * 40}ms` }}
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
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button 
                key={page}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${page === 1 ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {toPersianDigits(page.toString())}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
