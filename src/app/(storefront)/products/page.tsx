import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { prisma } from '@/lib/db/prisma';
import { ProductsSidebarClient } from '@/components/storefront/ProductsSidebarClient';
import { ProductsEmptyState } from '@/components/storefront/ProductsEmptyState';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categorySlug = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;
  const page = typeof resolvedParams.page === 'string' ? Math.max(1, parseInt(resolvedParams.page, 10)) : 1;
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseInt(resolvedParams.minPrice, 10) : undefined;
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseInt(resolvedParams.maxPrice, 10) : undefined;
  const province = typeof resolvedParams.province === 'string' ? resolvedParams.province : undefined;
  const city = typeof resolvedParams.city === 'string' ? resolvedParams.city : undefined;
  const limit = 12;
  const skip = (page - 1) * limit;

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const whereClause: any = {};
  
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = minPrice;
    if (maxPrice) whereClause.price.lte = maxPrice;
  }

  if (province || city) {
    whereClause.agencies = {
      some: {
        cities: {
          some: {
            ...(city ? { name: city } : {}),
            ...(province ? { province: { name: province } } : {})
          }
        }
      }
    };
  }

  const [totalProducts, products] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      include: { category: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalPages = Math.ceil(totalProducts / limit);
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
        <ProductsSidebarClient categories={categories} />

        {/* Product Grid */}
        <div className="flex-grow">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              نمایش {toPersianDigits((skip + 1).toString())} تا {toPersianDigits(Math.min(skip + limit, totalProducts).toString())} از {toPersianDigits(totalProducts.toString())} محصول
            </span>
            <select className="border-none bg-slate-50 rounded-lg text-sm px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-200">
              <option>جدیدترین</option>
              <option>ارزان‌ترین</option>
              <option>گران‌ترین</option>
            </select>
          </div>

          {products.length === 0 ? (
            <ProductsEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => {
                const imageUrl = (typeof product.images === 'string' ? JSON.parse(product.images) : product.images)?.[0] || 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg';
                return (
                  <Link 
                    href={`/products/${product.slug}`} 
                    key={product.id} 
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-emerald-100 transition-all duration-[400ms] ease-out-strong animate-stagger-item"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-100 p-4">
                      <Image 
                        src={imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-out-strong"
                        unoptimized
                      />
                    </div>
                    <div className="p-5 flex flex-col h-[180px]">
                      <div className="text-xs font-bold text-emerald-600 mb-2">{product.category?.name || 'عمومی'}</div>
                      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        {product.salesType === 'DIRECT_SALE' && product.price ? (
                          product.salePrice ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-400 line-through decoration-rose-500/50">{formatToman(product.price)}</span>
                                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                  {toPersianDigits(Math.round(((product.price - product.salePrice) / product.price) * 100))}٪
                                </span>
                              </div>
                              <div className="text-lg font-bold text-rose-600">
                                {formatToman(product.salePrice)}
                              </div>
                            </div>
                          ) : (
                            <div className="text-lg font-bold text-slate-900">
                              {formatToman(product.price)}
                            </div>
                          )
                        ) : (
                          <div className="text-sm font-bold text-indigo-600">
                            استعلام موجودی و قیمت
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Preserve existing query params for pagination
                const queryParams = new URLSearchParams();
                if (categorySlug) queryParams.set('category', categorySlug);
                if (minPrice) queryParams.set('minPrice', minPrice.toString());
                if (maxPrice) queryParams.set('maxPrice', maxPrice.toString());
                if (province) queryParams.set('province', province);
                if (city) queryParams.set('city', city);
                queryParams.set('page', pageNum.toString());

                const href = `/products?${queryParams.toString()}`;
                
                return (
                  <Link 
                    href={href}
                    key={pageNum}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${pageNum === page ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {toPersianDigits(pageNum.toString())}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
