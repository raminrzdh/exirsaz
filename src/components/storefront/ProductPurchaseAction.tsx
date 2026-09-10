'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, MessageCircle, PhoneCall, FileText, MapPin, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatToman, toPersianDigits } from '@/lib/utils/currency';
import { useCart } from '@/lib/store/CartContext';
import { InquiryLeadModal } from './InquiryLeadModal';
import { LocationGateModal } from './LocationGateModal';
import { checkRepresentative, recordLeadEvent } from '@/app/(storefront)/products/actions';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/utils/analytics';
import { useExitIntent } from '@/hooks/useExitIntent';
import { ExitIntentModal } from './ExitIntentModal';


interface Product {
    id: string;
    name: string;
    price?: number;
    salePrice?: number | null;
    image: string;
    salesType: string;
    inquiryAction?: string;
    categoryName?: string;
}

interface Agency {
    id: string;
    name: string;
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
    slug?: string;
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
    const [localAgencies, setLocalAgencies] = useState<Agency[] | null>(null);
    const [activeAgencyId, setActiveAgencyId] = useState<string | undefined>(undefined);

    const isDirectSale = product.salesType === 'DIRECT_SALE';

    const { shouldShow: showExitIntent, dismiss: dismissExitIntent } = useExitIntent({
        enabled: !isDirectSale, // Only enable for INQUIRY products
    });

    useEffect(() => {
        async function fetchAgency() {
            if (userLocation && isDirectSale) {
                setIsCheckingRep(true);
                const category = product.categoryName || (product.name.includes('سایبان') ? 'توری سایبان' : 'سایر');
                const reps = await checkRepresentative(userLocation.province, userLocation.city, category, product.id);
                if (reps && Array.isArray(reps) && reps.length > 0) {
                    setLocalAgencies(reps as Agency[]);
                } else {
                    setLocalAgencies(null);
                }
                setIsCheckingRep(false);
            } else {
                setLocalAgencies(null);
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
        trackEvent('add_to_cart', { productId: product.id, name: product.name, quantity });
        toast.success('محصول به سبد خرید اضافه شد!');
    };

    const handleAgencyContact = async (agency: Agency, type: 'CALL' | 'WHATSAPP') => {
        // Fire and forget analytics event
        recordLeadEvent(agency.id, type).catch(console.error);
        trackEvent('contact_agent_clicked', { agencyId: agency.id, type, product: product.id });

        if (type === 'WHATSAPP') {
            window.open(`https://wa.me/98${agency.phone?.substring(1)}?text=${encodeURIComponent(`سلام، درباره محصول ${product.name} سوال داشتم.`)}`, '_blank');
        } else {
            window.location.href = `tel:${agency.phone}`;
        }
    };

    const handleInquiryClick = () => {
        trackEvent('inquiry_clicked', { action: product.inquiryAction, product: product.id });

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
                    {(!localAgencies && !isCheckingRep) && (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-slate-500 font-medium">قیمت نهایی:</span>
                                {product.salePrice && product.price ? (
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                                                {toPersianDigits(Math.round(((product.price - product.salePrice) / product.price) * 100))}٪
                                            </span>
                                            <span className="text-sm text-slate-400 line-through decoration-rose-500/50">{formatToman(product.price * quantity)}</span>
                                        </div>
                                        <span className="text-2xl font-black text-rose-600">
                                            {formatToman(product.salePrice * quantity)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-black text-emerald-700">
                                        {product.price ? formatToman(product.price * quantity) : 'نامشخص'}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-slate-500 font-medium whitespace-nowrap">تعداد:</span>
                                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-12 flex-1 max-w-[150px]">
                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">-</button>
                                    <input type="text" readOnly value={toPersianDigits(quantity.toString())} className="w-full h-full text-center font-bold text-slate-800 bg-transparent outline-none" />
                                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-12 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">+</button>
                                </div>
                            </div>
                        </>
                    )}

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
                    ) : localAgencies ? (
                        // Case B: Agencies Exist
                        <div className="flex flex-col gap-4">
                            <div className="px-4 py-3  flex items-center gap-2 ">

                                <span className=" text-sm text-slate-600">این محصول در شهر شما توسط نمایندگان زیر عرضه می‌شود</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {localAgencies.map(agency => (
                                    <div key={agency.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                        <div className="mb-4">
                                            <Link href={`/${agency.slug}`} className="font-bold text-slate-900 text-lg hover:text-indigo-600 transition-colors block">
                                                {agency.name}
                                            </Link>
                                            <p className="text-sm text-slate-500 mt-1">جهت خرید مستقیماً با نمایندگی تماس بگیرید.</p>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            {agency.hasPhoneCall && (agency.phoneCallNumber || agency.phone || agency.mobile) && (
                                                <a
                                                    href={`tel:${agency.phoneCallNumber || agency.phone || agency.mobile}`}
                                                    className="flex items-center justify-center gap-2 w-full h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors"
                                                    onClick={() => trackEvent('contact_agent_clicked', { agencyId: agency.id, type: 'CALL', product: product.id })}
                                                >
                                                    <PhoneCall className="w-4 h-4" />
                                                    تماس تلفنی
                                                </a>
                                            )}
                                            {agency.hasWhatsapp && (agency.whatsappNumber || agency.mobile) && (
                                                <a
                                                    href={`https://wa.me/${(agency.whatsappNumber || agency.mobile)!.startsWith('0') ? '98' + (agency.whatsappNumber || agency.mobile)!.substring(1) : (agency.whatsappNumber || agency.mobile)}?text=${encodeURIComponent(`سلام، درباره محصول ${product.name} سوال داشتم.`)}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                                                    onClick={() => trackEvent('contact_agent_clicked', { agencyId: agency.id, type: 'WHATSAPP', product: product.id })}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                                                    واتس‌اپ
                                                </a>
                                            )}
                                            {agency.hasBale && (agency.baleNumber || agency.mobile) && (
                                                <a
                                                    href={`https://ble.ir/${agency.baleNumber || agency.mobile}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full h-11 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
                                                    onClick={() => trackEvent('contact_agent_clicked', { agencyId: agency.id, type: 'BALE', product: product.id })}
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    پیام‌رسان بله
                                                </a>
                                            )}
                                            {agency.hasRequestForm && (
                                                <button
                                                    onClick={() => {
                                                        setActiveAgencyId(agency.id);
                                                        setIsInquiryModalOpen(true);
                                                    }}
                                                    className="flex items-center justify-center gap-2 w-full h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    ثبت درخواست از نماینده
                                                </button>
                                            )}
                                            {agency.locationCoordinates && (
                                                <a
                                                    href={`https://nshn.ir/?lat=${agency.locationCoordinates.split(',')[0]}&lng=${agency.locationCoordinates.split(',')[1]}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full h-11 border-2 border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 rounded-xl font-medium transition-colors"
                                                    onClick={() => trackEvent('contact_agent_clicked', { agencyId: agency.id, type: 'NAVIGATION', product: product.id })}
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                    مسیریابی با نشان
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                productId={product.id}
                agencyId={activeAgencyId}
            />

            <ExitIntentModal
                isOpen={showExitIntent}
                onClose={dismissExitIntent}
                productName={product.name}
            />
        </div>
    );
}
