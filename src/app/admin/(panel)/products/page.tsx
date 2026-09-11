import Link from 'next/link';
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db/prisma';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';

// Fallback mock data in case DB connection fails in dev environment without Postgres
const MOCK_PRODUCTS = [
  { id: '1', name: 'گوشی موبایل سامسونگ Galaxy S24 Ultra', sku: 'SAMSUNG-S24U', price: 68500000, stock: 12, category: { name: 'موبایل' } },
  { id: '2', name: 'لپ‌تاپ مک‌بوک پرو M3', sku: 'APPLE-MBP-M3', price: 115000000, stock: 5, category: { name: 'لپ‌تاپ' } },
  { id: '3', name: 'ساعت هوشمند اپل واچ 9', sku: 'APPLE-AW9', price: 21500000, stock: 0, category: { name: 'گجت هوشمند' } },
];

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    return products;
  } catch (error) {
    console.warn("Database connection failed, falling back to mock data for admin products list.");
    return MOCK_PRODUCTS;
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6 animate-stagger-item">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مدیریت محصولات</h1>
          <p className="text-sm text-slate-500 mt-1">لیست تمامی محصولات، موجودی و قیمت‌ها را در اینجا مدیریت کنید.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2 shrink-0">
            <Plus className="w-5 h-5" />
            افزودن محصول جدید
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="جستجو در نام، شناسه کالا (SKU)..." 
            className="w-full h-10 ps-10 pe-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="h-10 px-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none flex-grow sm:flex-grow-0">
            <option value="">همه دسته‌بندی‌ها</option>
            <option value="mobile">موبایل</option>
            <option value="laptop">لپ‌تاپ</option>
          </select>
          <select className="h-10 px-4 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none flex-grow sm:flex-grow-0">
            <option value="">وضعیت موجودی</option>
            <option value="in_stock">موجود</option>
            <option value="out_of_stock">ناموجود</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 text-start">
              <tr>
                <th className="px-6 py-4 font-semibold text-start">شناسه (SKU)</th>
                <th className="px-6 py-4 font-semibold text-start">نام محصول</th>
                <th className="px-6 py-4 font-semibold text-start">دسته‌بندی</th>
                <th className="px-6 py-4 font-semibold text-start">قیمت</th>
                <th className="px-6 py-4 font-semibold text-start">موجودی</th>
                <th className="px-6 py-4 font-semibold text-end">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{product.sku || '-'}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {product.category?.name || 'بدون دسته'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {product.price != null ? formatToman(product.price) : 'بدون قیمت'}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {toPersianDigits(product.stock.toString())} عدد
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        ناموجود
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            نمایش ۱ تا {toPersianDigits(products.length.toString())} از {toPersianDigits('120')} محصول
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">قبلی</button>
            <button className="px-3 py-1 bg-indigo-600 border border-indigo-600 rounded-lg text-white text-sm">۱</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">۲</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">۳</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm">بعدی</button>
          </div>
        </div>
      </div>
    </div>
  );
}
