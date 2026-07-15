import Link from 'next/link';
import { ArrowRight, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NewProductPage() {
  return (
    <div className="space-y-6 animate-stagger-item max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" className="w-10 h-10 p-0 rounded-full text-slate-500 hover:bg-slate-200">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">افزودن محصول جدید</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">انصراف</Button>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            ذخیره محصول
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Form) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">اطلاعات پایه</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">نام محصول <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="مثلاً: گوشی موبایل سامسونگ مدل Galaxy S24 Ultra" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کوتاه</label>
              <textarea 
                rows={3}
                placeholder="خلاصه‌ای از ویژگی‌های کلیدی محصول..."
                className="w-full p-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors resize-y"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">توضیحات کامل (HTML/ویرایشگر متنی)</label>
              <div className="w-full h-64 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 border-dashed">
                ویرایشگر متن (TinyMCE یا CKEditor) در اینجا قرار می‌گیرد
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">تصاویر محصول</h2>
            <div className="w-full h-48 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
              <p className="text-sm font-medium">برای آپلود تصویر کلیک کنید یا فایل را بکشید</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP تا سقف ۵ مگابایت</p>
            </div>
          </div>
          
        </div>

        {/* Right Column (Sidebar form) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">قیمت و موجودی</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">قیمت (تومان) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                placeholder="مثلاً: ۶۸,۵۰۰,۰۰۰" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">قیمت حراج (تومان)</label>
              <input 
                type="number" 
                placeholder="در صورت عدم حراج، خالی بگذارید" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">موجودی انبار</label>
              <input 
                type="number" 
                defaultValue={0}
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">شناسه محصول (SKU)</label>
              <input 
                type="text" 
                className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors font-mono text-start dir-ltr uppercase"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">دسته‌بندی و وضعیت</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">وضعیت انتشار</label>
              <select className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">بایگانی</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">دسته‌بندی</label>
              <select className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                <option value="">انتخاب کنید...</option>
                <option value="mobile">موبایل</option>
                <option value="laptop">لپ‌تاپ</option>
                <option value="accessories">لوازم جانبی</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
