'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { extractDigits } from '@/lib/utils/currency';

export function ContactFormClient() {
  const [phone, setPhone] = useState('');

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">نام و نام خانوادگی <span className="text-rose-500">* (اجباری)</span></label>
          <input id="name" type="text" className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: علی محمدی" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">شماره موبایل <span className="text-rose-500">* (اجباری)</span></label>
          <input 
            id="phone" 
            type="tel" 
            value={phone}
            onChange={e => setPhone(extractDigits(e.target.value))}
            maxLength={11}
            className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left" 
            placeholder="09123456789" 
            dir="ltr" 
            pattern="^09\d{9}$" 
            title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)" 
            required 
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-slate-700">موضوع پیام <span className="text-rose-500">* (اجباری)</span></label>
        <input id="subject" type="text" className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="خرید عمده توری سایبان" required />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-700">متن پیام <span className="text-rose-500">* (اجباری)</span></label>
        <textarea id="message" rows={5} className="w-full rounded-xl border border-slate-200 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="متن پیام خود را اینجا بنویسید..." required />
      </div>
      <div className="pt-4 text-center">
        <Button type="button" size="lg" className="w-full md:w-auto px-12 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-xl">
          ارسال پیام
        </Button>
      </div>
    </form>
  );
}
