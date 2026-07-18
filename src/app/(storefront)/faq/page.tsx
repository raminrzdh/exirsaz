import { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سوالات متداول | اکسیرساز شمال',
  description: 'پاسخ به پرسش‌های پرتکرار شما در مورد خرید محصولات پلیمری، توری سایبان و شرایط ارسال.',
};

const faqs = [
  {
    question: 'درصد تراکم توری سایبان به چه معناست؟',
    answer: 'درصد تراکم (مثلاً ۸۰٪ یا ۵۰٪) نشان‌دهنده میزان سایه‌اندازی و جلوگیری از عبور نور خورشید است. به عنوان مثال، توری ۸۰٪ تنها اجازه عبور ۲۰٪ نور را می‌دهد.'
  },
  {
    question: 'آیا محصولات شما دارای مواد آنتی‌یووی (Anti-UV) هستند؟',
    answer: 'بله، تمامی توری‌های سایبان و کیسه‌های راشل تولید شده در شرکت ما دارای مواد افزودنی ضد اشعه ماوراء بنفش (Anti-UV) می‌باشند که طول عمر آن‌ها را در برابر نور خورشید به شدت افزایش می‌دهد.'
  },
  {
    question: 'شرایط خرید عمده به چه صورت است؟',
    answer: 'برای خرید عمده و تناژ بالا، تخفیف‌های ویژه‌ای در نظر گرفته شده است. کافیست با واحد فروش ما تماس بگیرید یا فرم درخواست مشاوره در صفحه اصلی را تکمیل کنید تا کارشناسان ما با شما تماس بگیرند.'
  },
  {
    question: 'آیا ارسال به شهرستان‌ها دارید؟',
    answer: 'بله، ارسال محصولات اکسیرساز شمال به سراسر کشور از طریق باربری‌های معتبر با ایمنی کامل و در کمترین زمان ممکن انجام می‌شود.'
  },
  {
    question: 'عمر مفید توری‌های سایبان چقدر است؟',
    answer: 'با توجه به کیفیت بالای مواد اولیه و استفاده از مواد آنتی‌یووی، در صورت نصب صحیح، عمر مفید توری‌های ما به طور متوسط بین ۳ تا ۵ سال می‌باشد.'
  }
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl min-h-[70vh]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">سوالات متداول</h1>
        <p className="text-slate-600 text-lg">پاسخ به رایج‌ترین پرسش‌های شما درباره محصولات و خدمات ما</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group bg-white border border-slate-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
            <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800">
              {faq.question}
              <span className="ml-2 flex-shrink-0 transition duration-300 group-open:-rotate-180 text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </span>
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 mt-2">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
