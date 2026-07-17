'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { ProductPurchaseAction } from './ProductPurchaseAction';

interface AttributeValue {
  id: string;
  value: string;
}

interface Attribute {
  name: string;
  values: string[];
}

interface Variant {
  id: string;
  sku: string | null;
  price: number;
  stock: number;
  image: string | null;
  attributes: Record<string, string>;
}

export function ProductClientLayout({ productProp, attributes, variants }: { productProp: any, attributes: Attribute[], variants: Variant[] }) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedAttributes).length !== attributes.length) return null;
    return variants.find(v => 
      Object.entries(selectedAttributes).every(([key, val]) => v.attributes[key] === val)
    );
  }, [selectedAttributes, variants, attributes]);

  const handleAttributeSelect = (attrName: string, value: string) => {
    setSelectedAttributes(prev => {
      if (prev[attrName] === value) {
        const next = { ...prev };
        delete next[attrName];
        return next;
      }
      return { ...prev, [attrName]: value };
    });
  };
  const currentPrice = selectedVariant ? selectedVariant.price : productProp.price;
  const currentStock = selectedVariant ? selectedVariant.stock : productProp.stock;
  const currentImage = selectedVariant?.image || productProp.image;
  const currentSku = selectedVariant?.sku || productProp.id;

  // Derive available options based on current selections to disable invalid ones
  const isOptionAvailable = (attrName: string, value: string) => {
    const tempSelection = { ...selectedAttributes, [attrName]: value };
    return variants.some(v => 
      Object.entries(tempSelection).every(([key, val]) => v.attributes[key] === val)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">
      <div className="lg:col-span-5">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden relative aspect-square shadow-sm">
          <Image 
            src={currentImage} 
            alt={productProp.name} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500" 
            unoptimized
          />
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-4">
            دسته: {productProp.categoryName || 'عمومی'}
          </span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">
          {productProp.name}
        </h1>
        
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span className="text-sm font-bold text-slate-700">{toPersianDigits('5')}</span>
            <span className="text-xs text-slate-400 ms-1">(۲۴ دیدگاه)</span>
          </div>
          {currentStock > 0 ? (
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">موجود در انبار</span>
          ) : productProp.salesType === 'DIRECT_SALE' ? (
            <span className="text-sm font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">ناموجود</span>
          ) : (
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">استعلام موجودی</span>
          )}
          {currentSku && (
            <span className="text-sm text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
              کد: {currentSku}
            </span>
          )}
        </div>
        
        {attributes.length > 0 && (
          <div className="mb-8 space-y-6 pb-6 border-b border-slate-100">
            {attributes.map(attr => (
              <div key={attr.name}>
                <h3 className="font-semibold text-slate-800 mb-3">{attr.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {attr.values.map(val => {
                    const isSelected = selectedAttributes[attr.name] === val;
                    const isAvailable = isOptionAvailable(attr.name, val);
                    return (
                      <button
                        key={val}
                        disabled={!isAvailable && !isSelected}
                        onClick={() => handleAttributeSelect(attr.name, val)}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200
                          ${isSelected 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600 cursor-pointer' 
                            : isAvailable
                              ? 'border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer'
                              : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                          }
                        `}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-slate prose-sm text-slate-600 mb-8 max-w-none leading-relaxed">
          <p>{productProp.shortDesc || productProp.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <span className="text-xs font-medium text-slate-700">تضمین اصالت کالا</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Truck className="w-6 h-6 text-indigo-500" />
            <span className="text-xs font-medium text-slate-700">ارسال سریع باربری</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <RotateCcw className="w-6 h-6 text-indigo-500" />
            <span className="text-xs font-medium text-slate-700">۷ روز ضمانت بازگشت</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="sticky top-24">
          <ProductPurchaseAction 
            product={{
              ...productProp,
              id: selectedVariant ? selectedVariant.id : productProp.id, // Replace ID so cart adds the variant ID
              price: currentPrice,
              stock: currentStock,
              image: currentImage
            }} 
          />
        </div>
      </div>
    </div>
  );
}
