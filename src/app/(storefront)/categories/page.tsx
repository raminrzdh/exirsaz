import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import { toPersianDigits } from '@/lib/utils/currency';

export const metadata = {
  title: 'دسته‌بندی‌های محصولات | اکسیرساز',
  description: 'مشاهده و بررسی تمامی دسته‌بندی‌های محصولات در فروشگاه اکسیرساز',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: {
      products: {
        _count: 'desc'
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <LayoutGrid className="w-8 h-8 text-indigo-600" />
          دسته‌بندی‌های محصولات
        </h1>
        <p className="text-slate-500">تمامی دسته‌بندی‌های موجود در فروشگاه را مشاهده کنید.</p>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <h3 className="text-lg font-bold text-slate-700 mb-2">دسته‌بندی یافت نشد!</h3>
          <p className="text-slate-500">هنوز هیچ دسته‌بندی برای محصولات ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-4 md:p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <LayoutGrid className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {category.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                  {toPersianDigits(category._count.products.toString())} محصول
                </span>
                <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
