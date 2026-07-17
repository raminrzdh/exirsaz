'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/store/CartContext';
import { LocationGateModal } from './LocationGateModal';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsSidebarClientProps {
  categories: Category[];
}

export function ProductsSidebarClient({ categories }: ProductsSidebarClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const { userLocation, clearLocation } = useCart();
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Sync URL with context location automatically
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const urlProvince = searchParams.get('province');
    const urlCity = searchParams.get('city');

    if (userLocation) {
      if (urlProvince !== userLocation.province || urlCity !== userLocation.city) {
        params.set('province', userLocation.province);
        params.set('city', userLocation.city);
        params.delete('page');
        router.push(`/products?${params.toString()}`);
      }
    } else if (urlProvince || urlCity) {
      params.delete('province');
      params.delete('city');
      params.delete('page');
      router.push(`/products?${params.toString()}`);
    }
  }, [userLocation, searchParams, router]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page on filter change
    params.delete('page');

    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    router.push(`/products?${params.toString()}`);
    setIsMobileFiltersOpen(false); // Close mobile filters on apply
  };

  const buildCategoryUrl = (catSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (currentCategory === catSlug) {
      params.delete('category');
    } else {
      params.set('category', catSlug);
    }
    return `/products?${params.toString()}`;
  };

  return (
    <aside className="w-full md:w-64 shrink-0">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        className="md:hidden w-full flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 mb-4"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-700">فیلترها و دسته‌بندی</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Content */}
      <div className={`bg-white p-6 rounded-2xl border border-slate-200 md:sticky md:top-24 mb-6 md:mb-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <h3 className="font-bold text-lg mb-6 hidden md:flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          فیلترها
        </h3>
        
        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 text-slate-700">دسته‌بندی</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            {categories.map(cat => {
              const isActive = currentCategory === cat.slug;
              return (
                <li key={cat.id}>
                  <Link href={buildCategoryUrl(cat.slug)} className={`flex items-center gap-2 cursor-pointer hover:text-emerald-600 transition-colors ${isActive ? 'text-emerald-600 font-medium' : ''}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                      {isActive && <Check className="w-3 h-3" />}
                    </div>
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Location Filter */}
        <div className="mb-6 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-700">مکان نمایندگی</h4>
            {userLocation && (
              <button onClick={clearLocation} className="text-xs text-red-500 hover:underline">
                حذف
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-lg p-3 transition-colors text-sm text-slate-700 text-right"
          >
            <div className="flex items-center gap-2">
              <MapPin className={`w-4 h-4 ${userLocation ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className={userLocation ? 'font-medium' : 'text-slate-500'}>
                {userLocation ? `${userLocation.province}، ${userLocation.city}` : 'انتخاب استان و شهر...'}
              </span>
            </div>
            <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500 shadow-sm">
              تغییر
            </span>
          </button>
        </div>

        {/* Price Filter */}
        <div className="mb-6 border-t border-slate-100 pt-6">
          <h4 className="font-semibold mb-3 text-slate-700">محدوده قیمت</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">از قیمت (تومان)</label>
              <input 
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="مثلا: 100000"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">تا قیمت (تومان)</label>
              <input 
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="مثلا: 5000000"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={applyFilters}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          اعمال فیلترها
        </Button>
      </div>

      <LocationGateModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)}
      />
    </aside>
  );
}
