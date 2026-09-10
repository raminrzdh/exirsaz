import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Phone, Smartphone, User, Building2, ShieldCheck, Truck } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { AgencyContactButtonsClient } from '@/components/storefront/AgencyContactButtonsClient';

interface Props {
  params: Promise<{ province: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.province);
  const agency = await prisma.agency.findUnique({ where: { slug } });
  
  if (!agency) {
    return { title: 'نمایندگی پیدا نشد | اکسیرساز شمال' };
  }

  return {
    title: `نمایندگی اکسیرساز شمال در ${agency.name}`,
    description: `اطلاعات تماس، آدرس و شماره تلفن نمایندگی رسمی محصولات اکسیرساز شمال (توری سایبان، کیسه راشل) در ${agency.name}.`,
  };
}

export default async function ProvincePage({ params }: Props) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.province);
  console.log("ROUTING DEBUG =>", "province:", resolvedParams.province, "slug:", slug);
  const agency = await prisma.agency.findUnique({ where: { slug } });

  if (!agency) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: agency.company,
    image: agency.image,
    description: agency.description,
    telephone: agency.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: agency.address,
      addressRegion: agency.name,
      addressCountry: 'IR'
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'اکسیرساز شمال',
      url: 'https://exirsaz.com'
    }
  };

  return (
    <div className="pb-16 bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30" 
          style={{ backgroundImage: `url(${agency.image || ''})` }} 
        />
        
        <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm mb-4 border border-emerald-500/30">
              نمایندگی رسمی اکسیرساز شمال
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4">نمایندگی {agency.name}</h1>
            {agency.company && (
              <p className="text-xl text-emerald-100 max-w-2xl leading-relaxed">
                {agency.company}
              </p>
            )}
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shrink-0 w-full md:w-80 text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-900/50">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">نماینده معتبر</h3>
            <p className="text-sm text-emerald-100">تضمین کیفیت و اصالت کالا</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-emerald-600" />
                درباره نمایندگی
              </h2>
              <p className="text-slate-600 leading-loose text-lg text-justify">
                {agency.description && (
                  <>
                    {agency.description}
                    <br /><br />
                  </>
                )}
                شما می‌توانید تمامی محصولات پلیمری اکسیرساز شمال اعم از انواع توری‌های سایبان (شید گلخانه) با درصدهای تراکم مختلف، کیسه‌های بسته‌بندی راشل، لفاف ایمنی ساختمان و سایر شبکه‌های توری را با اطمینان کامل از اصالت و کیفیت، از طریق این نمایندگی معتبر در استان {agency.name} تهیه فرمایید.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">ارسال سریع منطقه‌ای</h4>
                    <p className="text-xs text-slate-500 mt-1">تامین فوری در استان</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">قیمت مصوب کارخانه</h4>
                    <p className="text-xs text-slate-500 mt-1">بدون واسطه اضافی</p>
                  </div>
                </div>
              </div>
            </div>
            
            {agency.image && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <Image 
                  src={agency.image} 
                  alt={`نمای داخلی نمایندگی ${agency.company || agency.name}`} 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">اطلاعات تماس و آدرس</h3>
              
              <div className="space-y-6">
                {agency.manager && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">مدیریت</p>
                      <p className="text-slate-600 mt-1">{agency.manager}</p>
                    </div>
                  </div>
                )}
                
                {agency.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">تلفن ثابت</p>
                      <p className="text-slate-600 mt-1" dir="ltr">{agency.phone}</p>
                    </div>
                  </div>
                )}
                
                {agency.mobile && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">شماره موبایل</p>
                      <p className="text-slate-600 mt-1" dir="ltr">{agency.mobile}</p>
                    </div>
                  </div>
                )}
                
                {agency.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">آدرس مراجعه حضوری</p>
                      <p className="text-slate-600 mt-1 text-sm leading-relaxed">{agency.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <AgencyContactButtonsClient agency={agency} />
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
