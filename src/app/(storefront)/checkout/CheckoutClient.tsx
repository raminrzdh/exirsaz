'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/store/CartContext';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, MapPin, Building2, User, CreditCard, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';


export function CheckoutClient() {
  const { items, userLocation, updateQuantity, removeItem } = useCart();
  const [customerType, setCustomerType] = useState<'real' | 'legal'>('real');
  
  // Real fields
  const [nationalCode, setNationalCode] = useState('');
  
  // Legal fields
  const [companyName, setCompanyName] = useState('');
  const [economicCode, setEconomicCode] = useState('');
  
  // Shared fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // add shipping logic here if needed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('انتقال به درگاه پرداخت در حال پیاده‌سازی است...');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <CreditCard className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">سبد خرید شما خالی است!</h2>
        <p className="text-slate-500 mb-8 max-w-md">شما هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید. برای مشاهده محصولات به فروشگاه سر بزنید.</p>
        <Link href="/">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">بازگشت به فروشگاه</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Checkout Form */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Customer Type Toggle */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              اطلاعات خریدار
            </h2>
            <div className="flex p-1 bg-slate-100 rounded-xl w-full max-w-sm mb-6">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${customerType === 'real' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setCustomerType('real')}
              >
                <User className="w-4 h-4" />
                شخص حقیقی
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${customerType === 'legal' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setCustomerType('legal')}
              >
                <Building2 className="w-4 h-4" />
                شخص حقوقی
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام</label>
                <input required type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام خانوادگی</label>
                <input required type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
              </div>

              {customerType === 'real' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">کد ملی</label>
                  <input required type="text" value={nationalCode} onChange={e=>setNationalCode(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" placeholder="کد ملی ۱۰ رقمی" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">نام شرکت / سازمان</label>
                    <input required type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">کد اقتصادی</label>
                    <input required type="text" value={economicCode} onChange={e=>setEconomicCode(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">شماره موبایل</label>
                <input required type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all" dir="ltr" placeholder="0912..." />
              </div>
            </div>
          </section>

          {/* Shipping Address (LOCKED to Session values as per WP Plugin logic) */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 pt-6 border-t border-slate-100">
              <MapPin className="w-5 h-5 text-indigo-500" />
              آدرس ارسال
            </h2>
            <p className="text-sm text-slate-500 mb-5 bg-amber-50 p-3 rounded-lg border border-amber-100 text-amber-800">
              توجه: بر اساس سیاست‌های فروش منطقه‌ای، سفارش شما فقط به شهر انتخاب شده در مرحله قبل قابل ارسال است.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">استان</label>
                <input type="text" readOnly value={userLocation?.province || ''} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">شهر</label>
                <input type="text" readOnly value={userLocation?.city || ''} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none cursor-not-allowed" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">آدرس دقیق پستی</label>
              <textarea required rows={3} value={address} onChange={e=>setAddress(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="خیابان، کوچه، پلاک، واحد..."></textarea>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700">
            پرداخت و ثبت نهایی سفارش
          </Button>
        </form>
      </div>

      {/* Cart Summary Side */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-6">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">خلاصه سفارش</h2>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-slate-100">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                  <div className="text-xs text-slate-500 mt-1">{formatToman(item.price)}</div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-slate-100 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-r-lg">-</button>
                      <span className="w-8 text-center text-xs font-bold">{toPersianDigits(item.quantity.toString())}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 rounded-l-lg">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>جمع مبلغ کالاها</span>
              <span className="font-medium">{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>هزینه ارسال</span>
              <span className="font-medium text-emerald-600">پس‌کرایه (پرداخت در محل)</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-emerald-700">{formatToman(total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            اطلاعات شما نزد ما محفوظ است. پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
