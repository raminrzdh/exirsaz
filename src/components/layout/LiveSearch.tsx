'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Package, Folder } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchStore } from '@/app/(storefront)/search/actions';
import { formatToman } from '@/lib/utils/currency';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function LiveSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[]; categories: any[] } | null>(null);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (debouncedQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await searchStore(debouncedQuery);
          setResults(res);
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults(null);
      }
    }
    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const hasResults = results && (results.products.length > 0 || results.categories.length > 0);

  return (
    <div className="hidden md:flex items-center relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative w-full z-50">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="جستجوی هوشمند محصولات..." 
          className="h-10 w-72 rounded-full bg-slate-100 border-transparent px-4 pe-10 text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
          autoComplete="off"
        />
        <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </form>

      {/* Dropdown */}
      {isFocused && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-[400px] end-0 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-40 max-h-[70vh] flex flex-col">
          {isLoading && !results ? (
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-indigo-500" />
              <span className="text-sm">در حال جستجو...</span>
            </div>
          ) : results && !hasResults ? (
            <div className="p-8 text-center text-slate-500">
              <p className="font-medium text-slate-700 mb-1">نتیجه‌ای یافت نشد</p>
              <p className="text-xs">محصول یا دسته‌بندی با کلمه «{query}» پیدا نشد.</p>
            </div>
          ) : results && hasResults ? (
            <div className="overflow-y-auto">
              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="p-2 border-b border-slate-100 bg-slate-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-500 mb-1">دسته‌بندی‌ها</div>
                  {results.categories.map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsFocused(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <Folder className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-500 mb-1">محصولات</div>
                  <div className="flex flex-col gap-1">
                    {results.products.map(prod => (
                      <Link 
                        key={prod.id} 
                        href={`/products/${prod.slug}`}
                        onClick={() => setIsFocused(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800 line-clamp-1">{prod.name}</div>
                            {prod.category?.name && (
                              <div className="text-xs text-slate-500">{prod.category.name}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-indigo-700 shrink-0">
                          {prod.salePrice ? formatToman(prod.salePrice) : prod.price ? formatToman(prod.price) : 'تماس بگیرید'}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-2 border-t border-slate-100">
                <button 
                  onClick={handleSubmit}
                  className="w-full py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  مشاهده همه نتایج جستجو
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
