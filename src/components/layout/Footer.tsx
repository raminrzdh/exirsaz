import Link from 'next/link';
import { Package, ShieldCheck, Truck, HeadphonesIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Features Section */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">ارسال سریع</h4>
              <p className="text-xs text-slate-500">به تمام نقاط کشور</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">ضمانت اصالت</h4>
              <p className="text-xs text-slate-500">تضمین کیفیت کالا</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">پشتیبانی ۲۴/۷</h4>
              <p className="text-xs text-slate-500">پاسخگویی در تمام ایام</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900">بسته‌بندی ایمن</h4>
              <p className="text-xs text-slate-500">حفاظت کامل از محصول</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                E
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                اکسیرساز
              </span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed text-justify">
              اکسیرساز، فروشگاه اینترنتی جامع شما با هدف ارائه بهترین محصولات و خدمات با بالاترین کیفیت. تجربه‌ای نوین در خرید آنلاین با پلتفرم پرسرعت ما.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">لینک‌های مفید</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/about" className="hover:text-indigo-600">درباره ما</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600">تماس با ما</Link></li>
              <li><Link href="/faq" className="hover:text-indigo-600">سوالات متداول</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600">مجله اکسیرساز</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">راهنمای خرید</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/shipping" className="hover:text-indigo-600">نحوه ارسال</Link></li>
              <li><Link href="/payment" className="hover:text-indigo-600">شیوه‌های پرداخت</Link></li>
              <li><Link href="/return-policy" className="hover:text-indigo-600">رویه‌های بازگرداندن کالا</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600">شرایط و قوانین</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">ارتباط با ما</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>تلفن پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>ایمیل: info@exirsaz.com</li>
              <li>آدرس: تهران، خیابان ولیعصر، برج اکسیر، طبقه ۱۰</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>کلیه حقوق این سایت متعلق به شرکت اکسیرساز می‌باشد. © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
