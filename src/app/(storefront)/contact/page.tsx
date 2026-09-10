import { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'تماس با ما | شرکت اکسیرساز شمال',
  description: 'راه‌های ارتباطی با شرکت اکسیرساز شمال. آدرس کارخانه، شماره‌های تماس و فرم ارتباط با بخش فروش و پشتیبانی.',
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'تماس با اکسیرساز شمال',
    description: 'اطلاعات تماس با دفتر مرکزی و کارخانه اکسیرساز شمال',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'اکسیرساز شمال',
      telephone: '+981132025',
      email: 'info@exirsaz.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'شهرک صنعتی منصورکنده',
        addressLocality: 'بابل',
        addressRegion: 'مازندران',
        addressCountry: 'IR'
      }
    }
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">تماس با ما</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-lg">
            پاسخگوی سوالات شما هستیم. برای مشاوره خرید عمده یا پیگیری سفارشات با ما در ارتباط باشید.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">تلفن‌های تماس</h3>
            <p className="text-slate-600 mb-1" dir="ltr">+98 11 32025</p>
            <p className="text-slate-600" dir="ltr">0911 123 4567</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">آدرس کارخانه</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              مازندران، بابل، شهرک صنعتی منصورکنده، فاز ۲، شرکت اکسیرساز شمال
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">ساعات کاری</h3>
            <p className="text-slate-600 text-sm">شنبه تا چهارشنبه: ۸ الی ۱۷</p>
            <p className="text-slate-600 text-sm mt-1">پنجشنبه: ۸ الی ۱۳</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">فرم تماس با پشتیبانی</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">نام و نام خانوادگی <span className="text-rose-500">* (اجباری)</span></label>
                <input id="name" type="text" className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="مثال: علی محمدی" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">شماره موبایل <span className="text-rose-500">* (اجباری)</span></label>
                <input id="phone" type="tel" className="w-full h-12 rounded-xl border border-slate-200 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left" placeholder="09123456789" dir="ltr" pattern="^09\d{9}$" title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد (مثال: 09123456789)" required />
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
        </div>
      </section>
    </div>
  );
}
