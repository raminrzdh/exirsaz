'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, MessageCircle, PhoneCall, FileText, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { useCart } from '@/lib/store/CartContext';
import { InquiryLeadModal } from './InquiryLeadModal';
import { LocationGateModal } from './LocationGateModal';
import { checkRepresentative, recordLeadEvent } from '@/app/(storefront)/products/actions';

interface Product {
  id: string;
  name: string;
  price?: number;
  image: string;
  salesType: string;
  inquiryAction?: string;
  categoryName?: string;
}

interface Agency {
  id: string;
  name: string;
  phone?: string;
}

interface ProductPurchaseActionProps {
  product: Product;
}

export function ProductPurchaseAction({ product }: ProductPurchaseActionProps) {
  const { userLocation, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLocationGateOpen, setIsLocationGateOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isCheckingRep, setIsCheckingRep] = useState(false);
  const [localAgency, setLocalAgency] = useState<Agency | null>(null);

  const isDirectSale = product.salesType === 'DIRECT_SALE';

  useEffect(() => {
    async function fetchAgency() {
      if (userLocation && isDirectSale) {
        setIsCheckingRep(true);
        const category = product.categoryName || (product.name.includes('سایبان') ? 'توری سایبان' : 'سایر');
        const rep = await checkRepresentative(userLocation.province, userLocation.city, category, product.id);
        setLocalAgency(rep);
        setIsCheckingRep(false);
      } else {
        setLocalAgency(null);
      }
    }
    fetchAgency();
  }, [userLocation, isDirectSale, product.name, product.categoryName, product.id]);

  const handleAddToCart = () => {
    if (!userLocation) {
      setIsLocationGateOpen(true);
      return;
    }
    
    // We already know localAgency is null if they can add to cart
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.image,
      quantity,
    });
    alert('محصول به سبد خرید اضافه شد!');
  };

  const handleAgencyContact = async (type: 'CALL' | 'WHATSAPP') => {
    if (!localAgency) return;
    
    // Fire and forget analytics event
    recordLeadEvent(localAgency.id, type).catch(console.error);
    
    if (type === 'WHATSAPP') {
      window.open(`https://wa.me/98${localAgency.phone?.substring(1)}?text=${encodeURIComponent(`سلام، درباره محصول ${product.name} سوال داشتم.`)}`, '_blank');
    } else {
      window.location.href = `tel:${localAgency.phone}`;
    }
  };

  const handleInquiryClick = () => {
    if (product.inquiryAction === 'WHATSAPP_REDIRECT') {
      const message = encodeURIComponent(`سلام، من مایل به استعلام قیمت محصول ${product.name} هستم.`);
      window.open(`https://wa.me/989120000000?text=${message}`, '_blank');
    } else if (product.inquiryAction === 'LEAD_FORM') {
      setIsInquiryModalOpen(true);
    } else {
      // CALL_TO_PRICE
      window.location.href = 'tel:02100000000';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
      {isDirectSale ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-500 font-medium">قیمت محصول:</span>
            <span className="text-2xl font-black text-emerald-700">
              {product.price ? formatToman(product.price) : 'نامشخص'}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-slate-500 font-medium whitespace-nowrap">تعداد:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-12 flex-1 max-w-[150px]">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">-</button>
              <input type="text" readOnly value={toPersianDigits(quantity.toString())} className="w-full h-full text-center font-bold text-slate-800 bg-transparent outline-none" />
              <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">+</button>
            </div>
          </div>

          {!userLocation ? (
            // Case A: No Location Set
            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 gap-2"
              onClick={() => setIsLocationGateOpen(true)}
            >
              <MapPin className="w-5 h-5" />
              بررسی موجودی و خرید در شهر شما
            </Button>
          ) : isCheckingRep ? (
            <Button size="lg" className="w-full h-14 text-lg bg-slate-200 text-slate-500 gap-2" disabled>
              در حال بررسی نمایندگی...
            </Button>
          ) : localAgency ? (
            // Case B: Agency Exists
            <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2 text-amber-800">
                <Store className="w-5 h-5" />
                <span className="font-bold text-sm">این محصول در شهر شما توسط نمایندگی رسمی عرضه میشود</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{localAgency.name}</h4>
                  <p className="text-sm text-slate-500">جهت خرید و دریافت مشاوره مستقیماً با نمایندگی تماس بگیرید.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => handleAgencyContact('WHATSAPP')}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    پیام در واتس‌اپ
                  </button>
                  <button 
                    onClick={() => handleAgencyContact('CALL')}
                    className="flex-1 flex items-center justify-center gap-2 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    تماس تلفنی
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Case C: No Agency (Direct Online Purchase)
            <Button 
              size="lg" 
              className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              افزودن به سبد خرید
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 pb-6 border-b border-slate-200 text-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">فروش با استعلام قیمت</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              با توجه به نوسانات بازار یا تخصصی بودن این محصول، جهت اطلاع از قیمت دقیق و مشاوره خرید با کارشناسان ما در ارتباط باشید.
            </p>
          </div>
          
          <Button 
            size="lg" 
            className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 gap-2"
            onClick={handleInquiryClick}
          >
            {product.inquiryAction === 'WHATSAPP_REDIRECT' && <MessageCircle className="w-5 h-5" />}
            {product.inquiryAction === 'CALL_TO_PRICE' && <PhoneCall className="w-5 h-5" />}
            {product.inquiryAction === 'LEAD_FORM' && <FileText className="w-5 h-5" />}
            
            {product.inquiryAction === 'WHATSAPP_REDIRECT' ? 'استعلام در واتس‌اپ' : 
             product.inquiryAction === 'LEAD_FORM' ? 'ثبت درخواست استعلام' : 
             'تماس جهت استعلام قیمت'}
          </Button>
        </>
      )}

      <LocationGateModal 
        isOpen={isLocationGateOpen} 
        onClose={() => setIsLocationGateOpen(false)}
        onLocationSet={() => setIsLocationGateOpen(false)}
      />
      
      <InquiryLeadModal 
        isOpen={isInquiryModalOpen} 
        onClose={() => setIsInquiryModalOpen(false)} 
        productName={product.name}
      />
    </div>
  );
}
