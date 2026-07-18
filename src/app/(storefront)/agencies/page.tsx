import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { MapPin, Phone, Building2, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'لیست عاملین فروش و نمایندگی‌ها | اکسیرساز شمال',
  description: 'فهرست نمایندگان رسمی و عاملین فروش محصولات اکسیرساز شمال (توری سایبان، کیسه راشل) در سراسر کشور.',
};

export default async function AgenciesIndexPage() {
  const agencies = await prisma.agency.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-teal-900/90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-sm mb-4 border border-emerald-500/30">
            شبکه توزیع گسترده
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6">عاملین فروش محصولات ما</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            محصولات اکسیرساز شمال را از نزدیک‌ترین نمایندگی مجاز در استان خود تهیه کنید و از خدمات پس از فروش ما بهره‌مند شوید.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-8 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <Link key={agency.id} href={`/${agency.slug}`} className="group block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                {agency.image ? (
                  <Image 
                    src={agency.image} 
                    alt={agency.company || agency.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <Building2 className="w-16 h-16 opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-xl font-bold text-white mb-1">{agency.name}</h3>
                  {agency.company && <p className="text-sm text-slate-200">{agency.company}</p>}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {agency.address || 'آدرس ثبت نشده است'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm text-slate-600 font-mono" dir="ltr">
                    {agency.phone || agency.mobile || 'شماره ثبت نشده'}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">مشاهده جزئیات نمایندگی</span>
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {agencies.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p>در حال حاضر هیچ نمایندگی فعالی ثبت نشده است.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
