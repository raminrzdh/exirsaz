'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InquiryLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function InquiryLeadModal({ isOpen, onClose, productName }: InquiryLeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to save lead
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after a delay and close
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setPhone('');
      onClose();
    }, 3000);
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
                  نام و نام خانوادگی
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
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-slate-50"
                  placeholder="0912..."
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
