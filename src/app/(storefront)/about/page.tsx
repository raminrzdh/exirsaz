import { Metadata } from 'next';
import Image from 'next/image';
import { CheckCircle2, Factory, Users, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'درباره ما | شرکت اکسیرساز شمال',
  description: 'آشنایی با شرکت اکسیرساز شمال، پیشرو در تولید انواع توری سایبان (شید)، کیسه راشل و محصولات پلیمری در ایران.',
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'اکسیرساز شمال',
    url: 'https://exirsaz.com',
    logo: 'https://exirsaz.com/logo.png',
    description: 'تولید کننده انواع توری سایبان (شید)، کیسه راشل و لفاف ساختمان با بهترین کیفیت.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'شهرک صنعتی منصورکنده',
      addressLocality: 'بابل',
      addressRegion: 'مازندران',
      addressCountry: 'IR'
    }
  };

  return (
    <div className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-6">درباره اکسیرساز شمال</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            بیش از دو دهه تعهد به کیفیت در تولید شبکه‌های توری پلیمری
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg prose-slate max-w-none leading-loose">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">داستان ما</h2>
          <p className="text-slate-600 mb-8 text-justify">
            شرکت اکسیرساز شمال با هدف تأمین نیازهای بخش کشاورزی، ساختمانی و بسته‌بندی کشور تأسیس شد. ما با تکیه بر دانش متخصصان داخلی و استفاده از مدرن‌ترین ماشین‌آلات روز دنیا، توانسته‌ایم گام بلندی در ارتقای کیفیت محصولات پلیمری (مانند توری سایبان و کیسه راشل) برداریم.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 not-prose">
            <div className="bg-emerald-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <Factory className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">تولید ملی</h3>
              <p className="text-sm text-slate-500">حمایت از کارگر ایرانی و تولید با استانداردهای جهانی</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">کیفیت تضمینی</h3>
              <p className="text-sm text-slate-500">استفاده از مواد آنتی‌یووی برای افزایش طول عمر محصولات</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <Users className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">مشتری مداری</h3>
              <p className="text-sm text-slate-500">پشتیبانی همه‌جانبه و ارسال سریع به سراسر کشور</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">چشم‌انداز و مأموریت</h2>
          <p className="text-slate-600 mb-6 text-justify">
            مأموریت ما در اکسیرساز شمال، ارائه راهکارهای نوین و مقرون‌به‌صرفه برای محافظت از محصولات کشاورزی، دام و طیور و همچنین ایمن‌سازی پروژه‌های ساختمانی است. ما معتقدیم که با ارائه محصولات باکیفیت می‌توانیم به کاهش هدررفت منابع و افزایش بهره‌وری کمک شایانی کنیم.
          </p>

          <ul className="list-none pl-0 space-y-4 my-8 not-prose">
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>توسعه سبد محصولات همگام با نیازهای روز بازار</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>صادرات محصولات به کشورهای همسایه و ارزآوری</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              <span>حفظ محیط زیست با تولید محصولات قابل بازیافت</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
