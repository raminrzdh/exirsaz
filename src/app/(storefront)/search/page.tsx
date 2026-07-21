import { searchStore } from '@/app/(storefront)/search/actions';
import { ProductCardClient } from '@/components/storefront/ProductCardClient';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function SearchPage(props: { searchParams: Promise<{ q: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  
  const results = await searchStore(query);
  const { products, categories } = results;
  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          نتایج جستجو برای: <span className="text-indigo-600">«{query}»</span>
        </h1>
        <p className="text-slate-500">
          {products.length} محصول و {categories.length} دسته‌بندی یافت شد.
        </p>
      </div>

      {!hasResults ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">نتیجه‌ای یافت نشد</h3>
          <p className="text-slate-500 max-w-md text-center mb-6">
            متأسفانه هیچ محصول یا دسته‌بندی با کلمه مورد نظر شما پیدا نشد. لطفاً املای کلمه را بررسی کنید یا از کلمات مشابه استفاده کنید.
          </p>
          <Link 
            href="/products" 
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            مشاهده همه محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
                دسته‌بندی‌های مرتبط
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/products?category=${cat.slug}`}
                    className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full inline-block"></span>
                محصولات یافت شده
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCardClient
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price || 0,
                      salePrice: product.salePrice,
                      image: '/images/products/shade-net-green.jpg', // Placeholder since real image path might not be selected in findMany
                      rating: 4.5,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
