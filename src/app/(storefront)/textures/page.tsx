import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'نمونه بافت‌ها | اکسیرساز شمال',
  description: 'مشاهده نمونه بافت‌های مختلف توری سایبان، کیسه راشل و سایر محصولات پلیمری اکسیرساز شمال با درصد تراکم‌ها و رنگ‌های متنوع.',
};

const textures = [
  {
    id: 1,
    title: 'توری سایبان تراکم ۳۰٪',
    color: 'سبز تیره',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
  },
  {
    id: 2,
    title: 'توری سایبان تراکم ۵۰٪',
    color: 'سبز روشن / سفید',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
  },
  {
    id: 3,
    title: 'توری سایبان تراکم ۸۰٪',
    color: 'سبز / مشکی',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
  },
  {
    id: 4,
    title: 'کیسه راشل ریزبافت',
    color: 'پرتقالی / زرد / قرمز',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
  },
  {
    id: 5,
    title: 'توری ایمنی ساختمان (لفاف)',
    color: 'سفید / آبی / سبز',
    image: 'https://exirsaz.com/wp-content/uploads/2023/04/توری-سایبان-80-درصد.jpg',
  },
  {
    id: 6,
    title: 'توری ضد تگرگ و پرنده',
    color: 'سفید بی‌رنگ',
    image: 'https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg',
  }
];

export default function ServicesPage() {
  return (
    <div className="pb-16 bg-slate-50 min-h-screen">
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/80 z-10" />
        <div className="absolute inset-0 bg-[url('https://exirsaz.com/wp-content/uploads/2023/02/توری-سایبان-شید-گلخانه.jpg')] bg-cover bg-center mix-blend-overlay opacity-40" />
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm mb-4 border border-emerald-500/30">
            گالری محصولات
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6">نمونه بافت‌ها</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            مشاهده دقیق بافت، تراکم و تنوع رنگی شبکه‌های توری تولیدی در اکسیرساز شمال
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {textures.map((texture) => (
            <div key={texture.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 cursor-pointer flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image 
                  src={texture.image} 
                  alt={texture.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out-strong"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-center text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {texture.title}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  تنوع رنگ: <span className="text-slate-700">{texture.color}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-emerald-50 rounded-3xl p-8 md:p-12 text-center border border-emerald-100 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">نیاز به مشاوره برای انتخاب تراکم مناسب دارید؟</h3>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            تراکم‌های مختلف توری سایبان (از ۳۰ تا ۹۰ درصد) کاربردهای متفاوتی در کشاورزی، دامداری و ساختمان دارند. کارشناسان ما آماده راهنمایی شما هستند.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center h-14 px-8 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer">
            تماس با کارشناسان فروش
          </a>
        </div>
      </section>
    </div>
  );
}
