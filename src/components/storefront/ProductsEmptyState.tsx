'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store/CartContext';
import { useRouter } from 'next/navigation';

export function ProductsEmptyState() {
  const { clearLocation, userLocation } = useCart();
  const router = useRouter();

  const handleClearAll = () => {
    // Clear global location
    if (userLocation) {
      clearLocation();
    }
    // Reset URL
    router.push('/products');
  };

  return (
    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center flex flex-col items-center">
      <h3 className="text-lg font-bold text-slate-700 mb-2">محصولی یافت نشد!</h3>
      <p className="text-slate-500 mb-6">با این فیلترها یا در این منطقه محصولی موجود نیست.</p>
      
      <div className="flex gap-4">
        <button 
          onClick={handleClearAll}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          حذف همه فیلترها و شهر
        </button>
        <Link 
          href="/products" 
          className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
