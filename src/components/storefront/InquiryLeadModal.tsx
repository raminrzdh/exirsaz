'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extractDigits } from '@/lib/utils/currency';
import { submitInquiry } from '@/app/(storefront)/products/actions';

interface InquiryLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId?: string;
  agencyId?: string;
}

export function InquiryLeadModal({ isOpen, onClose, productName, productId, agencyId }: InquiryLeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    generateCaptcha();
  }, [isOpen]);

  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaAnswer('');
  };

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    if (parseInt(captchaAnswer) !== num1 + num2) {
      alert('حاصل جمع اشتباه است. لطفا دوباره تلاش کنید.');
      generateCaptcha();
      return;
    }
    
    setIsSubmitting(true);
    
    const res = await submitInquiry({
      customerName: name,
      customerPhone: phone,
      description: description,
      productName: productName,
      productId: productId,
      agencyId: agencyId
    });
    
    setIsSubmitting(false);
    
    if (res.success) {
      setIsSuccess(true);
      // Reset form after a delay and close
      setTimeout(() => {
        setIsSuccess(false);
        setName('');
        setPhone('');
        setDescription('');
        generateCaptcha();
        onClose();
      }, 3000);
    } else {
      // Show error
      alert('خطا در ثبت درخواست. لطفا دوباره تلاش کنید.');
      generateCaptcha();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        <div className="bg-slate-900 px-6 py-6 text-center relative overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-white relative z-10">استعلام قیمت و مشاوره</h3>
          <p className="text-slate-300 mt-2 relative z-10 text-sm">
            محصول: {productName}
          </p>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">درخواست شما ثبت شد!</h4>
              <p className="text-slate-500 text-sm">کارشناسان فروش ما به زودی با شما تماس خواهند گرفت.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in">
              <p className="text-sm text-slate-600 mb-6">
                لطفاً اطلاعات خود را وارد کنید تا کارشناسان ما جهت ارائه قیمت و مشاوره تخصصی با شما تماس بگیرند.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  نام و نام خانوادگی <span className="text-rose-500">* (اجباری)</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-slate-50"
                  placeholder="نام شما..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  شماره موبایل <span className="text-rose-500">* (اجباری)</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(extractDigits(e.target.value))}
                  maxLength={11}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-slate-50"
                  placeholder="0912..."
                  dir="ltr"
                  pattern="^09\d{9}$"
                  title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  توضیحات <span className="text-slate-400 font-normal">(اختیاری)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full h-24 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-slate-50 resize-none"
                  placeholder="متن پیام شما..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  لطفاً حاصل جمع را وارد کنید: {num1} + {num2} <span className="text-rose-500">* (اجباری)</span>
                </label>
                <input
                  type="number"
                  required
                  value={captchaAnswer}
                  onChange={e => setCaptchaAnswer(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-slate-50 text-center text-lg tracking-widest"
                  placeholder="؟"
                  dir="ltr"
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت درخواست استعلام'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
