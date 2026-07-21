'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { formatToman } from '@/lib/utils/currency';
import { trackEvent } from '@/lib/utils/analytics';
import { useCart } from '@/lib/store/CartContext';

interface CrossSellProduct {
  id: string;
  name: string;
  price: number | null;
  salePrice: number | null;
  image?: string;
}

export function CrossSellMicroCard({ product }: { product: CrossSellProduct }) {
  const { addItem, items } = useCart();
  
  if (items.some(item => item.id === product.id) || !product.price) return null;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price as number,
      quantity: 1,
      image: product.image || '/placeholder.png'
    });
    trackEvent('cross_sell_added', { productId: product.id, name: product.name });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-indigo-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors">
      <div className="flex-1">
        <h5 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">{product.name}</h5>
        <span className="text-xs font-bold text-emerald-600">{formatToman(product.price)}</span>
      </div>
      <button 
        onClick={handleAdd}
        className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-colors shrink-0"
        title="افزودن به سبد"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
