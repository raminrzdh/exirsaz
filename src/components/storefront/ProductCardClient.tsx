'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, ArrowLeft, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { useCart } from '@/lib/store/CartContext';
import { LocationGateModal } from './LocationGateModal';
import { InquiryLeadModal } from './InquiryLeadModal';
import { checkRepresentative } from '@/app/(storefront)/products/actions';
import { toast } from 'react-hot-toast';


interface Representative {
  id: string;
  name: string;
  province: string;
  city: string;
  phone?: string;
  mobile?: string;
  hasWhatsapp?: boolean;
  whatsappNumber?: string;
  hasBale?: boolean;
  baleNumber?: string;
  hasPhoneCall?: boolean;
  phoneCallNumber?: string;
  hasRequestForm?: boolean;
  locationCoordinates?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  rating: number;
}

export function ProductCardClient({ product }: { product: Product }) {
  const { userLocation, addItem } = useCart();
  const [isLocationGateOpen, setIsLocationGateOpen] = useState(false);
  const [isCheckingRep, setIsCheckingRep] = useState(false);
  const [foundRep, setFoundRep] = useState<Representative | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const handleBuyClick = async () => {
    if (!userLocation) {
      setIsLocationGateOpen(true);
      return;
    }
    await processPurchase(userLocation.province, userLocation.city);
  };

  const processPurchase = async (province: string, city: string) => {
    setIsCheckingRep(true);
    // Use product name as a proxy for category in this mock setup, 
    // or assume 'توری سایبان' based on the product name
    const category = product.name.includes('سایبان') ? 'توری سایبان' : 'سایر';
    
    const rep = await checkRepresentative(province, city, category);
    setIsCheckingRep(false);

    if (rep) {
      setFoundRep({
        id: rep.id,
        name: rep.name,
        province: province,
        city: city,
        phone: rep.phone,
        mobile: rep.mobile,
        hasWhatsapp: rep.hasWhatsapp,
        whatsappNumber: rep.whatsappNumber,
        hasBale: rep.hasBale,
        baleNumber: rep.baleNumber,
        hasPhoneCall: rep.hasPhoneCall,
        phoneCallNumber: rep.phoneCallNumber,
        hasRequestForm: rep.hasRequestForm,
        locationCoordinates: rep.locationCoordinates
      });
    } else {
      // Add to cart directly!
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      toast.success('محصول به سبد خرید اضافه شد!'); // Basic feedback for now
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-[400ms] ease-out-strong flex flex-col h-full">
        <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-out-strong"
            unoptimized
          />
        </Link>
        <div className="p-5 flex flex-col flex-1">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mb-4">
            <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
            <span className="text-sm font-medium text-slate-700">{toPersianDigits(product.rating.toString())}</span>
          </div>
          
          <div className="mt-auto flex flex-col gap-1">
            {product.salePrice ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400 line-through decoration-rose-500/50">{formatToman(product.price)}</span>
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    {toPersianDigits(Math.round(((product.price - product.salePrice) / product.price) * 100))}٪
                  </span>
                </div>
                <div className="text-lg font-bold text-rose-600">
                  {formatToman(product.salePrice)}
                </div>
              </div>
            ) : (
              <div className="text-lg font-bold text-emerald-700">
                {formatToman(product.price)}
              </div>
            )}
            <div className="flex justify-end mt-1">
              <Button 
                size="sm" 
                className="rounded-full px-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
                onClick={handleBuyClick}
                disabled={isCheckingRep}
              >
                {isCheckingRep ? 'در حال بررسی...' : 'مشاهده و خرید'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LocationGateModal 
        isOpen={isLocationGateOpen} 
        onClose={() => setIsLocationGateOpen(false)}
        onLocationSet={(province, city) => processPurchase(province, city)}
      />

      {/* Representative Found Modal */}
      {foundRep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setFoundRep(null)} />
          <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            <div className="bg-amber-500 px-6 py-6 text-center text-white relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold relative z-10">نماینده فروش در شهر شما</h3>
            </div>
            
            <div className="p-6 text-center space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                خوشبختانه ما در استان <strong className="text-slate-900">{foundRep.province}</strong> (شهر {foundRep.city}) نماینده فعال داریم. جهت حمایت از شبکه توزیع، لطفاً این محصول را مستقیماً از نماینده ما تهیه فرمایید.
              </p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-4">
                <h4 className="font-bold text-slate-900 mb-1">{foundRep.name}</h4>
                <p className="text-sm text-slate-500 mb-4">نماینده رسمی فروش محصولات اکسیرساز شمال</p>
                
                <div className="flex flex-col gap-2">
                  {foundRep.hasPhoneCall && (foundRep.phoneCallNumber || foundRep.phone || foundRep.mobile) && (
                    <a 
                      href={`tel:${foundRep.phoneCallNumber || foundRep.phone || foundRep.mobile}`} 
                      className="flex items-center justify-center gap-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      تماس تلفنی
                    </a>
                  )}
                  {foundRep.hasWhatsapp && (foundRep.whatsappNumber || foundRep.mobile) && (
                    <a 
                      href={`https://wa.me/${(foundRep.whatsappNumber || foundRep.mobile)!.startsWith('0') ? '98' + (foundRep.whatsappNumber || foundRep.mobile)!.substring(1) : (foundRep.whatsappNumber || foundRep.mobile)}`} 
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      واتس‌اپ
                    </a>
                  )}
                  {foundRep.hasBale && (foundRep.baleNumber || foundRep.mobile) && (
                    <a 
                      href={`https://ble.ir/${foundRep.baleNumber || foundRep.mobile}`} 
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      پیام‌رسان بله
                    </a>
                  )}
                  {foundRep.hasRequestForm && (
                    <button 
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="flex items-center justify-center gap-2 w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      ثبت درخواست
                    </button>
                  )}
                  {foundRep.locationCoordinates && (
                    <a 
                      href={`https://nshn.ir/?lat=${foundRep.locationCoordinates.split(',')[0]}&lng=${foundRep.locationCoordinates.split(',')[1]}`} 
                      target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 border-2 border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 rounded-xl font-medium transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      مسیریابی با نشان
                    </a>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" className="w-full text-slate-500 hover:bg-slate-100" onClick={() => setFoundRep(null)}>
                متوجه شدم، بستن
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <InquiryLeadModal 
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        productName={product.name}
      />
    </>
  );
}
