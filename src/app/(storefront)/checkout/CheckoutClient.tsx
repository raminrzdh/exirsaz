'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/lib/store/CartContext';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { Button } from '@/components/ui/button';
import { ShieldCheck, MapPin, Building2, User, CreditCard, Trash2, ArrowRight, Loader2, Store, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { checkRepresentative } from '@/app/(storefront)/products/actions';
import { getCrossSellProducts } from './actions';
import { CrossSellMicroCard } from '@/components/storefront/CrossSellMicroCard';
import { trackEvent } from '@/lib/utils/analytics';

interface Agency {
  id: string;
  name: string;
  phone?: string;
}

export function CheckoutClient() {
  const { items, userLocation, updateQuantity, removeItem } = useCart();
  
  // Steps: mobile -> otp -> details
  const [step, setStep] = useState<'mobile' | 'otp' | 'details'>('mobile');
  
  // Auth state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Customer Details state
  const [customerType, setCustomerType] = useState<'real' | 'legal'>('real');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [economicCode, setEconomicCode] = useState('');
  const [address, setAddress] = useState('');

  // Agent logic
  const [localAgency, setLocalAgency] = useState<Agency | null>(null);
  
  // Cross selling
  const [crossSells, setCrossSells] = useState<any[]>([]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  useEffect(() => {
    // 1. Check for local agent based on first product category (or general)
    async function initCheckout() {
      if (userLocation && items.length > 0) {
        // Just checking the first item for simplicity, but could check all
        const rep = await checkRepresentative(userLocation.province, userLocation.city, 'عمومی', items[0].productId);
        if (rep) {
          setLocalAgency({ ...rep, phone: rep.phone ?? undefined });
        }
      }
      
      // 2. Fetch cross-sells
      if (items.length > 0) {
        const itemIds = items.map(i => i.productId);
        const related = await getCrossSellProducts(itemIds);
        setCrossSells(related);
        
        // 3. Track checkout start
        trackEvent('CHECKOUT_START', { itemCount: items.length, total });
      }
    }
    
    initCheckout();
  }, [userLocation, items, total]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) return;
    trackEvent('checkout_mobile_entered');
    
    setIsVerifying(true);
    // Simulate SMS send
    setTimeout(() => {
      setIsVerifying(false);
      setStep('otp');
      toast.success('کد تایید ارسال شد (شبیه‌سازی)');
    }, 800);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    
    setIsVerifying(true);
    // Simulate OTP verify
    setTimeout(() => {
      setIsVerifying(false);
      setStep('details');
      trackEvent('checkout_otp_verified');
    }, 1500);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localAgency) {
      trackEvent('checkout_inquire_agent', { agencyId: localAgency.id });
      window.location.href = `tel:${localAgency.phone}`;
    } else {
      trackEvent('checkout_payment_started', { value: total });
      toast.success('انتقال به درگاه پرداخت (شبیه‌سازی)');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-200">
        <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-6">
          <CreditCard className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">سبد خرید شما خالی است!</h2>
        <p className="text-slate-500 mb-8 max-w-md">شما هنوز هیچ محصولی به سبد خرید خود اضافه نکرده‌اید.</p>
        <Link href="/">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">بازگشت به فروشگاه</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Checkout Form - One Page Flow */}
      <div className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden min-h-[400px]">
        
        {/* Step 1: Mobile */}
        <div className={`transition-all duration-500 absolute inset-0 p-6 sm:p-8 bg-white z-30 flex flex-col justify-center ${step === 'mobile' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="max-w-md mx-auto w-full text-center">
            <h2 className="text-2xl font-black text-slate-800 mb-2">ورود / ثبت‌نام</h2>
            <p className="text-slate-500 mb-8 text-sm">برای ادامه فرآیند خرید، شماره موبایل خود را وارد کنید.</p>
            <form onSubmit={handleMobileSubmit} className="space-y-4">
              <input 
                type="tel" 
                value={mobile} 
                onChange={e=>setMobile(e.target.value)} 
                className="w-full h-14 px-4 text-center tracking-widest text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none transition-all dir-ltr" 
                placeholder="0912..." 
                pattern="^09\d{9}$"
                title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)"
                required
              />
              <Button type="submit" disabled={isVerifying} className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : 'دریافت کد تایید'}
              </Button>
            </form>
          </div>
        </div>

        {/* Step 2: OTP */}
        <div className={`transition-all duration-500 absolute inset-0 p-6 sm:p-8 bg-white z-20 flex flex-col justify-center ${step === 'otp' ? 'translate-x-0 opacity-100' : step === 'mobile' ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <div className="max-w-md mx-auto w-full text-center">
            <button type="button" onClick={() => setStep('mobile')} className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-sm mb-6 mx-auto">
              <ArrowRight className="w-4 h-4" /> اصلاح شماره
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-2">تایید شماره موبایل</h2>
            <p className="text-slate-500 mb-8 text-sm">کد ۴ رقمی ارسال شده به {toPersianDigits(mobile)} را وارد کنید.</p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input 
                type="text" 
                value={otp} 
                onChange={e=>setOtp(e.target.value)} 
                className="w-full h-14 px-4 text-center tracking-[1em] font-bold text-2xl rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none transition-all dir-ltr" 
                maxLength={4}
                required
              />
              <Button type="submit" disabled={isVerifying} className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تایید و ادامه'}
              </Button>
            </form>
          </div>
        </div>

        {/* Step 3: Details */}
        <div className={`transition-all duration-500 ${step === 'details' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}>
          <form onSubmit={handleFinalSubmit} className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" /> تکمیل اطلاعات ارسال
              </h2>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{toPersianDigits(mobile)}</span>
            </div>

            {/* Customer Type */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-full max-w-sm mb-6">
              <button type="button" className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${customerType === 'real' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setCustomerType('real')}>شخص حقیقی</button>
              <button type="button" className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${customerType === 'legal' ? 'bg-white text-indigo-600 shadow' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => setCustomerType('legal')}>شخص حقوقی</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام <span className="text-rose-500">* (اجباری)</span></label>
                <input required type="text" value={firstName} onChange={e=>setFirstName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">نام خانوادگی <span className="text-rose-500">* (اجباری)</span></label>
                <input required type="text" value={lastName} onChange={e=>setLastName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
              </div>
              {customerType === 'real' ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">کد ملی <span className="text-rose-500">* (اجباری)</span></label>
                  <input required type="text" value={nationalCode} onChange={e=>setNationalCode(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" placeholder="کد ملی ۱۰ رقمی" pattern="^\d{10}$" title="کد ملی باید دقیقاً ۱۰ رقم باشد" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">نام شرکت <span className="text-rose-500">* (اجباری)</span></label>
                    <input required type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">کد اقتصادی <span className="text-rose-500">* (اجباری)</span></label>
                    <input required type="text" value={economicCode} onChange={e=>setEconomicCode(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none" />
                  </div>
                </>
              )}
            </div>

            <section className="pt-6 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-500" /> آدرس دقیق پستی <span className="text-rose-500 text-sm font-normal">* (اجباری)</span>
              </h2>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <input type="text" readOnly value={userLocation?.province || ''} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" placeholder="استان" />
                <input type="text" readOnly value={userLocation?.city || ''} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" placeholder="شهر" />
              </div>
              <textarea required rows={3} value={address} onChange={e=>setAddress(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none resize-none" placeholder="خیابان، کوچه، پلاک، واحد..."></textarea>
            </section>

            {localAgency ? (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col items-center text-center">
                <Store className="w-8 h-8 text-amber-600 mb-2" />
                <h4 className="font-bold text-amber-900 mb-1">نمایندگی فعال در شهر شما</h4>
                <p className="text-sm text-amber-700 mb-4 leading-relaxed">
                  مشتری گرامی، جهت تسریع در فرآیند ارسال و دریافت خدمات محلی، لطفاً سفارش خود را مستقیماً از نمایندگی <strong>{localAgency.name}</strong> پیگیری نمایید.
                </p>
                <Button type="submit" size="lg" className="w-full h-14 text-lg bg-amber-500 hover:bg-amber-600 gap-2 text-white">
                  <PhoneCall className="w-5 h-5" /> تماس با نمایندگی
                </Button>
              </div>
            ) : (
              <Button type="submit" size="lg" className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700">
                پرداخت و ثبت نهایی سفارش
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Cart Summary Side */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-4">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">خلاصه سفارش</h2>
          
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
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

          <div className="pt-6 border-t border-slate-200 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>جمع مبلغ کالاها</span>
              <span className="font-medium">{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-emerald-700">{formatToman(total)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Cross-Selling */}
        {crossSells.length > 0 && (
          <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100">
            <h3 className="font-bold text-indigo-900 text-sm mb-3">پیشنهادات ویژه برای شما:</h3>
            <div className="space-y-2">
              {crossSells.map(prod => (
                <CrossSellMicroCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

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
