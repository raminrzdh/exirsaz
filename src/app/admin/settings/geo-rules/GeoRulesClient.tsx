'use client';

import { useState } from 'react';
import { ShieldAlert, Store, ServerCog, Check } from 'lucide-react';
import { saveGlobalRoutingSetting, toggleCategoryRouting } from './actions';

interface GeoRulesClientProps {
  initialSettings: { agencyRoutingEnabled: boolean };
  initialCategories: { name: string; isAgencyRouted: boolean }[];
}

export function GeoRulesClient({ initialSettings, initialCategories }: GeoRulesClientProps) {
  const [globalEnabled, setGlobalEnabled] = useState(initialSettings.agencyRoutingEnabled);
  const [categories, setCategories] = useState(initialCategories);
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [savingCategory, setSavingCategory] = useState<string | null>(null);

  const handleGlobalToggle = async () => {
    setIsSavingGlobal(true);
    const newValue = !globalEnabled;
    try {
      await saveGlobalRoutingSetting(newValue);
      setGlobalEnabled(newValue);
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره تنظیمات');
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleCategoryToggle = async (catName: string, currentVal: boolean) => {
    setSavingCategory(catName);
    const newValue = !currentVal;
    try {
      await toggleCategoryRouting(catName, newValue);
      setCategories(categories.map(c => c.name === catName ? { ...c, isAgencyRouted: newValue } : c));
    } catch (err) {
      console.error(err);
      alert('خطا در ذخیره تنظیمات دسته');
    } finally {
      setSavingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Global Setting Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${globalEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <ServerCog className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">موتور ارجاع به نمایندگی (Master Switch)</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-xl">
                اگر این گزینه فعال باشد، سیستم موقعیت کاربر را بررسی کرده و در صورت وجود نمایندگی در شهر کاربر، گزینه خرید مستقیم را حذف می‌کند. خاموش کردن این گزینه فروشگاه را به حالت «فروش مستقیم کارخانه به همه» تغییر می‌دهد.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGlobalToggle}
              disabled={isSavingGlobal}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${globalEnabled ? 'bg-indigo-600' : 'bg-slate-300'} disabled:opacity-50`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${globalEnabled ? '-translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Level Rules */}
      <div className={`bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-opacity ${globalEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-3 items-center">
            <ShieldAlert className="w-6 h-6 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800">قوانین دسته‌بندی‌ها</h3>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            تعیین کنید سیستم ارجاع به نمایندگی روی کدام دسته‌بندی‌های محصولات اعمال شود. دسته‌بندی‌های خاموش همیشه به‌صورت خرید مستقیم در دسترس همه خواهند بود.
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.name} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${cat.isAgencyRouted ? 'border-indigo-100 bg-indigo-50/50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.isAgencyRouted ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                  {cat.isAgencyRouted ? <Store className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">{cat.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {cat.isAgencyRouted ? 'فروش از طریق نماینده مجاز' : 'خرید مستقیم آزاد (Factory Direct)'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCategoryToggle(cat.name, cat.isAgencyRouted)}
                disabled={savingCategory === cat.name}
                className={`flex items-center justify-center w-6 h-6 rounded-md border transition-colors ${cat.isAgencyRouted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-transparent'}`}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {categories.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500">
              هیچ دسته‌بندی در فروشگاه یافت نشد.
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

// Just an inline mock icon for ShoppingCart since it's not imported globally here
function ShoppingCart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
