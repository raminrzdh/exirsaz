'use client';

import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { X, Send, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractDigits } from '@/lib/utils/currency';
import { trackEvent } from '@/lib/utils/analytics';

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function ExitIntentModal({ isOpen, onClose, productName }: ExitIntentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) return;
    
    setIsSubmitting(true);
    trackEvent('exit_intent_lead_submitted', { product: productName, mobile });
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-500 px-6 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-[500]">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-white/30">
            <PhoneCall className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-black text-white relative z-10 leading-tight">
            کجا با این عجله؟!
          </h3>
          <p className="text-amber-50 mt-2 relative z-10 text-sm font-medium">
            لیست کامل قیمت عمده‌فروشی برای شهر شما در ۶۰ ثانیه پیامک می‌شود.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">درخواست شما ثبت شد!</h4>
              <p className="text-sm text-slate-500">لیست قیمت‌ها تا چند لحظه دیگر برای شما پیامک می‌شود.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">
                  شماره موبایل خود را وارد کنید: <span className="text-rose-500">* (اجباری)</span>
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={e => setMobile(extractDigits(e.target.value))}
                  maxLength={11}
                  placeholder="مثال: 09123456789"
                  dir="ltr"
                  pattern="^09\d{9}$"
                  title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)"
                  className="w-full h-14 text-center text-lg tracking-widest rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 outline-none transition-all font-mono"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-500/30"
              >
                {isSubmitting ? 'در حال ارسال...' : 'دریافت فوری لیست قیمت'}
              </Button>
              <p className="text-xs text-center text-slate-400 mt-4">
                ما به حریم خصوصی شما احترام می‌گذاریم و هرزنامه ارسال نمی‌کنیم.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
