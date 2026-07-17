'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { useCart } from '@/lib/store/CartContext';
import { LocationGateModal } from './LocationGateModal';
import { checkRepresentative } from '@/app/(storefront)/products/actions';

interface Representative {
  name: string;
  province: string;
  city: string;
  contactUrl?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export function ProductCardClient({ product }: { product: Product }) {
  const { userLocation, addItem } = useCart();
  const [isLocationGateOpen, setIsLocationGateOpen] = useState(false);
  const [isCheckingRep, setIsCheckingRep] = useState(false);
  const [foundRep, setFoundRep] = useState<Representative | null>(null);

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
      setFoundRep(rep);
    } else {
      // Add to cart directly!
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      alert('محصول به سبد خرید اضافه شد!'); // Basic feedback for now
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
          
          <div className="mt-auto flex items-center justify-between">
            <div className="text-lg font-bold text-emerald-700">
              {formatToman(product.price)}
            </div>
            <Button 
              size="sm" 
              className="rounded-full px-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
              onClick={handleBuyClick}
              disabled={isCheckingRep}
            >
              {isCheckingRep ? 'در حال بررسی...' : 'خرید'}
            </Button>
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
                
                {foundRep.contactUrl && (
                  <a 
                    href={foundRep.contactUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    تماس با نماینده
                  </a>
                )}
              </div>
              
              <Button variant="ghost" className="w-full text-slate-500 hover:bg-slate-100" onClick={() => setFoundRep(null)}>
                متوجه شدم، بستن
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
